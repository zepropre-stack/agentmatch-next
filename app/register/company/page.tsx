'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const SECTORS = ['SaaS & Tech', 'Finance & Assurance', 'Immobilier', 'Industrie', 'Énergie', 'Santé & Pharma', 'Retail & Commerce', 'Télécoms', 'Autre']
const SIZES = ['1-10 salariés', '11-50 salariés', '51-200 salariés', '201-500 salariés', '500+ salariés']

export default function RegisterCompanyPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', companyName: '', sector: '', size: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const sp = useSearchParams()
  const planSelected = sp.get('plan')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.password.length < 8) { setError('Mot de passe trop court (min 8 caractères)'); return }
    setLoading(true)
    const res = await fetch('/api/auth/register/company', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Erreur'); return }
    setDone(true)
    if (planSelected) { setTimeout(() => window.location.href = `/login?redirect=/api/payments/checkout?plan=${planSelected}`, 2000) }
  }

  const inputStyle = { width: '100%', padding: '12px 14px', background: '#0d1633', border: '1px solid #1e3060', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none' }

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Compte entreprise créé !</h1>
        <p style={{ color: '#64748b' }}>Vérifiez votre email, puis connectez-vous pour choisir le plan.</p>
        <Link href="/login" style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>Se connecter →</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '110px 24px 60px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>Recurter des agents commerciaux</h1>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Prénom *</label><input style={inputStyle} value={form.firstName} onChange={set('firstName')} required placeholder="Marie" /></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Nom *</label><input style={inputStyle} value={form.lastName} onChange={set('lastName')} required placeholder="Martin" /></div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Nom de l'entreprise *</label><input style={inputStyle} value={form.companyName} onChange={set('companyName')} required placeholder="Acme SAS" /></div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Email *</label><input type="email" style={inputStyle} value={form.email} onChange={set('email')} required placeholder="marie@acme.com" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Secteur *</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.sector} onChange={set('sector')} required><option value="">Choisir...</option>{SECTORS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Taille</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.size} onChange={set('size')}><option value="">Choisir...</option>{SIZES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Mot de passe *</label><input type="password" style={inputStyle} value={form.password} onChange={set('password')} required /></div>
            <div style={{ marginBottom: 20 }}><label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Confirmer *</label><input type="password" style={inputStyle} value={form.confirm} onChange={set('confirm')} required /></div>
            {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 14, marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'Création...' : 'Créer mon compte entreprise →'}</button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: '#475569', fontSize: 14, marginTop: 20 }}>Déjà un compte ? <Link href="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link></p>
      </div>
    </div>
  )
}
