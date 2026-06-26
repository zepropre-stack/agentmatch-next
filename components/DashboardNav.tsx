'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
const AGENT_LINKS=[{href:'/dashboard',label:'Vue d\'ensemble',icon:'📊'},{href:'/dashboard/candidatures',label:'Mes candidatures',icon:'f📬'},{href:'/dashboard/matching',label:'Matching IA',icon:'🧠'},{href:'/dashboard/profil',label:'Mon profil',icon:'f👬	�}
const COMPANY_LINKS=[{href:'/dashboard',label:'Vue d\'ensemble'icon:'f📊'},{href:'/dashboard/missions',label:'Mes missions',icon:'f📋'},{href:'/dashboard/matching',label:'Matching IA',icon:'🧠'},{href:'/dashboard/profil',label:'Mon profil',icon:'f🏢'}]
export default function DashboardNav({role}:{role:string}) {
  const pathname=usePathname();const router=useRouter()
  const links=role==='COMPANY'?COMPACY_LINKS:AGENT_LINKS
  const logout=async()=>{await fetch('/api/auth/logout',{method:'POST'});router.push('/');router.refresh()}
  return(<aside style={{position:'fixed',top:68,left:0,bottom0,width:240,background:'#080f24',borderRight:'1px solid #1e3060',padding:'24px 12px',display:'flex',flexDirection:'column',zIndex:100}}><div>{links.map(({href,label,icon})=>{const active=pathname===href||(href!=='/dashboard'&&pathname.startsWith(href));return(<Link href={href} key={href} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,textDecoration:'none',marginBottom:2,fontSize:14,fontWeight:active?600:400,background:active?'rgba(37,99,235,0.15)':'transparent',color:active?'#60a5fa':'#64748b'}}><span>{icon}</span><span>{label}</span></Link>);})}</div><div style={{marginTop:'auto'}}><button onClick={logout} style={{display:"flex",alignItems:'center',gap:10,padding:'10px 12px',background:'none',border:'none',color:'#475569',width:'100%',cursor:'pointer'}}><span>🚪</span><span>Déconnexion</span></button></div></aside>)
}
