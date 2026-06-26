import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'
export async function GET() {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
  const admin=createAdminSupabase()
  const {data,error}=await admin.from('agent_profiles').select('*').eq('user_id',user.id).single()
  if(error)return NextResponse.json({error:'Profil introuvable'},{status:404})
  return NextResponse.json(data)
}
export async function PUT(req:NextRequest) {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
  const updates=await req.json()
  const admin=createAdminSupabase()
  const {data,error}=await admin.from('agent_profiles').update(updates).eq('user_id',user.id).select().single()
  if(error)return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json(data)
}
