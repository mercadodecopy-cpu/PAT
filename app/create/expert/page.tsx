'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Separator } from '@/components/ui/separator'
import { GeneratingState } from '@/components/GeneratingState'
import {
  NICHOS_LABELS,
  NICHO_GROUPS,
  DURACOES,
  DURACOES_LABELS,
  TEMPLATES,
  TEMPLATES_LABELS,
  PUBLICOS,
  PUBLICOS_LABELS,
  TONS,
  TONS_LABELS,
  OBJETIVOS,
  OBJETIVOS_LABELS,
  NIVEIS_VOCABULARIO,
  NIVEIS_VOCABULARIO_LABELS,
} from '@/lib/validations/generate'

export default function ExpertPage() {
  const router = useRouter()
  // Base fields (same as Advanced)
  const [titulo, setTitulo] = useState('')
  const [duracao, setDuracao] = useState<string>('')
  const [nicho, setNicho] = useState<string>('')
  const [publico, setPublico] = useState<string>('')
  const [tom, setTom] = useState<string>('')
  const [objetivo, setObjetivo] = useState<string>('')
  const [template, setTemplate] = useState('padrao')
  // Expert-only fields
  const [autoresReferencia, setAutoresReferencia] = useState('')
  const [nivelVocabulario, setNivelVocabulario] = useState('intermediario')
  const [instrucoesCustom, setInstrucoesCustom] = useState('')
  const [referenciasTexto, setReferenciasTexto] = useState('')
  // State
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!titulo.trim() || !duracao || !nicho || !publico || !tom || !objetivo) {
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
          mode: 'expert',
          inputs: {
            titulo: titulo.trim(),
            duracao: Number(duracao),
            nicho,
            publico,
            tom,
            objetivo,
            autores_referencia: autoresReferencia.trim() || undefined,
            nivel_vocabulario: nivelVocabulario,
            instrucoes_custom: instrucoesCustom.trim() || undefined,
            referencias_texto: referenciasTexto.trim() || undefined,
          },
          template,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao gerar roteiro')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream não disponível')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) continue

          let data: { type: string; text?: string; error?: string; id?: string }
          try {
            data = JSON.parse(jsonStr)
          } catch {
            continue
          }

          if (data.type === 'text') {
            setStreamedText((prev) => prev + data.text)
          } else if (data.type === 'error') {
            throw new Error(data.error || 'Erro na geração')
          } else if (data.type === 'roteiroId') {
            roteiroId = data.id || null
          }
        }
      }

      if (roteiroId) {
        router.push(`/roteiro/${roteiroId}`)
      } else {
        throw new Error('Roteiro gerado mas ID não foi recebido. Verifique seu histórico.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
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
          <CardTitle className="text-2xl">Modo Expert</CardTitle>
          <CardDescription>
            Controle total sobre cada elemento do roteiro. Personalize autores, vocabulario,
            instrucoes e referencias. Geracao em 60-90 segundos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* === Base Fields === */}
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Titulo / Tema do video <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Por que Nikola Tesla morreu pobre?"
                required
                minLength={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracao">
                  Duracao <span className="text-destructive">*</span>
                </Label>
                <Select value={duracao} onValueChange={setDuracao} required>
                  <SelectTrigger id="duracao">
                    <SelectValue placeholder="Selecione" />
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
                <Label htmlFor="objetivo">
                  Objetivo <span className="text-destructive">*</span>
                </Label>
                <Select value={objetivo} onValueChange={setObjetivo} required>
                  <SelectTrigger id="objetivo">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {OBJETIVOS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {OBJETIVOS_LABELS[o]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publico">
                  Publico-alvo <span className="text-destructive">*</span>
                </Label>
                <Select value={publico} onValueChange={setPublico} required>
                  <SelectTrigger id="publico">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLICOS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PUBLICOS_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tom">
                  Tom <span className="text-destructive">*</span>
                </Label>
                <Select value={tom} onValueChange={setTom} required>
                  <SelectTrigger id="tom">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TONS_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* === Expert-only Fields === */}
            <p className="text-sm font-medium text-muted-foreground">Customizacoes Expert</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nivel_vocabulario">Nivel de vocabulario</Label>
                <Select value={nivelVocabulario} onValueChange={setNivelVocabulario}>
                  <SelectTrigger id="nivel_vocabulario">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVEIS_VOCABULARIO.map((n) => (
                      <SelectItem key={n} value={n}>
                        {NIVEIS_VOCABULARIO_LABELS[n]}
                      </SelectItem>
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autores">Autores de referencia</Label>
              <Input
                id="autores"
                value={autoresReferencia}
                onChange={(e) => setAutoresReferencia(e.target.value)}
                placeholder="Ex: Malcolm Gladwell, Yuval Harari, Carl Sagan"
              />
              <p className="text-xs text-muted-foreground">
                Nomes separados por virgula. A IA vai absorver o estilo de pensamento desses
                autores.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrucoes">Instrucoes customizadas</Label>
              <Textarea
                id="instrucoes"
                value={instrucoesCustom}
                onChange={(e) => setInstrucoesCustom(e.target.value)}
                placeholder="Descreva qualquer requisito especifico para o roteiro..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencias">Materiais de referencia (texto)</Label>
              <Textarea
                id="referencias"
                value={referenciasTexto}
                onChange={(e) => setReferenciasTexto(e.target.value)}
                placeholder="Cole aqui trechos de textos, roteiros ou materiais que servem de inspiracao..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                A IA usa como inspiracao estrutural, sem copiar diretamente.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              Gerar Roteiro Expert
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
