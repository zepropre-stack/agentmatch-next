import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('id', params.id)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: 'Agent introuvable' }, { status: 404 })
  }
  return NextResponse.json(data)
}
