'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/components/ChatMessage'
import { GeneratingState } from '@/components/GeneratingState'
import { useChat } from '@/hooks/useChat'

const WELCOME_MESSAGE = {
  role: 'assistant' as const,
  content:
    'Ola! Vou te ajudar a criar um roteiro de video. Vamos comecar?\n\nSobre o que sera o seu video?',
}

export default function LivrePage() {
  const { messages, isStreaming, isGenerating, error, sendMessage } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // All messages including welcome
  const allMessages = [WELCOME_MESSAGE, ...messages]

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length, messages])

  // Focus input after streaming completes
  useEffect(() => {
    if (!isStreaming && !isGenerating) {
      inputRef.current?.focus()
    }
  }, [isStreaming, isGenerating])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isStreaming || isGenerating) return
    setInput('')
    sendMessage(text)
  }

  if (isGenerating) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/create"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos modos
        </Link>
        <GeneratingState streamedText="" />
        <p className="mt-4 text-sm text-muted-foreground">
          Coletei todas as informacoes. Agora a IA esta gerando seu roteiro completo...
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/create"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos modos
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Modo Livre</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Responda as perguntas e a IA vai criar seu roteiro.
        </p>
      </div>

      {/* Chat messages */}
      <div className="space-y-4 mb-6 min-h-[300px]">
        {allMessages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              Pensando...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua resposta..."
          disabled={isStreaming || isGenerating}
          className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          autoFocus
        />
        <Button type="submit" disabled={!input.trim() || isStreaming || isGenerating}>
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
