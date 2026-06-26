import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'

export async function POST(
  req: NextRequest,
  { params }: { params: { missionId: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  const admin = createAdminSupabase()
  const { data: agent } = await admin
    .from('agent_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!agent) {
    return NextResponse.json({ error: 'Profil agent introuvable' }, { status: 404 })
  }
  const body = await req.json().catch(() => ({}))
  const { data, error } = await admin
    .from('applications')
    .insert({
      agent_id: agent.id,
      mission_id: params.missionId,
      cover_letter: body.cover_letter || '',
      status: 'pending',
    })
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data, { status: 201 })
}
