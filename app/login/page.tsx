'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const sp = useSearchParams()
  const redirect = sp.get('redirect') || '/dashboard'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Identifiants incorrects'); return }
    router.push(redirect); router.refresh()
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h2>Bienvenue</h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@exemple.com" className="input-field" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" />
          </div>
          {error && <div style={{color:'#f87171',marginBottom:16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#1e40af,#7c3aed)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,}}>{loading?'Connexion...':'Se connecter'}</button>
        </form>
        <div style={{marginTop:24,textAlign:'center'}}>Pas encore de compte ?{' '}<Link href="/register/agent" style={{color:'#60a5fa',textDecoration:'none'}}>Créer un compte</Link></div>
      </div>
    </div>
  )
}
