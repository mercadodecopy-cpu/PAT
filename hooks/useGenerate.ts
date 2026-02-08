'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface UseGenerateReturn {
  isGenerating: boolean
  streamedText: string
  error: string | null
  generate: (body: Record<string, unknown>) => Promise<void>
}

/**
 * Hook reutilizavel para gerar roteiros via SSE stream.
 * Centraliza toda a logica de stream, buffer, error handling e redirect.
 */
export function useGenerate(): UseGenerateReturn {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (body: Record<string, unknown>) => {
    // Previne duplo-click
    if (isGenerating) return

    setError(null)
    setIsGenerating(true)
    setStreamedText('')

    // Abort controller para cancelar se necessario
    abortRef.current = new AbortController()
    let roteiroId: string | null = null

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        let errorMsg = 'Erro ao gerar roteiro'
        try {
          const data = await response.json()
          errorMsg = data.error || errorMsg
        } catch {
          // Se nao consegue parsear, usa status text
          errorMsg = `Erro ${response.status}: ${response.statusText || errorMsg}`
        }
        throw new Error(errorMsg)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream nao disponivel')

      const decoder = new TextDecoder()
      let buffer = ''

      // Funcao para processar linhas SSE
      const processLine = (line: string) => {
        if (!line.startsWith('data: ')) return
        const jsonStr = line.slice(6).trim()
        if (!jsonStr) return

        let data: { type: string; text?: string; error?: string; id?: string }
        try {
          data = JSON.parse(jsonStr)
        } catch {
          return // Linha incompleta, ignora
        }

        switch (data.type) {
          case 'text':
            setStreamedText((prev) => prev + (data.text || ''))
            break
          case 'error':
            throw new Error(data.error || 'Erro na geracao')
          case 'roteiroId':
            roteiroId = data.id || null
            break
          case 'done':
            // Geracao completa no server — roteiroId vem em seguida
            break
        }
      }

      // Ler stream
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

      // Processar buffer residual (importante: roteiroId pode estar aqui)
      if (buffer.trim()) {
        for (const line of buffer.split('\n')) {
          processLine(line)
        }
      }

      // Redirect ou erro
      if (roteiroId) {
        router.push(`/roteiro/${roteiroId}`)
      } else {
        throw new Error('Roteiro gerado mas ID nao foi recebido. Verifique seu historico.')
      }
    } catch (err) {
      // Ignorar erro de abort (usuario cancelou)
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsGenerating(false)
      abortRef.current = null
    }
  }, [isGenerating, router])

  return { isGenerating, streamedText, error, generate }
}
