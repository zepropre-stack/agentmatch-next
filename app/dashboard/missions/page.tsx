import { createClient, createAdminSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MissionManager from '@/components/MissionManager'

export default async function DashboardMissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'COMPANY') redirect('/dashboard')

  const admin = createAdminSupabase()
  const { data: company } = await admin.from('company_profiles').select('id, plan, plan_expires').eq('user_id', user.id).single()
  const { data: missions } = await admin.from('missions').select('*, applications(count)').eq('company_id', company?.id || '').order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>Mes missions</h1>
          <p style={{ color: '#64748b', margin: 0 }}>{missions?.length || 0} mission(s) publiée(s)</p>
        </div>
        {company?.plan ? (
          <Link href="/dashboard/missions/new" style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            + Nouvelle mission
          </Link>
        ) : (
          <Link href="/pricing" style={{ padding: '11px 22px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            💎 Activer un plan
          </Link>
        )}
      </div>

      <MissionManager missions={missions || []} companyId={company?.id || ''} />
    </div>
  )
}
