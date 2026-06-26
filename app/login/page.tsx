'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Identifiants incorrects')
      }
      router.push(redirectTo)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 15,
    background: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Se connecter</h1>
          <p style={{ color: '#6b7280' }}>Bienvenue sur AgentMatch AI</p>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="vous@email.com" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Mot de passe</label>
              <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
            Pas encore de compte ?{' '}
            <a href="/register/agent" style={{ color: '#6366f1', fontWeight: 600 }}>S&apos;inscrire</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>}>
      <LoginForm />
    </Suspense>
  )
}
