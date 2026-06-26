import Link from 'next/link'
import type { AgentProfile } from '@/types'

export default function AgentCard({ agent }: { agent: AgentProfile }) {
  const initials = `${agent.first_name?.[0] || ''}${agent.last_name?.[0] || ''}`.toUpperCase()

  return (
    <Link href={`/agents/${agent.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 24, cursor: 'pointer', height: '100%' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flexShrink: 0 }}>
            {agent.photo_url
              ? <img src={agent.photo_url} alt={agent.first_name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>{initials}</div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#e2e8f0', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {agent.first_name} {agent.last_name}
            </div>
            <div style={{ color: '#60a5fa', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{agent.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13 }}>
              <span>📍</span>
              <span>{agent.city || agent.region}{agent.remote ? ' · Remote OK' : ''}</span>
            </div>
          </div>
          {agent.available && (
            <div style={{ flexShrink: 0 }}>
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid rgba(16,185,129,0.3)' }}>Disponible</span>
            </div>
          )}
        </div>

        {agent.sectors?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {agent.sectors.slice(0, 3).map(s => (
              <span key={s} style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: 20, fontSize: 12, border: '1px solid rgba(37,99,235,0.2)' }}>{s}</span>
            ))}
          </div>
        )}

        {agent.skills?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {agent.skills.slice(0, 4).map(s => (
              <span key={s} style={{ background: '#0d1633', color: '#94a3b8', padding: '2px 8px', borderRadius: 6, fontSize: 12, border: '1px solid #1e3060' }}>{s}</span>
            ))}
            {agent.skills.length > 4 && <span style={{ color: '#475569', fontSize: 12 }}>+{agent.skills.length - 4}</span>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #1e3060' }}>
          <div style={{ color: '#475569', fontSize: 13 }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{agent.experience} ans</span> d'expérience
          </div>
          {agent.commission && (
            <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>{agent.commission}</div>
          )}
        </div>
      </div>
    </Link>
  )
}
