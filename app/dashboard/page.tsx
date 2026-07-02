'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS: Record<string, { name: string; price: number; color: string }> = {
  starter: { name: 'Starter', price: 89, color: '#60a5fa' },
  pro: { name: 'Pro', price: 149, color: '#a78bfa' },
  business: { name: 'Business', price: 219, color: '#f59e0b' },
}

interface Stats {
  applications: number
  matches: number
  missions: number
  views: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats] = useState<Stats>({ applications: 0, matches: 0, missions: 0, views: 0 })

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
      .catch(() => router.push('/login'))
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
  const firstName =
    role === 'AGENT'
      ? (profile as { first_name?: string } | null)?.first_name
      : (profile as { name?: string } | null)?.name?.split(' ')[0]

  const profileComplete = role === 'AGENT'
    ? !!(profile as { title?: string } | null)?.title
    : !!(profile as { name?: string } | null)?.name

  const agentStats = [
    { value: stats.applications, label: 'Candidatures envoy\u00e9es', icon: '\u{1F4EC}', color: 'var(--blue)' },
    { value: stats.matches, label: 'Matchings IA', icon: '\u{1F916}', color: 'var(--purple)' },
    { value: stats.views, label: 'Vues de profil', icon: '\u{1F441}\uFE0F', color: 'var(--green)' },
  ]

  const companyStats = [
    { value: stats.missions, label: 'Missions actives', icon: '\u{1F4CB}', color: 'var(--blue)' },
    { value: stats.applications, label: 'Candidatures re\u00e7ues', icon: '\u{1F4E5}', color: 'var(--purple)' },
    { value: stats.matches, label: 'Matchings IA', icon: '\u{1F916}', color: 'var(--green)' },
  ]

  const currentStats = role === 'AGENT' ? agentStats : companyStats

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, background: 'linear-gradient(135deg, #fff 60%, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bonjour, {firstName || 'vous'} \u{1F44B}
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
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>\u26A0\uFE0F</span>
            <div>
              <p style={{ fontWeight: 600, color: '#a78bfa', margin: 0 }}>Profil incomplet</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Compl\u00e9tez votre profil pour appara\u00eetre dans les r\u00e9sultats de matching
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
              whiteSpace: 'nowrap',
            }}
          >
            Compl\u00e9ter mon profil \u2192
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
          <span style={{ fontSize: 24 }}>\u2B50</span>
          <div>
            <p style={{ fontWeight: 600, color: planInfo.color, margin: 0 }}>Plan {planInfo.name}</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{planInfo.price}\u20AC/mois</p>
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
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {role === 'AGENT' ? (
            <>
              <a href="/missions" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                \u{1F50D} Voir les missions
              </a>
              <a href="/dashboard/profil" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)' }}>
                \u270F\uFE0F Mon profil
              </a>
            </>
          ) : (
            <>
              <a href="/dashboard/missions" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                \u2795 Publier une mission
              </a>
              <a href="/dashboard/matching" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)' }}>
                \u{1F916} Matching IA
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
    }
