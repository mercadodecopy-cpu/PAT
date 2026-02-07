import Anthropic from '@anthropic-ai/sdk'

function getClient(): Anthropic {
  const apiKey = process.env.ROTEIRO_ANTHROPIC_KEY
  if (!apiKey) {
    throw new Error('ROTEIRO_ANTHROPIC_KEY não configurada no .env.local')
  }
  return new Anthropic({ apiKey })
}

interface GenerateResult {
  content: string
  tokensInput: number
  tokensOutput: number
}

export async function generateRoteiro(
  systemPrompt: string,
  userPrompt: string
): Promise<GenerateResult> {
  const anthropic = getClient()

  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    stream: true,
  })

  let fullContent = ''
  let tokensInput = 0
  let tokensOutput = 0

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullContent += event.delta.text
    }
    if (event.type === 'message_start') {
      tokensInput = event.message.usage.input_tokens
    }
    if (event.type === 'message_delta') {
      tokensOutput = event.usage.output_tokens
    }
  }

  return { content: fullContent, tokensInput, tokensOutput }
}

export function generateRoteiroStream(
  systemPrompt: string,
  userPrompt: string
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  let tokensInput = 0
  let tokensOutput = 0
  let fullContent = ''

  return new ReadableStream({
    async start(controller) {
      try {
        const anthropic = getClient()

        const stream = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          stream: true,
        })

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullContent += event.delta.text
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', text: event.delta.text })}\n\n`)
            )
          }
          if (event.type === 'message_start') {
            tokensInput = event.message.usage.input_tokens
          }
          if (event.type === 'message_delta') {
            tokensOutput = event.usage.output_tokens
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'done',
              content: fullContent,
              tokensInput,
              tokensOutput,
            })}\n\n`
          )
        )
        controller.close()
      } catch (error) {
        let message = error instanceof Error ? error.message : 'Erro desconhecido'

        // Translate common API errors
        if (message.includes('credit balance is too low')) {
          message = 'Sem creditos na API Anthropic. Adicione creditos em console.anthropic.com > Plans & Billing.'
        } else if (message.includes('invalid x-api-key') || message.includes('authentication')) {
          message = 'Chave da API Anthropic invalida. Verifique ANTHROPIC_API_KEY no .env.local.'
        } else if (message.includes('rate limit') || message.includes('overloaded')) {
          message = 'API temporariamente sobrecarregada. Tente novamente em alguns segundos.'
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`)
        )
        controller.close()
      }
    },
  })
}
