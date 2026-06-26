import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password, name, sector, size, website, description, phone, plan } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }

  const admin = createAdminSupabase()

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || 'Erreur création compte' }, { status: 400 })
  }

  const { error: profileError } = await admin.from('company_profiles').insert({
    user_id: authData.user.id,
    email,
    name: name || '',
    sector: sector || '',
    size: size || '',
    website: website || '',
    description: description || '',
    phone: phone || '',
    plan: plan || 'starter',
  })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  await sendEmail({
    to: email,
    subject: 'Bienvenue sur AgentMatch AI',
    html: '<h1>Bienvenue ' + (name || '') + ' !</h1><p>Votre compte entreprise a bien été créé sur AgentMatch AI.</p>',
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
