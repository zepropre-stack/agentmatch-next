import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardNav from '@/components/DashboardNav'
export default async function DashboardLayout({children}:{children:React.ReactNode}) {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)redirect('/login?redirect=/dashboard')
  const role=user.user_metadata?.role||'AGENT'
  return(<div style={{display:'flex',minHeight:'100vh',paddingTop:68}}><DashboardNav role={role}/><main style={{flex:1,padding:'32px',marginLeft:240,minHeight:'calc(100vh - 68px)',background:'var(--bg)'}}>{children}</main></div>)
}
