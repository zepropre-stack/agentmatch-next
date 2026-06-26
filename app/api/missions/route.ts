import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sector = searchParams.get('sector')
  const status = searchParams.get('status') || 'active'
  const admin = createAdminSupabase()
  let query = admin
    .from('missions')
    .select('*, company_profiles(name, logo_url)')
    .eq('status', status)
    .order('created_at', { ascending: false })
  if (sector) query = query.eq('sector', sector)
  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  const body = await req.json()
  const admin = createAdminSupabase()
  const { data: company } = await admin
    .from('company_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!company) {
    return NextResponse.json({ error: 'Profil entreprise introuvable' }, { status: 404 })
  }
  const { data, error } = await admin
    .from('missions')
    .insert({ ...body, company_id: company.id, status: 'active' })
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data, { status: 201 })
}
