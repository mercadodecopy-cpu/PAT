import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod/v4'

const updateRoteiroSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  conteudo: z.string().min(1).optional(),
  descricao: z.string().max(500).nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = updateRoteiroSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('roteiros')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao atualizar roteiro' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  // RLS ensures user can only delete their own roteiros
  const { error } = await supabase.from('roteiros').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Erro ao deletar roteiro' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
