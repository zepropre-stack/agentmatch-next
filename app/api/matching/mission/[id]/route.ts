import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'
import { computeMatchScore } from '@/lib/matching'
import { sendMatchNotificationEmail } from '@/lib/resend'
const PLAN_LIMITS:Record<string,number>={STARTER:5,PRO:15,BUSINESS:Infinity}
export async function POST(_:NextRequest,{params}:{params:{id:string}}){
  try{
    const supabase=await createClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
    if(user.user_metadata?.role!=='COMPANY'return NextResponse.json({error:'Réservé aux entreprises'},{status:403})
    const admin=createAdminSupabase()
    const {data:company}=await admin.from('company_profiles').select('id,plan,plan_expires').eq('user_id',user.id).single()
    if(!company?.plan)return NextResponse.json({error:'Abonnement requis'},{status:402})
    if(company.plan==='STARTER'return NextResponse.json({error:'Matching IA disponible à partir du plan Pro'},{status:403})
    const limit=PLAN_LIMITS[company.plan]??0
    const {data:mission}=await admin.from('missions').select('*').eq('id',params.id).eq('company_id',company.id).single()
    if(!mission)return NextResponse.json({error:'Mission introuvable'},{status:404})
    const {data:agents}=await admin.from('agent_profiles').select('*').eq('available',true)
    if(!agents?.length)return NextResponse.json({matches:[]})
    const scored=agents.map(a=>({agent:a,...computeMatchScore(a as never,mission as never)})).filter(r=>r.total>=30).sort((a,b)=>b.total-a.total).slice(0,limit)
    if(scored.length){
      await admin.from('matches').delete().eq('mission_id',params.id)
      await admin.from('matches').insert(scored.map(r=>({mission_id:params.id,agent_id:r.agent.id,score:r.total,breakdown:r.breakdown})))
      for(const r of scored.filter(r=>r.total>=70).slice(0,5)){
        const {data:aUser}=await admin.auth.admin.getUserById(r.agent.user_id)
        if(aUser.user?.email)await sendMatchNotificationEmail(aUser.user.email,`${r.agent.first_name} ${r.agent.last_name}`,mission.title,company.name||'',r.total).catch(console.error)
      }
    }
    return NextResponse.json({matches:scored.map(r=>({agent:r.agent,score:r.total,breakdown:r.breakdown}))})
  }catch(err){console.error('[POST matching/mission/id]',err);return NextResponse.json({error:'Erreur serveur'},{status:500})}
}
export async function GET(_:NextRequest,{params}:{params:{id:string}}){
  const admin=createAdminSupabase()
  const {data}=await admin.from('matches').select('*,agent_profiles(*)').eq('mission_id',params.id).order('score',{ascending:false})
  return NextResponse.json({matches:data||[]})
}
