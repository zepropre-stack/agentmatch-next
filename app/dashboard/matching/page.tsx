import { createClient, createAdminSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MatchingView from '@/components/MatchingView'

export default async function DashboardMatchingPage({
  searchParams,
}: {
  searchParams: { mission?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const role = user.user_metadata?.role || 'AGENT'
  const admin = createAdminSupabase()

  if (role === 'COMPANY') {
    const { data: company } = await admin.from('company_profiles').select('id, plan').eq('user_id', user.id).single()
    const { data: missions } = await admin.from('missions').select('id, title, sector, region').eq('company_id', company?.id || '').eq('status', 'ACTIVE')
    let matches: unknown[] = []
    if (searchParams.mission) {
      const { data } = await admin.from('matches').select('*, agent_profiles(*)').eq('mission_id', searchParams.mission).order('score', { ascending: false })
      matches = data || []
    }
    return (<div><div style={{marginBottom:28}}><h1 style={{fontSize:26,fontWeight:800,color:'#f1f5f9',margin:'0 0 6px'}}>Matching IA</h1><p style={{color:'#64748b'}}>Trouvez les meilleurs profils pour vos missions</p></div><MatchingView role="COMPANY" missions={missions || []} initialMatches={matches} selectedMissionId={searchParams.mission} plan={company?.plan || null} /></div>)
  }
  const { data: agent } = await admin.from('agent_profiles').select('*').eq('user_id', user.id).single()
  const { data: matches } = await admin.from('matches').select('*, missions(*, company_profiles(name))').eq('agent_id', agent?.id || '').order('score', { ascending: false }).limit(10)
  return (<div><div style={{marginBottom:28}}><h1>Mes matchs IA</h1><p style={{color:'#64748b'}}>Les missions les plus compatibles avec votre profil</p></div><MatchingView role="AGENT" matches={matches || []} /></div>)
}
