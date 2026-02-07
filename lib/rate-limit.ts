import { createClient } from '@/lib/supabase/server'

const RATE_LIMITS: Record<string, number> = {
  free: 5,
  pro: 50,
  enterprise: -1, // unlimited
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = await createClient()

  // Get user plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = profile?.plan || 'free'
  const limit = RATE_LIMITS[plan] ?? 5

  // Unlimited plan
  if (limit === -1) {
    return { allowed: true, remaining: Infinity, limit: -1 }
  }

  // Get current rate limit record
  const { data: rateLimit } = await supabase
    .from('rate_limits')
    .select('roteiros_hoje, ultimo_reset')
    .eq('user_id', userId)
    .single()

  if (!rateLimit) {
    // No record yet - create one
    await supabase.from('rate_limits').insert({ user_id: userId })
    return { allowed: true, remaining: limit - 1, limit }
  }

  // Check if needs daily reset
  const today = new Date().toISOString().split('T')[0]
  if (rateLimit.ultimo_reset < today) {
    await supabase
      .from('rate_limits')
      .update({ roteiros_hoje: 0, ultimo_reset: today })
      .eq('user_id', userId)
    return { allowed: true, remaining: limit - 1, limit }
  }

  const remaining = limit - rateLimit.roteiros_hoje
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining - 1),
    limit,
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  const supabase = await createClient()

  // Increment rate_limits counter
  const { data: rateLimit } = await supabase
    .from('rate_limits')
    .select('roteiros_hoje')
    .eq('user_id', userId)
    .single()

  await supabase
    .from('rate_limits')
    .update({ roteiros_hoje: (rateLimit?.roteiros_hoje ?? 0) + 1 })
    .eq('user_id', userId)

  // Increment profile counters
  const { data: profile } = await supabase
    .from('profiles')
    .select('roteiros_gerados_hoje, roteiros_gerados_total')
    .eq('id', userId)
    .single()

  await supabase
    .from('profiles')
    .update({
      roteiros_gerados_hoje: (profile?.roteiros_gerados_hoje ?? 0) + 1,
      roteiros_gerados_total: (profile?.roteiros_gerados_total ?? 0) + 1,
    })
    .eq('id', userId)
}
