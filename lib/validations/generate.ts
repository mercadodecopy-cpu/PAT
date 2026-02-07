import { z } from 'zod/v4'

export const NICHOS = [
  'atletas-biografias',
  'crime-documentario',
  'educacao-cientifica',
  'transformacao-pessoal',
  'ciencia-experimental-raw',
  'ciencia-experimental-narrativo',
  'animacao-mensagem-social',
  'ensaio-cinematografico',
  'educacao-visual-abstrata',
  'historia-militar',
] as const

export const NICHOS_LABELS: Record<string, string> = {
  'atletas-biografias': 'Atletas / Biografias',
  'crime-documentario': 'Crime / Documentário',
  'educacao-cientifica': 'Educação Científica',
  'transformacao-pessoal': 'Transformação Pessoal',
  'ciencia-experimental-raw': 'Ciência Experimental (Raw)',
  'ciencia-experimental-narrativo': 'Ciência Experimental (Narrativo)',
  'animacao-mensagem-social': 'Animação / Mensagem Social',
  'ensaio-cinematografico': 'Ensaio Cinematográfico',
  'educacao-visual-abstrata': 'Educação Visual Abstrata',
  'historia-militar': 'História Militar',
}

export const DURACOES = [5, 10, 15, 30] as const

export const DURACOES_LABELS: Record<number, string> = {
  5: '5 minutos',
  10: '10 minutos',
  15: '15 minutos',
  30: '30 minutos',
}

export const TEMPLATES = [
  'padrao',
  'screenplay',
  'bullets',
  'timestamps',
  'markdown',
  'minimalista',
] as const

export const TEMPLATES_LABELS: Record<string, string> = {
  padrao: 'Texto Corrido (padrão)',
  screenplay: 'Screenplay (audiovisual)',
  bullets: 'Bullet Points (estruturado)',
  timestamps: 'Timestamps (teleprompter)',
  markdown: 'Markdown Completo',
  minimalista: 'Minimalista',
}

export const quickGenerateSchema = z.object({
  mode: z.literal('quick'),
  inputs: z.object({
    titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    duracao: z.number().refine((v) => DURACOES.includes(v as typeof DURACOES[number]), {
      message: 'Duração inválida',
    }),
    nicho: z.enum(NICHOS),
  }),
  template: z.enum(TEMPLATES).default('padrao'),
})

export type QuickGenerateInput = z.infer<typeof quickGenerateSchema>
