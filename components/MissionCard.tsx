import Link from 'next/link'

interface MissionCardProps {
  mission: {
    id: string
    title: string
    sector: string
    location: string
    remote?: boolean
    daily_rate_min?: number
    daily_rate_max?: number
    skills_required?: string[]
    created_at: string
    featured?: boolean
    company_profiles?: { name: string; sector: string; logo_url?: string }
  }
}

export default function MissionCard({ mission }: MissionCardProps) {
  const company = mission.company_profiles
  const days = Math.floor((Date.now() - new Date(mission.created_at).getTime()) / 86400000)
  const timeAgo = days === 0 ? "Aujourd'hui" : days === 1 ? 'Hier' : `Il y a ${days}j`

  return (
    <Link href={`/missions/${mission.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 24, cursor: 'pointer', position: 'relative', transition: 'box-shadow 0.2s' }}>
        {mission.featured && (
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
              ⭐ Featured
            </span>
          </div>
        )}

        {company && (
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>{company.name}</p>
        )}
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
          {mission.title}
        </h3>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ background: '#eef2ff', color: '#6366f1', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {mission.sector}
          </span>
          <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
            {mission.location}
          </span>
          {mission.remote && (
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
              Remote
            </span>
          )}
        </div>

        {(mission.daily_rate_min || mission.daily_rate_max) && (
          <p style={{ fontSize: 16, fontWeight: 700, color: '#6366f1', marginBottom: 12 }}>
            {mission.daily_rate_min && mission.daily_rate_max
              ? `${mission.daily_rate_min}€–${mission.daily_rate_max}€/j`
              : `${mission.daily_rate_min || mission.daily_rate_max}€/j`}
          </p>
        )}

        {mission.skills_required && mission.skills_required.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {mission.skills_required.slice(0, 4).map((s: string) => (
              <span key={s} style={{ background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: '#9ca3af' }}>{timeAgo}</p>
      </div>
    </Link>
  )
}
