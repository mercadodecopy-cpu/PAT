'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface UseChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  isGenerating: boolean
  error: string | null
  sendMessage: (text: string) => Promise<void>
}

export function useChat(): UseChatReturn {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming || isGenerating) return

      setError(null)

      // Add user message
      const userMsg: ChatMessage = { role: 'user', content: text }
      const updatedMessages = [...messages, userMsg]
      setMessages(updatedMessages)
      setIsStreaming(true)

      abortRef.current = new AbortController()

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
          signal: abortRef.current.signal,
        })

        if (!response.ok) {
          let errorMsg = 'Erro no chat'
          try {
            const data = await response.json()
            errorMsg = data.error || errorMsg
          } catch {
            errorMsg = `Erro ${response.status}: ${response.statusText || errorMsg}`
          }
          throw new Error(errorMsg)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Stream nao disponivel')

        const decoder = new TextDecoder()
        let buffer = ''
        let assistantContent = ''
        let roteiroId: string | null = null

        const processLine = (line: string) => {
          if (!line.startsWith('data: ')) return
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) return

          let data: { type: string; text?: string; error?: string; id?: string }
          try {
            data = JSON.parse(jsonStr)
          } catch {
            return
          }

          switch (data.type) {
            case 'text':
              assistantContent += data.text || ''
              // Update the assistant message in real-time
              setMessages((prev) => {
                const last = prev[prev.length - 1]
                if (last?.role === 'assistant') {
                  return [...prev.slice(0, -1), { role: 'assistant', content: assistantContent }]
                }
                return [...prev, { role: 'assistant', content: assistantContent }]
              })
              break
            case 'generating':
              // Server is now generating the full roteiro
              setIsStreaming(false)
              setIsGenerating(true)
              break
            case 'roteiroId':
              roteiroId = data.id || null
              break
            case 'error':
              throw new Error(data.error || 'Erro no chat')
          }
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            processLine(line)
          }
        }

        // Process residual buffer
        if (buffer.trim()) {
          for (const line of buffer.split('\n')) {
            processLine(line)
          }
        }

        // If roteiro was generated, redirect
        if (roteiroId) {
          router.push(`/roteiro/${roteiroId}`)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setIsStreaming(false)
        setIsGenerating(false)
        abortRef.current = null
      }
    },
    [messages, isStreaming, isGenerating, router]
  )

  return { messages, isStreaming, isGenerating, error, sendMessage }
}
