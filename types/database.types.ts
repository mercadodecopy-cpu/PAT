export type Plan = 'free' | 'pro' | 'enterprise'
export type Modo = 'livre' | 'quick' | 'advanced' | 'expert'
export type Template = 'padrao' | 'screenplay' | 'bullets' | 'timestamps' | 'markdown' | 'minimalista'
export type Operacao = 'generate' | 'reformat' | 'chat_turn'

export interface Profile {
  id: string
  full_name: string | null
  plan: Plan
  roteiros_gerados_hoje: number
  roteiros_gerados_total: number
  created_at: string
  updated_at: string
}

export interface Roteiro {
  id: string
  user_id: string
  titulo: string
  modo: Modo
  template: Template
  nicho: string | null
  duracao_minutos: number | null
  inputs: Record<string, unknown>
  conteudo: string | null
  titulo_sugerido: string | null
  descricao: string | null
  capitulos: Array<{ titulo: string; timestamp: string }> | null
  tokens_usados: number
  tempo_geracao_segundos: number | null
  versao_prompt: string | null
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  operacao: Operacao
  modo: string | null
  tokens_input: number
  tokens_output: number
  custo_estimado_usd: number
  sucesso: boolean
  erro_mensagem: string | null
  created_at: string
}

export interface RateLimit {
  user_id: string
  roteiros_hoje: number
  ultimo_reset: string
  updated_at: string
}

// Supabase Database type for type-safe queries
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Pick<Profile, 'id'> & Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      roteiros: {
        Row: Roteiro
        Insert: Omit<Roteiro, 'id' | 'created_at' | 'updated_at' | 'tokens_usados'> & {
          id?: string
          tokens_usados?: number
        }
        Update: Partial<Omit<Roteiro, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      usage_logs: {
        Row: UsageLog
        Insert: Omit<UsageLog, 'id' | 'created_at'> & { id?: string }
        Update: never
      }
      rate_limits: {
        Row: RateLimit
        Insert: Pick<RateLimit, 'user_id'> & Partial<Omit<RateLimit, 'user_id' | 'updated_at'>>
        Update: Partial<Omit<RateLimit, 'user_id' | 'updated_at'>>
      }
    }
  }
}
