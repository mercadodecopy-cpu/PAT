'use client'

import { useState } from 'react'
import { Copy, Download, ArrowLeft, Check, Clock, Cpu, FileText, Plus, Pencil, X, Save, FileDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TEMPLATES_LABELS, NICHOS_LABELS } from '@/lib/validations/generate'
import { exportToPdf } from '@/lib/export/pdf'
import { exportToDocx } from '@/lib/export/docx'
import type { Roteiro } from '@/types/database.types'

interface RoteiroDisplayProps {
  roteiro: Roteiro
}

export function RoteiroDisplay({ roteiro: initialRoteiro }: RoteiroDisplayProps) {
  const [roteiro, setRoteiro] = useState(initialRoteiro)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  // Edit state
  const [editTitulo, setEditTitulo] = useState(roteiro.titulo)
  const [editConteudo, setEditConteudo] = useState(roteiro.conteudo || '')
  const [editDescricao, setEditDescricao] = useState(roteiro.descricao || '')

  function startEditing() {
    setEditTitulo(roteiro.titulo)
    setEditConteudo(roteiro.conteudo || '')
    setEditDescricao(roteiro.descricao || '')
    setSaveMsg(null)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setSaveMsg(null)
  }

  async function saveEdits() {
    setIsSaving(true)
    setSaveMsg(null)

    try {
      const res = await fetch(`/api/roteiros/${roteiro.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: editTitulo,
          conteudo: editConteudo,
          descricao: editDescricao || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao salvar')
      }

      const updated = await res.json()
      setRoteiro({ ...roteiro, ...updated })
      setIsEditing(false)
      setSaveMsg('Salvo!')
      setTimeout(() => setSaveMsg(null), 2000)
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setIsSaving(false)
    }
  }

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
        {isEditing ? (
          <input
            type="text"
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-ring"
          />
        ) : (
          <h1 className="text-3xl font-bold">{roteiro.titulo_sugerido || roteiro.titulo}</h1>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge variant="secondary">{roteiro.modo.toUpperCase()}</Badge>
          {roteiro.nicho && (
            <Badge variant="outline">{NICHOS_LABELS[roteiro.nicho] || roteiro.nicho}</Badge>
          )}
          {roteiro.duracao_minutos && (
            <Badge variant="outline">{roteiro.duracao_minutos} min</Badge>
          )}
          <Badge variant="outline">{TEMPLATES_LABELS[roteiro.template] || roteiro.template}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{createdAt}</p>
      </div>

      {/* Description */}
      {isEditing ? (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium mb-1">Descricao sugerida:</p>
          <input
            type="text"
            value={editDescricao}
            onChange={(e) => setEditDescricao(e.target.value)}
            placeholder="Descricao do video (opcional)"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ) : roteiro.descricao ? (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium mb-1">Descricao sugerida:</p>
          <p className="text-sm text-muted-foreground">{roteiro.descricao}</p>
        </div>
      ) : null}

      {/* Chapters if available */}
      {!isEditing && roteiro.capitulos && roteiro.capitulos.length > 0 && (
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
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button onClick={saveEdits} size="sm" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button onClick={cancelEditing} variant="outline" size="sm" disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={startEditing} variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
            <Button onClick={downloadRoteiro} variant="outline" size="sm" title="Baixar como TXT">
              <Download className="h-4 w-4 mr-2" />
              TXT
            </Button>
            <Button onClick={() => exportToPdf(roteiro)} variant="outline" size="sm" title="Baixar como PDF">
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => exportToDocx(roteiro)} variant="outline" size="sm" title="Baixar como DOCX">
              <FileText className="h-4 w-4 mr-2" />
              DOCX
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Novo Roteiro
              </Link>
            </Button>
          </>
        )}
        {saveMsg && (
          <span
            className={`text-sm ${saveMsg === 'Salvo!' ? 'text-green-600' : 'text-destructive'}`}
          >
            {saveMsg}
          </span>
        )}
      </div>

      <Separator />

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editConteudo}
          onChange={(e) => setEditConteudo(e.target.value)}
          className="w-full min-h-[500px] rounded-lg border bg-background p-6 font-sans text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring md:p-8"
        />
      ) : (
        <div className="rounded-lg border bg-muted/30 p-6 md:p-8">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {roteiro.conteudo || 'Roteiro em geracao...'}
          </pre>
        </div>
      )}

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
