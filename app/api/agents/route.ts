import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
  const from = (page - 1) * limit
  const supabase = createAdminSupabase()
  let query = supabase.from('agent_profiles').select('*', { count: 'exact' }).eq('available', true).order('score', { ascending: false }).range(from, from+limit-1)
  const sector = searchParams.get('sector'); if (sector) query = query.contains('sectors', [sector])
  const region = searchParams.get('region'); if (region) query = query.ilike('region', `%${region}%`)
  const { data, count } = await query
  return NextResponse.json({ agents: data, total: count, page, limit })
}
