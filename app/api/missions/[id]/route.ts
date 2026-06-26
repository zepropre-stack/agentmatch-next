import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'
export async function GET(_:NextRequest,{params}:{params:{id:string}}) {
  const admin=createAdminSupabase()
  const {data,error}=await admin.from('missions').select('*,company_profiles(name,sector,logo_url,description)').eq('id',params.id).single()
  if(error||!data)return NextResponse.json({error:'Mission introuvable'},{status:404})
  return NextResponse.json(data)
}
export async function PUT(req:NextRequest,{params}: {params: {id: string}}) {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
  const admin=createAdminSupabase()
  const {data:company}=await admin.from('company_profiles').select('id').eq('user_id',user.id).single()
  if(!company)return NextResponse.json({error:'Accès refusé'},{status:403})
  const updates=await req.json()
  const allowed=['title','description','sector','region','remote','mission_type','experience','commission','budget','status']
  const clean:Record<string,unknown>={};for(const k of allowed)if(updates[k]!==undefined)clean[k]=updates[k]
  const {data,error}=await admin.from('missions').update(clean).eq('id',params.id).eq('company_id',company.id).select().single()
  if(error)return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json(data)
}
export async function DELETE(_:NextRequest,{params}: {params: {id: string}}) {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
  const admin=createAdminSupabase()
  const {data:company}=await admin.from('company_profiles').select('id').eq('user_id',user.id).single()
  if(!company)return NextResponse.json({error:'Accès refusé'},{status:403})
  const {error}=await admin.from('missions').update({status:'CLOSED'}).eq('id',params.id).eq('company_id',company.id)
  if(error)return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({success:true})
}
