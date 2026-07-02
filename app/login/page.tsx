'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgentPrime AI</span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginTop: 24, marginBottom: 6 }}>Connexion</h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Bienvenue sur AgentPrime AI</p>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" placeholder="vous@email.com"
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Mot de passe</label>
              <input
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password" placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 24, paddingTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text2)' }}>
              Pas encore de compte ?{' '}
              <Link href="/register/agent" style={{ color: 'var(--blue3)', fontWeight: 600, textDecoration: 'none' }}>S&apos;inscrire gratuitement</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>Chargement...</div>}>
      <LoginForm />
    </Suspense>
  )
              }
