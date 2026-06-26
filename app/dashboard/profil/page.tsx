import { createClient, createAdminSupabase } from '@/lib/supabase-server'
import ProfilEditor from '@/components/ProfilEditor'
export default async function DashboardProfilPage() {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  const role=user?.user_metadata?.role||'AGENT'
  const admin=createAdminSupabase()
  let profile=null
  if(role==='AGENT'){const {data}=await admin.from('agent_profiles').select('*').eq('user_id',user!.id).single();profile=data}else{const {data}=await admin.from('company_profiles').select('*').eq('user_id',user!.id).single();profile=data}
  return(<div><div style={{marginBottom:28}}><h1>{role==='AGENT'?'Mon profil agent':'Mon profil entreprise'}</h1><p style={{color:'#64748b'}}>Complétez votre profil pour améliorer votre visibilité</p></div><ProfilEditor profile={profile} role={role} email={user?.email||''} /></div>)
}
