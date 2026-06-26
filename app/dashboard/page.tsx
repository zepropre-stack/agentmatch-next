import { createClient, createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import { PLANS } from '@/types'
export default async function DashboardPage() {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  const role=user?.user_metadata?.role||'AGENT'
  const admin=createAdminSupabase()
  let stats:Record<string,number>={};let profile:Record<string,unknown>={};let recentItems:unknown[]=[]
  if(role==='AGENT'){
    const {data:p}=await admin.from('agent_profiles').select('*').eq('user_id',user!.id).single()
    profile=p||{}
    const {count:aC}=await admin.from('applications').select('id',{count:'exact',head:true}).eq('agent_id',(p as {id?:string})?.id||'')
    const {count:mC}=await admin.from('matches').select('id',{count:'exact',head:true}).eq('agent_id',(p as {id?:string})?.id||'')
    stats={applications:aC||0,matches:mC||0}
    const {data:recent}=await admin.from('applications').select('*,missions(title,sector,region,company_profiles(name))').eq('agent_id',(p as {id?:string})?.id||'').order('created_at',{ascending:false}).limit(5)
    recentItems=recent||[]
  }else{
    const {data:p}=await admin.from('company_profiles').select('*').eq('user_id',user!.id).single()
    profile=p||{}
    const cId=(p as {id?:string})?.id||''
    const {count:mC}=await admin.from('missions').select('id',{count:'exact',head:true}).eq('company_id',cId).eq('status','ACTIVE')
    const {count:aC}=await admin.from('applications').select('id',{count:'exact',head:true}).in('mission_id',(await admin.from('missions').select('id').eq('company_id',cId)).data?.map((m:{id:string})=>m.id)||[])
    stats={missions:mC||0,applications:aC||0}
    const {data:recent}=await admin.from('missions').select('*,applications(count)').eq('company_id',cId).order('created_at',{ascending:false}).limit(5)
    recentItems=recent||[]
  }
  const plan=(profile as {plan?:string}).plan as undefined|string
  const planInfo=plan?PLANS[plan.toLowerCase() as 'starter'|'pro'|'business']:null
  const firstName=role==='AGENT'?(profile as {first_name?:string}).first_name:(profile as {name?:string}).name?.split(' ')[0]
  return(<div><div style={{marginBottom:32}}><h1>Bonjour, {firstName||'vous'} 👋</h1><p>Voici votre tableau de bord AgentMatch AI</p></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:32}}>{role==='AGENT'?[{)applications:stats.applications,label:'Candidatures envoyées',icon:'📬',color:'#60a5fa'},{value:stats.matches,label:'Matchs IA reçus',icon:'🧠',color:'#a78bfa'}]:[{value:stats.missions,label:'Missions actives',icon:'📋',color:'#60a5fa'},{value:stats.applications,label:'Candidatures reçues',icon:'📬',color:'#a78bfa'},{value:planInfo?.name||'Aucun',label:'Plan actuel',icon:'💀',color:'#f59e0b'}].map((s,i)=>(<div key={i} style={{background:'#0f1d3a',border:'1px solid #1e3060',borderRadius:14,padding:'20px 22px'}}><div>{s.icon}</div><div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.value}</div><div style={{color:'#64748b',fontSize:13}}>{s.label}</div></div>))}</div></sektion></div>)
}
