'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Clock, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TEMPLATES_LABELS, NICHOS_LABELS } from '@/lib/validations/generate'
import type { Roteiro } from '@/types/database.types'

interface RoteiroCardProps {
  roteiro: Roteiro
  onDelete?: (id: string) => void
}

export function RoteiroCard({ roteiro, onDelete }: RoteiroCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const title = roteiro.titulo_sugerido || roteiro.titulo
  const preview = roteiro.conteudo
    ? roteiro.conteudo.slice(0, 150).replace(/\n/g, ' ') + (roteiro.conteudo.length > 150 ? '...' : '')
    : 'Roteiro em geracao...'

  const createdAt = new Date(roteiro.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/roteiros/${roteiro.id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete?.(roteiro.id)
      }
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="group relative rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20">
      <Link href={`/roteiro/${roteiro.id}`} className="block space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{createdAt}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{preview}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {roteiro.modo.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {TEMPLATES_LABELS[roteiro.template] || roteiro.template}
          </Badge>
          {roteiro.nicho && (
            <Badge variant="outline" className="text-xs">
              {NICHOS_LABELS[roteiro.nicho] || roteiro.nicho}
            </Badge>
          )}
          {roteiro.duracao_minutos && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {roteiro.duracao_minutos}min
            </span>
          )}
          {roteiro.tokens_usados > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              {roteiro.tokens_usados.toLocaleString()} tokens
            </span>
          )}
        </div>
      </Link>

      {/* Delete button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant={confirmDelete ? 'destructive' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          disabled={deleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
