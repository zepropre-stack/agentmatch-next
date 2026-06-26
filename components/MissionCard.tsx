import Link from 'next/link'
import type { Mission } from '@/types'

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'Aujourd\'hui'
  if (d === 1) return 'Hier'
  if (d < 7) return `Il y a ${d} jours`
  return `Il y a ${Math.floor(d / 7)} semaines`
}

export default function MissionCard({ mission }: { mission: Mission }) {
  const company = (mission as { company_profiles?: { name: string; sector: string; logo_url?: string } }).company_profiles

  return (
    <Link href={`/missions/${mission.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 24, cursor: 'pointer', position: 'relative' }}>
        {mission.featured && (
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <span style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>⭐ Mise en avant</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#1e40af,#7c3aed)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{company?.logo_url ? <img src={company.logo_url} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain' }} alt="" /> : '🏢']}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#e2e8f0', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mission.title}</div>
            <div style={{ color: '#60a5fa', fontSize: 14, fontWeight: 500 }}>{company?.name || 'Entreprise confidentielle'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          <span style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: 20, fontSize: 12, border: '1px solid rgba(37,99,235,0.2)' }}>{mission.sector}</span>
          <span style={{ background: '#0d1633', color: '#94a3b8', padding: '3px 10px', borderRadius: 20, fontSize: 12, border: '1px solid #1e3060' }}>📍 {mission.region}</span>
          {mission.remote && <span style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '3px 10px', borderRadius: 20, fontSize: 12, border: '1px solid rgba(124,58,237,0.2)' }}>Remote</span>}
        </div>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mission.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #1e3060' }}>
          <div style={{ color: '#475569', fontSize: 13 }}>{timeAgo(mission.created_at)}</div>
          {mission.commission && <div style={{ color: '#f59e0b', fontSize: 14, fontWeight: 700 }}>{mission.commission}</div>}
        </div>
      </div>
    </Link>
  )
}
