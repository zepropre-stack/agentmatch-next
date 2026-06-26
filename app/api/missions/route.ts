import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'
const PLAN_LIMITS:Record<string,number>={STARTER:3,PRO:5,BUSINESS:Infinity}
export async function GET(req:NextRequest) {
  try{
    const {searchParams}=new URL(req.url)
    const page=parseInt(searchParams.get('page')||'1');const limit=Math.min(parseInt(searchParams.get('limit')||'12'),50);const from=(page-1)*limit
    const supabase=createAdminSupabase()
    let q=supabase.from('missions').select('*,company_profiles!inner(name,sector,logo_url)',{count:'exact'}).eq('status','ACTIVE').order('featured',{ascending:false}).order('created_at',{ascending:false}).range(from,from+limit-1)
    const s=searchParams
    if(s.get('sector'))q=q.eq('sector',o.get('sector'))
    if(s.get('region'))q=q.ilike('region',`%${s.get('region')}%`)
    if(s.get('remote')==='1')q=q.eq('remote',true)
    const {data,count,error}=await q
    if(error)throw error
    return NextResponse.json({missions:data,total:count,page,limit})
  }catch(err){console.error('[GET missions]',err);return NextResponse.json({error:'Erreur serveur'},{status:500})}
}
export async function POST(req:NextRequest) {
  try{
    const supabase=await createClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
    if(user.user_metadata?.role!=='COMPANY'return NextResponse.json({error:'Réservé aux entreprises'},{status:403})
    const admin=createAdminSupabase()
    const {data:company}=await admin.from('company_profiles').select('id,plan,plan_expires').eq('user_id',user.id).single()
    if(!company)return NextResponse.json({error:'Profil entreprise introuvable'},{status:404})
    if(!company.plan)return NextResponse.json({error:'Abonnement requis pour publiâ une mission'},{status:402})
    if(company.plan_expires&&new Date(company.plan_expires)<new Date())return NextResponse.json({error:'Abonnement expiré'},{status:402})
    const max=PLAN_LIMITS[company.plan]??0
    if(isFinite(max)){const {count}=await admin.from('missions').select('id',{count:'exact',head:true}).eq('company_id',company.id).eq('status','ACTIVE');if((count??0)>=max)return NextResponse.json({error:`Limite atteinte (${max} missions actives)`},{status:403})}
    const {title,description,sector,region,remote,mission_type,experience,commission,budget}=await req.json()
    if(!title||!description||!sector||!region)return NextResponse.json({error:'Champs requis manquants'},{status:400})
    const {data:mission,error}=await admin.from('missions').insert({company_id:company.id,title,description,sector,region,remote:remote??false,mission_type:mission_type||'CDI',experience:experience??0,commission:commission||null,budget:budget||null,status:'ACTIVE',featured:false}).select().single()
    if(error)throw error
    return NextResponse.json(mission,{status:201})
  }catch(err){console.error('[POST missions]',err);return NextResponse.json({error:'Erreur serveur'},{status:500})}
}
