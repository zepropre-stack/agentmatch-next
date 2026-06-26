'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PlanConfig } from '@/types'

export default function PricingCard({ plan }: { plan: PlanConfig }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSelect = async () => {
    setLoading(true)
    const me = await fetch('/api/auth/me').then(r => r.ok ? r.json() : null)
    if (!me) { router.push('/register/company?plan=' + plan.id.toLowerCase()); return }
    if (me.role !== 'COMPANY') { router.push('/register/company?plan=' + plan.id.toLowerCase()); return }
    const res = await fetch('/api/payments/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: plan.id }) })
    const data = await res.json()
    setLoading(false)
    if (data.url) window.location.href = data.url
  }

  return (
    <div style={{ background: plan.highlighted ? 'linear-gradient(135deg,#0d1a3a,#1a0d3a)' : '#0f1d3a', border: `2px solid ${plan.highlighted ? '#3b82f6' : '#1e3060'}`, borderRadius: 20, padding: '32px 28px', position: 'relative' }}>
      {plan.highlighted && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', padding: '5px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>⭯ Le plus populaire</div>}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: plan.color, marginBottom: 6 }}>{plan.name}</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>{plan.description}</div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9' }}>{plan.price}€</span>
        <span style={{ color: '#64748b', fontSize: 14 }}>/mois</span>
      </div>
      <button onClick={handleSelect} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', border: 'none', marginBottom: 24, background: plan.highlighted ? 'linear-gradient(135deg,#1e40af,#7c3aed)' : 'rgba(37,99,235,0.15)', color: plan.highlighted ? 'white' : '#60a5fa' }}>{loading ? 'Chargement...' : 'Démarrer l\'essai gratuit'}</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
