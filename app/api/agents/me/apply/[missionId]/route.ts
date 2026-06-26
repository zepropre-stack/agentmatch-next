import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'
export async function POST(req:NextRequest,{params}:{params: {missionId:string}}) {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
  const admin=createAdminSupabase()
  const {data:agent}=await admin.from('agent_profiles').select('id,first_name,last_name').eq('user_id',user.id).single()
  if(!agent)return NextResponse.json({error:'Profil agent introuvable'},{status:404})
  const {data:mission}=await admin.from('missions').select('*').eq('id',params.missionId).single()
  if(!mission)return NextResponse.json({error:'Mission introuvable'},{status:404})
  const {message}=await req.json().catch(()=>({message:''}))
  const {data:app,error}=await admin.from('applications').insert({mission_id:params.missionId,agent_id:agent.id,message:message||null,status:'PENDING'}).select().single()
  if(error)return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json(app,{status:201})
}
