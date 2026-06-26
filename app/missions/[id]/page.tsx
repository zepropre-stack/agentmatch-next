import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase-server'
import CandidaterButton from '@/components/CandidaterButton'
interface Props { params: { id: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = createAdminSupabase()
  const { data } = await admin.from('missions').select('title,sector,region,description').eq('id', params.id).single()
  if (!data) return { title: 'Mission introuvable' }
  return { title: `${data.title} — Mission ${data.sector} | AgentMatch AI`, description: `${data.description?.slice(0,160)}...` }
}
export default async function MissionPage({ params }: Props) {
  const admin = createAdminSupabase()
  const { data: mission } = await admin.from('missions').select('*, company_profiles(name,sector,logo_url,description,website)').eq('id', params.id).single()
  if(!mission||mission.status==='CLOSED')notFound()
  const company=(mission as {company_profiles?:{\name:string;sector:string;logo_url?:string;description?:string;website?:string}}).company_profiles
  const timeAgo=(d:string)=>{const days=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(days===0)return "Aujourd'hui";if(days===1)return 'Hier';return `Il y a ${days} jours`}
  return(
    <div style={{paddingTop:100,minHeight:'100vh'}}>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'0 24px 80px'}}>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:32}}><Link href="/missions" style={{color:'#60a5fa', textDecoration:'none'}}>Missions</Link><span>/</span><span>{mission.title}</span></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:32,alignItems:'start'}}>
          <div>
            <div className="card" style={{padding:32,marginBottom:24}}>
              <h1>{mission.title}</h1>
              <div style={{color:'#60a5fa'}}>{company?.name||'Entreprise confidentielle'}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:16}}>
                <span>{mission.sector}</span><span>{mission.region}</span>
                {mission.remote&&<span>🌐 Remote</span>}
                <span>{timeAgo(mission.created_at)}</span>
              </div>
            </div>
            <div className="card" style={{padding:28,marginBottom:24}}>
              <h2>Description de la mission</h2>
              <div style={{color:'#94a3b8',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{mission.description}</div>
            </div>
          </div>
          <div style={{position:'sticky',top:90}}>
            <div className="card" style={{padding:24,marginBottom:16}}>
              {mission.commission&&(<div style={{textAlign:'center',marginBottom:20}}><div style={{color:'#94a3b8'}}>Rémunération</div><div style={{color:'#f59e0b',fontWeight:800,}}>{mission.commission}</div></div>)}
              <CandidaterButton missionId={mission.id} missionTitle={mission.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
