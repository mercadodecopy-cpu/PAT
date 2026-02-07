'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoteiroCard } from '@/components/RoteiroCard'
import type { Roteiro } from '@/types/database.types'

interface HistoryListProps {
  initialRoteiros: Roteiro[]
}

export function HistoryList({ initialRoteiros }: HistoryListProps) {
  const [roteiros, setRoteiros] = useState(initialRoteiros)

  function handleDelete(id: string) {
    setRoteiros((prev) => prev.filter((r) => r.id !== id))
  }

  if (roteiros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 px-4 text-center">
        <p className="text-lg font-medium">Nenhum roteiro ainda</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie seu primeiro roteiro e ele aparecera aqui.
        </p>
        <Button asChild className="mt-6">
          <Link href="/create">
            <Plus className="h-4 w-4 mr-2" />
            Criar Roteiro
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {roteiros.map((roteiro) => (
        <RoteiroCard key={roteiro.id} roteiro={roteiro} onDelete={handleDelete} />
      ))}
    </div>
  )
}
