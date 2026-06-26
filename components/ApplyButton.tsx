'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { agentId: string; agentName: string }

export default function ApplyButton({ agentId, agentName }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const contact = async () => {
    setLoading(true); setError('')
    const me = await fetch('/api/auth/me').then(r => r.ok ? r.json() : null)
    if (!me) { router.push('/login'); return }
    if (me.role !== 'COMPANY') { setError('Réservé aux entreprises'); setLoading(false); return }
    router.push('/dashboard/missions?contact=' + agentId)
  }

  if (done) return <div style={{padding:'12px',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',radius:10,color:'#10b981',textAlign:'center'}}>✅ Envoyée !</div>

  return(<><button onClick={contact} disabled={loading} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#1e40af,#7c3aed)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,}}>{loading ? '...' : `Contacter ${agentName.split(' ')[0]}`}</button>{error&&<div style={{color:'#f87171',fontSize:13}}>{error}</div>}</>)
}
