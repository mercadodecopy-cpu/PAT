'use client'

import { useState } from 'react'
import { Copy, Download, ArrowLeft, Check, Clock, Cpu, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Roteiro } from '@/types/database.types'

interface RoteiroDisplayProps {
  roteiro: Roteiro
}

export function RoteiroDisplay({ roteiro }: RoteiroDisplayProps) {
  const [copied, setCopied] = useState(false)

  async function copyToClipboard() {
    if (!roteiro.conteudo) return
    await navigator.clipboard.writeText(roteiro.conteudo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadRoteiro() {
    if (!roteiro.conteudo) return
    const blob = new Blob([roteiro.conteudo], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roteiro-${roteiro.titulo.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const createdAt = new Date(roteiro.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/create"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Criar novo
        </Link>
        <Link
          href="/history"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Ver historico
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{roteiro.titulo_sugerido || roteiro.titulo}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge variant="secondary">{roteiro.modo.toUpperCase()}</Badge>
          {roteiro.nicho && <Badge variant="outline">{roteiro.nicho}</Badge>}
          {roteiro.duracao_minutos && (
            <Badge variant="outline">{roteiro.duracao_minutos} min</Badge>
          )}
          <Badge variant="outline">{roteiro.template}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{createdAt}</p>
      </div>

      {/* Description if available */}
      {roteiro.descricao && (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium mb-1">Descricao sugerida:</p>
          <p className="text-sm text-muted-foreground">{roteiro.descricao}</p>
        </div>
      )}

      {/* Chapters if available */}
      {roteiro.capitulos && roteiro.capitulos.length > 0 && (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium mb-2">Capitulos:</p>
          <div className="space-y-1">
            {roteiro.capitulos.map((cap, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                [{cap.timestamp}] {cap.titulo}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={copyToClipboard} variant="outline" size="sm">
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
        <Button onClick={downloadRoteiro} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Baixar
        </Button>
      </div>

      <Separator />

      {/* Content */}
      <div className="rounded-lg border bg-muted/30 p-6 md:p-8">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {roteiro.conteudo || 'Roteiro em geracao...'}
        </pre>
      </div>

      {/* Technical metadata */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {roteiro.tokens_usados > 0 && (
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            {roteiro.tokens_usados.toLocaleString()} tokens
          </span>
        )}
        {roteiro.tempo_geracao_segundos && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {roteiro.tempo_geracao_segundos}s de geracao
          </span>
        )}
        {roteiro.versao_prompt && (
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Prompt {roteiro.versao_prompt}
          </span>
        )}
      </div>
    </div>
  )
}
