import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HistoryList } from '@/components/HistoryList'
import type { Roteiro } from '@/types/database.types'

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: roteiros } = await supabase
    .from('roteiros')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Historico de Roteiros</h1>
        <p className="mt-2 text-muted-foreground">
          Todos os roteiros que voce gerou.
        </p>
      </div>

      <HistoryList initialRoteiros={(roteiros as Roteiro[]) || []} />
    </div>
  )
}
