import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GenerateResult {
  content: string
  tokensInput: number
  tokensOutput: number
}

export async function generateRoteiro(
  systemPrompt: string,
  userPrompt: string
): Promise<GenerateResult> {
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
            // Send text chunk as SSE
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

        // Send final metadata
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
        const message = error instanceof Error ? error.message : 'Erro desconhecido'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`)
        )
        controller.close()
      }
    },
  })
}
