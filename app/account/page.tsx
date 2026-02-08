import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, BarChart3, Zap, Calendar } from 'lucide-react'
import type { Profile, RateLimit, UsageLog } from '@/types/database.types'

const PLAN_LABELS: Record<string, string> = {
  free: 'Gratuito',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  pro: 50,
  enterprise: -1,
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch data in parallel
  const [profileRes, rateLimitRes, usageLogsRes, roteirosCountRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('rate_limits').select('*').eq('user_id', user.id).single(),
    supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('roteiros').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const profile = profileRes.data as Profile | null
  const rateLimit = rateLimitRes.data as RateLimit | null
  const usageLogs = (usageLogsRes.data as UsageLog[]) || []
  const totalRoteiros = roteirosCountRes.count ?? 0

  const plan = profile?.plan || 'free'
  const planLimit = PLAN_LIMITS[plan] ?? 5
  const usedToday = rateLimit?.roteiros_hoje ?? 0

  // Aggregate usage stats
  const totalTokensInput = usageLogs.reduce((sum, log) => sum + (log.tokens_input || 0), 0)
  const totalTokensOutput = usageLogs.reduce((sum, log) => sum + (log.tokens_output || 0), 0)
  const totalCost = usageLogs.reduce((sum, log) => sum + (log.custo_estimado_usd || 0), 0)

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })
    : 'N/A'

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <p className="mt-2 text-muted-foreground">Gerencie sua conta e acompanhe seu uso.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Informacoes da sua conta</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {profile?.full_name && (
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{profile.full_name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Plano</p>
              <Badge variant={plan === 'free' ? 'secondary' : 'default'} className="mt-1">
                {PLAN_LABELS[plan] || plan}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membro desde</p>
              <p className="font-medium">{memberSince}</p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Today Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Uso Diario</CardTitle>
              <CardDescription>Limite de roteiros por dia</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold">{usedToday}</span>
                <span className="text-sm text-muted-foreground">
                  de {planLimit === -1 ? 'ilimitado' : planLimit} roteiros
                </span>
              </div>
              {planLimit !== -1 && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((usedToday / planLimit) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {planLimit === -1 ? (
                <p>Seu plano Enterprise tem geracao ilimitada.</p>
              ) : usedToday >= planLimit ? (
                <p className="text-destructive">
                  Limite diario atingido. Reseta a meia-noite (UTC).
                </p>
              ) : (
                <p>
                  {planLimit - usedToday} roteiro{planLimit - usedToday !== 1 ? 's' : ''} restante
                  {planLimit - usedToday !== 1 ? 's' : ''} hoje.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Estatisticas</CardTitle>
              <CardDescription>Resumo do seu uso</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de roteiros</p>
                <p className="text-2xl font-bold">{totalRoteiros}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Custo estimado</p>
                <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tokens de input</p>
                <p className="text-lg font-semibold">{totalTokensInput.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tokens de output</p>
                <p className="text-lg font-semibold">{totalTokensOutput.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Ultimas 10 geracoes</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {usageLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
            ) : (
              <div className="space-y-3">
                {usageLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${log.sucesso ? 'bg-green-500' : 'bg-destructive'}`}
                      />
                      <span className="capitalize">{log.modo || log.operacao}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
