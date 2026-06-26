import { createAdminSupabase } from '@/lib/supabase-server'
import AgentCard from '@/components/AgentCard'
import AgentFilters from '@/components/AgentFilters'
import type { AgentProfile } from '@/types'
export default async function AgentsPage({ searchParams }: { searchParams: { sector?: string; region?: string; remote?: string; page?: string } }) {
  const page = parseInt(searchParams.page || '1'); const limit = 12; const from = (page-1)*limit
  const admin = createAdminSupabase()
  let q = admin.from('agent_profiles').select('*',{count:'exact'}).eq('available',true).order('score',{ascending:false}).range(from,from+limit-1)
  if(searchParams.sector) q=q.contains('sectors',[searchParams.sector])
  if(searchParams.region) q=q.ilike('region',`%${searchParams.region}%`)
  const {data:agents,count}=await q
  const SECTORS=['SaaS & Tech','Finance & Assurance','Immobilier','Industrie']
  const REGIONS=['Île-de-France','Auvergne-Rhône-Alpes','Occitanie']
  return(<div style={{paddingTop:100,minHeight:'100vh'}}><div style={{maxWidth:1280,margin:'0 auto', padding:'0 24px'}}><h1>Agents commerciaux ({count})</h1><div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:32}}><AgentFilters sectors={SECTORS} regions={REGIONS} current={{sector:searchParams.sector,region:searchParams.region,remote:searchParams.remote}}/><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>{(agents as AgentProfile[])?.map(a=><AgentCard key={a.id} agent={a}/>)}</div></div></div></div>)
}
