import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    email, password, first_name, last_name, sector, title,
    experience_years, daily_rate, location, remote, skills, bio
  } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }

  const admin = createAdminSupabase()

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'AGENT' },
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || 'Erreur creation compte' }, { status: 400 })
  }

  const { error: profileError } = await admin.from('agent_profiles').insert({
    user_id: authData.user.id,
    first_name: first_name || '',
    last_name: last_name || '',
    email,
    sector: sector || '',
    title: title || '',
    experience_years: experience_years ? Number(experience_years) : 0,
    daily_rate: daily_rate ? Number(daily_rate) : null,
    location: location || '',
    remote: remote || false,
    skills: skills || [],
    bio: bio || '',
    available: true,
  })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  await sendEmail({
    to: email,
    subject: 'Bienvenue sur AgentPrime AI',
    html: '<h1>Bienvenue ' + (first_name || '') + ' !</h1><p>Votre compte AgentPrime AI a bien ete cree.</p><p><a href="https://agentprime.fr/dashboard">Acceder a mon dashboard</a></p>',
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
