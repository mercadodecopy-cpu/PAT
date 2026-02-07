import { z } from 'zod/v4'

export const NICHOS = [
  // Originais do PRINCIPIOS_DESTILADOS_v2
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
  // Populares / Prováveis
  'tecnologia-reviews',
  'financas-investimentos',
  'saude-bem-estar',
  'culinaria-gastronomia',
  'viagem-turismo',
  'games-esports',
  'musica-analise',
  'cinema-series',
  'empreendedorismo',
  'marketing-digital',
  'psicologia-comportamento',
  'filosofia-reflexao',
  'historia-geral',
  'politica-geopolitica',
  'educacao-geral',
  'humor-entretenimento',
  'moda-beleza',
  'esportes-geral',
  'meio-ambiente-sustentabilidade',
  'religiao-espiritualidade',
  // Inusitados / Nichados
  'true-crime-misterios',
  'conspiracao-teorias',
  'espaco-astronomia',
  'arqueologia-civilizacoes',
  'artes-marciais',
  'automobilismo-mecanica',
  'diy-projetos-manuais',
  'paranormal-sobrenatural',
  'mitologia-lendas',
  'matematica-logica',
  // Curinga
  'outro',
] as const

export const NICHOS_LABELS: Record<string, string> = {
  // Originais
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
  // Populares
  'tecnologia-reviews': 'Tecnologia / Reviews',
  'financas-investimentos': 'Finanças / Investimentos',
  'saude-bem-estar': 'Saúde / Bem-Estar',
  'culinaria-gastronomia': 'Culinária / Gastronomia',
  'viagem-turismo': 'Viagem / Turismo',
  'games-esports': 'Games / eSports',
  'musica-analise': 'Música / Análise Musical',
  'cinema-series': 'Cinema / Séries',
  'empreendedorismo': 'Empreendedorismo',
  'marketing-digital': 'Marketing Digital',
  'psicologia-comportamento': 'Psicologia / Comportamento',
  'filosofia-reflexao': 'Filosofia / Reflexão',
  'historia-geral': 'História Geral',
  'politica-geopolitica': 'Política / Geopolítica',
  'educacao-geral': 'Educação Geral',
  'humor-entretenimento': 'Humor / Entretenimento',
  'moda-beleza': 'Moda / Beleza',
  'esportes-geral': 'Esportes Geral',
  'meio-ambiente-sustentabilidade': 'Meio Ambiente / Sustentabilidade',
  'religiao-espiritualidade': 'Religião / Espiritualidade',
  // Inusitados
  'true-crime-misterios': 'True Crime / Mistérios',
  'conspiracao-teorias': 'Conspirações / Teorias',
  'espaco-astronomia': 'Espaço / Astronomia',
  'arqueologia-civilizacoes': 'Arqueologia / Civilizações Antigas',
  'artes-marciais': 'Artes Marciais / Lutas',
  'automobilismo-mecanica': 'Automobilismo / Mecânica',
  'diy-projetos-manuais': 'DIY / Projetos Manuais',
  'paranormal-sobrenatural': 'Paranormal / Sobrenatural',
  'mitologia-lendas': 'Mitologia / Lendas',
  'matematica-logica': 'Matemática / Lógica',
  // Curinga
  'outro': 'Outro (a IA adapta)',
}

// Group labels for the select dropdown
export const NICHO_GROUPS = {
  'Nichos Especializados': [
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
  ],
  'Populares': [
    'tecnologia-reviews',
    'financas-investimentos',
    'saude-bem-estar',
    'culinaria-gastronomia',
    'viagem-turismo',
    'games-esports',
    'musica-analise',
    'cinema-series',
    'empreendedorismo',
    'marketing-digital',
    'psicologia-comportamento',
    'filosofia-reflexao',
    'historia-geral',
    'politica-geopolitica',
    'educacao-geral',
    'humor-entretenimento',
    'moda-beleza',
    'esportes-geral',
    'meio-ambiente-sustentabilidade',
    'religiao-espiritualidade',
  ],
  'Nichados': [
    'true-crime-misterios',
    'conspiracao-teorias',
    'espaco-astronomia',
    'arqueologia-civilizacoes',
    'artes-marciais',
    'automobilismo-mecanica',
    'diy-projetos-manuais',
    'paranormal-sobrenatural',
    'mitologia-lendas',
    'matematica-logica',
    'outro',
  ],
} as const

export const DURACOES = [5, 10, 15, 20, 30, 45, 60] as const

export const DURACOES_LABELS: Record<number, string> = {
  5: '5 minutos',
  10: '10 minutos',
  15: '15 minutos',
  20: '20 minutos',
  30: '30 minutos',
  45: '45 minutos',
  60: '1 hora',
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
