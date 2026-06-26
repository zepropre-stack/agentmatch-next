import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendVerificationEmail } from '@/lib/resend'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone, sector, region } = await req.json()
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Mot de passe trop court (min 8 caractères)' }, { status: 400 })
    }

    const supabase = createAdminSupabase()
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: false,
      user_metadata: { role: 'AGENT', firstName, lastName },
    })
    if (authError) {
      if (authError.message.includes('already')) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
      throw authError
    }
    const userId = authData.user.id
    const { error: profileError } = await supabase.from('agent_profiles').insert({
      user_id: userId, first_name: firstName, last_name: lastName,
      phone: phone || null, sectors: sector ? [sector] : [],
      region: region || '', city: '',
      title: `Commercial ${sector || ''}`.trim(),
      skills: [], experience: 0, available: true, score: 0,
    })
    if (profileError) throw profileError
    const token = randomUUID()
    await supabase.from('email_verifications').insert({ user_id: userId, token, expires_at: new Date(Date.now()+24*60*60*1000).toISOString() })
    await sendVerificationEmail(email, firstName, token).catch(console.error)
    return NextResponse.json({ success: true, message: 'Compte créé ! Vérifiez votre email.' }, { status: 201 })
  } catch (err: unknown) {
    console.error('[POST /api/auth/register/agent]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
