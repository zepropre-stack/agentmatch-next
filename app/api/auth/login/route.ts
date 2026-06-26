import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { createServerClient } from '@supabase/ssr'
export async function POST(req:NextRequest) {
  const {email,password}=await req.json()
  if(!email||!password)return NextResponse.json({error:'Email et mot de passe requis'},{status:400})
  const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>[],setAll:()=>{}}})
  const {data,error}=await supabase.auth.signInWithPassword({email,password})
  if(error)return NextResponse.json({error:'Email ou mot de passe incorrect'},{status:401})
  const admin=createAdminSupabase()
  const role=data.user.user_metadata?.role||'AGENT'
  let profile=null
  if(role==='AGENT'){const {data:p}=await admin.from('agent_profiles').select('*').eq('user_id',data.user.id).single();profile=p}
  else{const {data:p}=await admin.from('company_profiles').select('*').eq('user_id',data.user.id).single();profile=p}
  const res=NextResponse.json({success:true,user:{id:data.user.id,email:data.user.email,role,profile}})
  res.cookies.set('sb-access-token',data.session.access_token,{httpOnly:true,secure:true,sameSite:'lax',maxAge:data.session.expires_in,path:'/'})
  res.cookies.set('sb-refresh-token',data.session.refresh_token,{httpOnly:true,secure:true,sameSite:'lax',maxAge:60*60*24*30,path:'/'})
  return res
}
