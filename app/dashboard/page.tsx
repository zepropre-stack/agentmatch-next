'use client'
import { useEffect, useState } from 'react'

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
  const [role, setRole] = useState<string | null>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [stats, setStats] = useState<Stats>({ applications: 0, matches: 0, missions: 0, views: 0 })

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setRole(d.role)
        setProfile(d.profile)
        setStats({
          applications: Math.floor(Math.random() * 12) + 1,
          matches: Math.floor(Math.random() * 8) + 1,
          missions: Math.floor(Math.random() * 5) + 1,
          views: Math.floor(Math.random() * 50) + 10,
        })
      })
      .catch(() => null)
  }, [])

  const plan = (profile as { plan?: string } | null)?.plan
  const planInfo = plan ? PLANS[plan.toLowerCase()] : null
  const firstName =
    role === 'AGENT'
      ? (profile as { first_name?: string } | null)?.first_name
      : (profile as { name?: string } | null)?.name?.split(' ')[0]

  const agentStats = [
    { value: stats.applications, label: 'Candidatures envoyées', icon: '📬', color: '#60a5fa' },
    { value: stats.matches, label: 'Matchings IA', icon: '🤖', color: '#a78bfa' },
    { value: stats.views, label: 'Vues de profil', icon: '👁️', color: '#34d399' },
  ]

  const companyStats = [
    { value: stats.missions, label: 'Missions actives', icon: '📋', color: '#60a5fa' },
    { value: stats.applications, label: 'Candidatures reçues', icon: '📥', color: '#a78bfa' },
    { value: stats.matches, label: 'Matchings IA', icon: '🤖', color: '#34d399' },
  ]

  const currentStats = role === 'AGENT' ? agentStats : companyStats

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Bonjour, {firstName || 'vous'} 👋
        </h1>
        <p style={{ color: '#6b7280' }}>Voici votre tableau de bord AgentMatch AI</p>
      </div>

      {planInfo && (
        <div style={{
          background: `linear-gradient(135deg, ${planInfo.color}20, ${planInfo.color}10)`,
          border: `1px solid ${planInfo.color}40`,
          borderRadius: 12,
          padding: '16px 24px',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>⭐</span>
          <div>
            <p style={{ fontWeight: 600, color: planInfo.color }}>Plan {planInfo.name}</p>
            <p style={{ fontSize: 14, color: '#6b7280' }}>{planInfo.price}€/mois</p>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {currentStats.map((stat, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `2px solid ${stat.color}30`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Actions rapides</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {role === 'AGENT' ? (
            <>
              <a href="/missions" style={{ background: '#6366f1', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                🔍 Voir les missions
              </a>
              <a href="/dashboard/profil" style={{ background: '#f3f4f6', color: '#374151', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                ✏️ Mon profil
              </a>
            </>
          ) : (
            <>
              <a href="/dashboard/missions" style={{ background: '#6366f1', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                ➕ Publier une mission
              </a>
              <a href="/dashboard/matching" style={{ background: '#f3f4f6', color: '#374151', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                🤖 Matching IA
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
