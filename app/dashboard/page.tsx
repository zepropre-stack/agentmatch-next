'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS: Record<string, { name: string; price: number; color: string }> = {
  starter: { name: 'Starter', price: 89, color: '#60a5fa' },
  pro: { name: 'Pro', price: 149, color: '#a78bfa' },
  business: { name: 'Business', price: 219, color: '#f59e0b' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (r.status === 401) { router.push('/login'); return null }
        return r.json()
      })
      .then(d => {
        if (!d) return
        setRole(d.role)
        setProfile(d.profile)
        setLoading(false)
      })
      .catch(() => { router.push('/login') })
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement...</p>
      </div>
    )
  }

  const plan = (profile as { plan?: string } | null)?.plan
  const planInfo = plan ? PLANS[plan.toLowerCase()] : null
  const firstName = role === 'AGENT'
    ? (profile as { first_name?: string } | null)?.first_name
    : (profile as { name?: string } | null)?.name?.split(' ')[0]

  const profileComplete = role === 'AGENT'
    ? !!(profile as { title?: string } | null)?.title
    : !!(profile as { name?: string } | null)?.name

  const agentStats = [
    { value: 0, label: 'Candidatures envoyées', icon: '📬', color: 'var(--blue)' },
    { value: 0, label: 'Matchings IA', icon: '🤖', color: 'var(--purple)' },
    { value: 0, label: 'Vues de profil', icon: '👁️', color: 'var(--green)' },
  ]

  const companyStats = [
    { value: 0, label: 'Missions actives', icon: '📋', color: 'var(--blue)' },
    { value: 0, label: 'Candidatures reçues', icon: '📥', color: 'var(--purple)' },
    { value: 0, label: 'Matchings IA', icon: '🤖', color: 'var(--green)' },
  ]

  const currentStats = role === 'AGENT' ? agentStats : companyStats

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, background: 'linear-gradient(135deg, #fff 60%, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {'Bonjour, ' + (firstName || 'vous') + ' 👋'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Votre tableau de bord AgentPrime AI</p>
      </div>

      {!profileComplete && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.1))',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 12,
          padding: '16px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap' as const,
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{'⚠️'}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#a78bfa', margin: 0 }}>Profil incomplet</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                {'Complétez votre profil pour apparaître dans les résultats de matching'}
              </p>
            </div>
          </div>
          <a
            href={role === 'AGENT' ? '/dashboard/profil' : '/dashboard/entreprise'}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: 'nowrap' as const,
            }}
          >
            {'Compléter mon profil →'}
          </a>
        </div>
      )}

      {planInfo && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '16px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>{'⭐'}</span>
          <div>
            <p style={{ fontWeight: 600, color: planInfo.color, margin: 0 }}>{'Plan ' + planInfo.name}</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{planInfo.price + '€/mois'}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {currentStats.map((stat, i) => (
          <div key={i} style={{ background: 'var(--card)', borderRadius: 12, padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 12, padding: 24, border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Actions rapides</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
          {role === 'AGENT' ? (
            <>
              <a href="/missions" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                {'🔍 Voir les missions'}
              </a>
              <a href="/dashboard/profil" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)' }}>
                {'✏️ Mon profil'}
              </a>
            </>
          ) : (
            <>
              <a href="/dashboard/missions" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                {'➕ Publier une mission'}
              </a>
              <a href="/dashboard/matching" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)' }}>
                {'🤖 Matching IA'}
              </a>
            </>
          )}
        </div>
      </div>

    </div>
  )
    }
