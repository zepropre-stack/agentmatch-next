import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const admin = createAdminSupabase()
    const role = user.user_metadata?.role || 'AGENT'
    let profile = null

    if (role === 'AGENT') {
      const { data } = await admin.from('agent_profiles').select('*').eq('user_id', user.id).single()
      profile = data
    } else if (role === 'COMPANY') {
      const { data } = await admin.from('company_profiles').select('*').eq('user_id', user.id).single()
      profile = data
    }

    return NextResponse.json({ id: user.id, email: user.email, role, profile })
  } catch (err) {
    console.error('[GET /api/auth/me]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
