import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/lib/prompts/system-prompt'
import { buildQuickPrompt } from '@/lib/prompts/modo-quick'
import { buildAdvancedPrompt } from '@/lib/prompts/modo-advanced'
import { buildExpertPrompt } from '@/lib/prompts/modo-expert'
import { generateRoteiroStream } from '@/lib/claude/client'
import { checkRateLimit, incrementUsage } from '@/lib/rate-limit'
import { generateSchema } from '@/lib/validations/generate'
import { calculateCost } from '@/lib/prompts/helpers'

export const maxDuration = 300 // 5 minutes for Vercel

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // 1. Authenticate
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // 2. Parse & validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const parsed = generateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { mode, inputs, template } = parsed.data

  // 3. Check rate limit
  const rateCheck = await checkRateLimit(user.id)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: 'Limite de roteiros diário atingido',
        remaining: rateCheck.remaining,
        limit: rateCheck.limit,
      },
      { status: 429 }
    )
  }

  // 4. Build prompts
  const systemPrompt = buildSystemPrompt()
  let userPrompt: string

  switch (mode) {
    case 'quick':
      userPrompt = buildQuickPrompt({ ...inputs, template })
      break
    case 'advanced':
      userPrompt = buildAdvancedPrompt({ ...inputs, template })
      break
    case 'expert':
      userPrompt = buildExpertPrompt({ ...inputs, template })
      break
    default:
      return NextResponse.json({ error: 'Modo inválido' }, { status: 400 })
  }

  // 5. Create initial roteiro record (status: generating)
  const startTime = Date.now()
  const { data: roteiro, error: insertError } = await supabase
    .from('roteiros')
    .insert({
      user_id: user.id,
      titulo: inputs.titulo,
      modo: mode,
      template: template,
      nicho: inputs.nicho,
      duracao_minutos: inputs.duracao,
      inputs: inputs as Record<string, unknown>,
      conteudo: null,
      versao_prompt: 'v2.0',
    })
    .select('id')
    .single()

  if (insertError || !roteiro) {
    console.error('Erro ao criar roteiro:', insertError)
    return NextResponse.json({ error: 'Erro ao criar roteiro' }, { status: 500 })
  }

  // 6. Stream generation from Claude
  const claudeStream = generateRoteiroStream(systemPrompt, userPrompt)
  const roteiroId = roteiro.id

  // Transform stream to intercept completion and save to DB
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  // Process in background
  ;(async () => {
    const reader = claudeStream.getReader()
    let success = false
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        // Forward to client
        await writer.write(value)

        // Check if this is the final message
        if (text.includes('"type":"done"')) {
          // Parse the done event to extract metadata
          const lines = text.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'done') {
                  success = true
                  const tempoGeracao = Math.floor((Date.now() - startTime) / 1000)
                  const parsedOutput = parseRoteiroOutput(data.content)

                  // Save completed roteiro
                  await supabase
                    .from('roteiros')
                    .update({
                      conteudo: data.content,
                      titulo_sugerido: parsedOutput.tituloSugerido,
                      descricao: parsedOutput.descricao,
                      capitulos: parsedOutput.capitulos,
                      tokens_usados: data.tokensInput + data.tokensOutput,
                      tempo_geracao_segundos: tempoGeracao,
                    })
                    .eq('id', roteiroId)

                  // Log usage
                  await supabase.from('usage_logs').insert({
                    user_id: user.id,
                    operacao: 'generate' as const,
                    modo: mode,
                    tokens_input: data.tokensInput,
                    tokens_output: data.tokensOutput,
                    custo_estimado_usd: calculateCost(data.tokensInput, data.tokensOutput),
                    sucesso: true,
                  })

                  // Increment counters
                  await incrementUsage(user.id)
                }
              } catch {
                // Parsing error, skip
              }
            }
          }
        }

        // Check if Claude stream sent an error event
        if (text.includes('"type":"error"')) {
          const lines = text.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'error') {
                  // Log failed usage
                  await supabase.from('usage_logs').insert({
                    user_id: user.id,
                    operacao: 'generate' as const,
                    modo: mode,
                    tokens_input: 0,
                    tokens_output: 0,
                    custo_estimado_usd: 0,
                    sucesso: false,
                    erro_mensagem: data.error,
                  })
                }
              } catch {
                // skip
              }
            }
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro na geração'
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`)
      )

      // Log failed usage
      await supabase.from('usage_logs').insert({
        user_id: user.id,
        operacao: 'generate' as const,
        modo: mode,
        tokens_input: 0,
        tokens_output: 0,
        custo_estimado_usd: 0,
        sucesso: false,
        erro_mensagem: message,
      })
    } finally {
      // Only send roteiroId if generation was successful
      if (success) {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'roteiroId', id: roteiroId })}\n\n`)
        )
      }
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

function parseRoteiroOutput(content: string) {
  let tituloSugerido: string | null = null
  let descricao: string | null = null
  let capitulos: Array<{ titulo: string; timestamp: string }> | null = null

  // Extract suggested title — try multiple patterns
  const tituloPatterns = [
    /T[ÍI]TULO\s*(?:SUGERIDO)?[:\s]+["']?(.+?)["']?\s*$/im,
    /^#\s+(.+)$/m,
    /^##\s+(.+)$/m,
  ]
  for (const pattern of tituloPatterns) {
    const match = content.match(pattern)
    if (match) {
      tituloSugerido = match[1].trim().replace(/^["']|["']$/g, '').replace(/\*\*/g, '')
      break
    }
  }

  // Extract description — try multiple patterns
  const descPatterns = [
    /DESCRI[ÇC][ÃA]O[:\s]+([^\n]+(?:\n(?!\n|CAP[ÍI]TULOS|##|\[)[^\n]+)*)/i,
    />\s*(.{20,})/,
  ]
  for (const pattern of descPatterns) {
    const match = content.match(pattern)
    if (match) {
      descricao = match[1].trim()
      break
    }
  }

  // Extract chapters — try timestamps first, then markdown headers
  const timestampMatches = content.matchAll(/\[(\d+:\d+(?::\d+)?(?:\s*-\s*\d+:\d+(?::\d+)?)?)\]\s*(.+)/g)
  const chapters: Array<{ titulo: string; timestamp: string }> = []
  for (const match of timestampMatches) {
    chapters.push({ timestamp: match[1], titulo: match[2].trim().replace(/\*\*/g, '') })
  }

  // Fallback: extract ## headers as chapters (for markdown/bullets templates)
  if (chapters.length === 0) {
    const headerMatches = content.matchAll(/^##\s+(?:(?:SE[ÇC][ÃA]O|PARTE|CAP[ÍI]TULO)\s*\d*[:\s]*)?(.+)$/gim)
    let index = 0
    for (const match of headerMatches) {
      const titulo = match[1].trim().replace(/\*\*/g, '')
      if (titulo.length > 2) {
        chapters.push({ timestamp: String(index), titulo })
        index++
      }
    }
  }

  if (chapters.length > 0) {
    capitulos = chapters
  }

  return { tituloSugerido, descricao, capitulos }
}
