import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = createAdminSupabase()
  const { data: mission, error: mErr } = await admin
    .from('missions')
    .select('*')
    .eq('id', params.id)
    .single()
  if (mErr || !mission) {
    return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 })
  }
  const { data: agents } = await admin
    .from('agent_profiles')
    .select('*')
    .eq('available', true)
  const scored = (agents || []).map((agent: Record<string, unknown>) => {
    let score = 0
    const skills = (mission.skills_required || []) as string[]
    const agentSkills = (agent.skills || []) as string[]
    skills.forEach((s: string) => {
      if (agentSkills.includes(s)) score += 20
    })
    if (agent.sector === mission.sector) score += 15
    if (agent.experience_years && Number(agent.experience_years) >= 3) score += 10
    return { ...agent, match_score: Math.min(score, 100) }
  })
  scored.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
    (b.match_score as number) - (a.match_score as number)
  )
  return NextResponse.json({ mission, agents: scored.slice(0, 10) })
}
