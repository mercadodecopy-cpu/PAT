import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RoteiroDisplay } from '@/components/RoteiroDisplay'
import type { Roteiro } from '@/types/database.types'

interface RoteiroPageProps {
  params: Promise<{ id: string }>
}

export default async function RoteiroPage({ params }: RoteiroPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: roteiro, error } = await supabase
    .from('roteiros')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !roteiro) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <RoteiroDisplay roteiro={roteiro as unknown as Roteiro} />
    </div>
  )
}
