'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { useGenerate } from '@/hooks/useGenerate'
import {
  NICHOS_LABELS,
  NICHO_GROUPS,
  DURACOES,
  DURACOES_LABELS,
  TEMPLATES,
  TEMPLATES_LABELS,
} from '@/lib/validations/generate'

export default function QuickPage() {
  const [titulo, setTitulo] = useState('')
  const [contexto, setContexto] = useState('')
  const [duracao, setDuracao] = useState<string>('')
  const [nicho, setNicho] = useState<string>('')
  const [template, setTemplate] = useState('padrao')
  const { isGenerating, streamedText, error, generate } = useGenerate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await generate({
      mode: 'quick',
      inputs: {
        titulo: titulo.trim(),
        contexto: contexto.trim() || undefined,
        duracao: Number(duracao),
        nicho,
      },
      template,
    })
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
            Gere um roteiro funcional em 2-3 minutos. Preencha os campos e clique em gerar.
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
              <Label htmlFor="contexto">Contexto / O que voce espera</Label>
              <Textarea
                id="contexto"
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Ex: Quero focar na mentalidade competitiva dele e como isso se aplica a negocios..."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Opcional. Descreva o que espera do roteiro, angulo desejado ou informacoes extras.
              </p>
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
