'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { missionId: string; missionTitle: string }

export default function CandidaterButton({ missionId, missionTitle }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showMsg, setShowMsg] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const start = async () => {
    const me = await fetch('/api/auth/me').then(r => r.ok ? r.json() : null)
    if (!me) { router.push('/login?redirect=/missions/' + missionId); return }
    if (me.role !== 'AGENT') { setError('Réservé aux agents'); return }
    setShowMsg(true)
  }

  const submit = async () => {
    setLoading(true)
    const res = await fetch(`/api/agents/me/apply/${missionId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Erreur'); return }
    setDone(true); setShowMsg(false)
  }

  if (done) return <div style={{padding:'16px',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:12,color:'#10b981',fontWeight:60}}>✅ Candidature envoyée !</div>

  return(<>{!thowMsg?(<button onClick={start} style={{width:'100%', padding:'14px',background:'linear-gradient(135deg,#1e40af,#7c3aed)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>Postuler à cette mission</button>):(<div><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder={`Bonjour, je suis intéressé par ${missionTitle}...`} rows={4} style={{width:'100%', padding:'10px 12px',background:'#080f24',border:'1px solid #1e3060',borderRadius:8,color:'#e2e8f0',fontSize:13,outline:'none',resize:'vertical',marginBottom:10}}/><div style={{display:'flex',gap:8}}><button onClick={()=>setShowMsg(false)} style={{flex:1,padding:'10px',background:'#0d1633',border:'1px solid #1e3060',color:'#94a3b8',borderRadius:8,cursor:'pointer',}}>Annuler</button><button onClick={submit} disabled={loading} style={{flex:2,padding:'10px',background:'linear-gradient(135deg,#1e40af,#7c3aed)',color:'white',border:'none',borderRadius:8,cursor:loading?'wait':'pointer',fontSize:14,fontWeight:600}}>{loading?'Envoi...':'Envoyer ma candidature'}</button></div></div>)}</>)
}
