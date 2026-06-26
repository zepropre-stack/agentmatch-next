import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendVerificationEmail } from '@/lib/resend'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, companyName, sector, size } = await req.json()
    if (!firstName || !lastName || !email || !password || !companyName) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const supabase = createAdminSupabase()
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: false,
      user_metadata: { role: 'COMPANY', firstName, lastName },
    })
    if (authError) {
      if (authError.message.includes('already')) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
      throw authError
    }
    const userId = authData.user.id
    const { error: profileError } = await supabase.from('company_profiles').insert({
      user_id: userId, name: companyName, sector: sector || '', size: size || null, plan: null,
    })
    if (profileError) throw profileError
    const token = randomUUID()
    await supabase.from('email_verifications').insert({ user_id: userId, token, expires_at: new Date(Date.now()+24*60*60*1000).toISOString() })
    await sendVerificationEmail(email, firstName, token).catch(console.error)
    return NextResponse.json({ success: true, message: 'Compte entreprise créé !' }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/auth/register/company]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
