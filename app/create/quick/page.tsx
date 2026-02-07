'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GeneratingState } from '@/components/GeneratingState'
import {
  NICHOS_LABELS,
  NICHO_GROUPS,
  DURACOES,
  DURACOES_LABELS,
  TEMPLATES,
  TEMPLATES_LABELS,
} from '@/lib/validations/generate'

export default function QuickPage() {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [duracao, setDuracao] = useState<string>('')
  const [nicho, setNicho] = useState<string>('')
  const [template, setTemplate] = useState('padrao')
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!titulo.trim() || !duracao || !nicho) {
      setError('Preencha todos os campos obrigatorios.')
      return
    }

    setIsGenerating(true)
    setStreamedText('')

    let roteiroId: string | null = null

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'quick',
          inputs: {
            titulo: titulo.trim(),
            duracao: Number(duracao),
            nicho,
          },
          template,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao gerar roteiro')
      }

      // Read SSE stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream não disponível')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) continue

          let data: { type: string; text?: string; error?: string; id?: string; content?: string }
          try {
            data = JSON.parse(jsonStr)
          } catch {
            // Skip unparseable lines (incomplete JSON chunks)
            continue
          }

          if (data.type === 'text') {
            setStreamedText((prev) => prev + data.text)
          } else if (data.type === 'error') {
            throw new Error(data.error || 'Erro na geração')
          } else if (data.type === 'roteiroId') {
            roteiroId = data.id || null
          } else if (data.type === 'done') {
            // Generation complete - roteiroId should already be set
          }
        }
      }

      // Redirect to roteiro page
      if (roteiroId) {
        router.push(`/roteiro/${roteiroId}`)
      } else {
        throw new Error('Roteiro gerado mas ID não foi recebido. Verifique seu histórico.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      // Always reset generating state (unless we're redirecting)
      if (!roteiroId) {
        setIsGenerating(false)
      }
    }
  }

  if (isGenerating) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <GeneratingState streamedText={streamedText} />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/create"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos modos
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Modo Quick</CardTitle>
          <CardDescription>
            Gere um roteiro funcional em 2-3 minutos. Preencha os 3 campos obrigatorios e clique em
            gerar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Titulo / Tema do video <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Michael Jordan: O maior jogador de basquete"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">
                Duracao aproximada <span className="text-destructive">*</span>
              </Label>
              <Select value={duracao} onValueChange={setDuracao} required>
                <SelectTrigger id="duracao">
                  <SelectValue placeholder="Selecione a duracao" />
                </SelectTrigger>
                <SelectContent>
                  {DURACOES.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {DURACOES_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nicho">
                Nicho <span className="text-destructive">*</span>
              </Label>
              <Select value={nicho} onValueChange={setNicho} required>
                <SelectTrigger id="nicho">
                  <SelectValue placeholder="Selecione o nicho" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {Object.entries(NICHO_GROUPS).map(([groupName, nichos]) => (
                    <SelectGroup key={groupName}>
                      <SelectLabel>{groupName}</SelectLabel>
                      {nichos.map((n) => (
                        <SelectItem key={n} value={n}>
                          {NICHOS_LABELS[n]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Formato de output</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TEMPLATES_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Escolha antes de gerar para economizar tokens.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              Gerar Roteiro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
