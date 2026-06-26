import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = createAdminSupabase()
  const { data, error } = await admin
    .from('missions')
    .select('*, company_profiles(*)')
    .eq('id', params.id)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  const body = await req.json()
  const admin = createAdminSupabase()
  const { data, error } = await admin
    .from('missions')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  const admin = createAdminSupabase()
  const { error } = await admin
    .from('missions')
    .delete()
    .eq('id', params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}
