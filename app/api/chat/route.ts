import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildLivreChatSystemPrompt, buildLivreGeneratePrompt } from '@/lib/prompts/modo-livre'
import { buildSystemPrompt } from '@/lib/prompts/system-prompt'
import { generateRoteiroStream } from '@/lib/claude/client'
import { checkRateLimit, incrementUsage } from '@/lib/rate-limit'
import { calculateCost } from '@/lib/prompts/helpers'
import type { ChatMessage } from '@/lib/prompts/modo-livre'

export const maxDuration = 300

const PRONTO_MARKER = '[PRONTO_PARA_GERAR]'

function getClient(): Anthropic {
  const apiKey = process.env.ROTEIRO_ANTHROPIC_KEY
  if (!apiKey) {
    throw new Error('ROTEIRO_ANTHROPIC_KEY nao configurada')
  }
  return new Anthropic({ apiKey })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // 1. Auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  // 2. Parse body
  let body: { messages: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body invalido' }, { status: 400 })
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Mensagens invalidas' }, { status: 400 })
  }

  // 3. Stream chat response
  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  ;(async () => {
    try {
      const anthropic = getClient()
      const chatSystem = buildLivreChatSystemPrompt()

      // Stream the chat response
      const stream = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: chatSystem,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      })

      let fullResponse = ''

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullResponse += event.delta.text
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ type: 'text', text: event.delta.text })}\n\n`)
          )
        }
      }

      // Check if the assistant wants to generate
      if (fullResponse.includes(PRONTO_MARKER)) {
        // Extract JSON data from response
        const jsonMatch = fullResponse.match(/\{[\s\S]*"titulo"[\s\S]*\}/)
        if (!jsonMatch) {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: 'Nao consegui extrair os dados. Tente novamente.' })}\n\n`
            )
          )
          await writer.close()
          return
        }

        let dados: { titulo: string; duracao: number; tom: string; instrucoes: string }
        try {
          dados = JSON.parse(jsonMatch[0])
        } catch {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: 'Erro ao processar dados. Tente novamente.' })}\n\n`
            )
          )
          await writer.close()
          return
        }

        // Check rate limit
        const rateCheck = await checkRateLimit(user.id)
        if (!rateCheck.allowed) {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: 'Limite diario atingido.' })}\n\n`
            )
          )
          await writer.close()
          return
        }

        // Signal: now generating roteiro
        await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'generating' })}\n\n`))

        // Create roteiro record
        const startTime = Date.now()
        const { data: roteiro, error: insertError } = await supabase
          .from('roteiros')
          .insert({
            user_id: user.id,
            titulo: dados.titulo,
            modo: 'livre' as const,
            template: 'padrao' as const,
            nicho: null,
            duracao_minutos: dados.duracao,
            inputs: { ...dados, messages: messages.map((m) => ({ role: m.role, content: m.content })) },
            conteudo: null,
            versao_prompt: 'v2.0-livre',
          })
          .select('id')
          .single()

        if (insertError || !roteiro) {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: 'Erro ao criar roteiro.' })}\n\n`
            )
          )
          await writer.close()
          return
        }

        // Generate the actual roteiro
        const systemPrompt = buildSystemPrompt()
        const userPrompt = buildLivreGeneratePrompt(dados)
        const roteiroStream = generateRoteiroStream(systemPrompt, userPrompt)
        const roteiroReader = roteiroStream.getReader()
        const roteiroDecoder = new TextDecoder()

        let roteiroContent = ''
        let tokensIn = 0
        let tokensOut = 0

        while (true) {
          const { done, value } = await roteiroReader.read()
          if (done) break

          const text = roteiroDecoder.decode(value)

          // Parse SSE events from the roteiro stream
          const lines = text.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'text') {
                roteiroContent += data.text
              } else if (data.type === 'done') {
                roteiroContent = data.content
                tokensIn = data.tokensInput
                tokensOut = data.tokensOutput
              } else if (data.type === 'error') {
                await writer.write(
                  encoder.encode(`data: ${JSON.stringify({ type: 'error', error: data.error })}\n\n`)
                )
                await writer.close()
                return
              }
            } catch {
              // skip parse errors
            }
          }
        }

        // Save completed roteiro
        const tempoGeracao = Math.floor((Date.now() - startTime) / 1000)
        await supabase
          .from('roteiros')
          .update({
            conteudo: roteiroContent,
            tokens_usados: tokensIn + tokensOut,
            tempo_geracao_segundos: tempoGeracao,
          })
          .eq('id', roteiro.id)

        // Log usage
        await supabase.from('usage_logs').insert({
          user_id: user.id,
          operacao: 'generate' as const,
          modo: 'livre',
          tokens_input: tokensIn,
          tokens_output: tokensOut,
          custo_estimado_usd: calculateCost(tokensIn, tokensOut),
          sucesso: true,
        })

        await incrementUsage(user.id)

        // Send roteiroId to client
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'roteiroId', id: roteiro.id })}\n\n`)
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro no chat'
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`)
      )
    } finally {
      await writer.close()
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
