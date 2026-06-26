import { notFound } from 'next/navigation'
import { createAdminSupabase } from '@/lib/supabase-server'

interface CompanyProfile {
  name: string
  sector: string
  logo_url?: string
  description?: string
  website?: string
}

interface Mission {
  id: string
  title: string
  description: string
  sector: string
  location: string
  remote: boolean
  skills_required: string[]
  daily_rate_min?: number
  daily_rate_max?: number
  duration_months?: number
  status: string
  created_at: string
  company_profiles?: CompanyProfile
}

function timeAgo(d: string): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  return `Il y a ${days} jours`
}

export default async function MissionDetailPage({ params }: { params: { id: string } }) {
  const admin = createAdminSupabase()
  const { data: mission } = await admin
    .from('missions')
    .select('*, company_profiles(name, sector, logo_url, description, website)')
    .eq('id', params.id)
    .single()

  if (!mission || mission.status === 'CLOSED') notFound()

  const m = mission as Mission
  const company = m.company_profiles

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          {company && (
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
              {company.name} · {company.sector}
            </p>
          )}
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
            {m.title}
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
              {m.sector}
            </span>
            <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
              {m.location}
            </span>
            {m.remote && (
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
                Remote
              </span>
            )}
            <span style={{ color: '#9ca3af', fontSize: 13 }}>{timeAgo(m.created_at)}</span>
          </div>
          {(m.daily_rate_min || m.daily_rate_max) && (
            <p style={{ fontSize: 20, fontWeight: 700, color: '#6366f1', marginBottom: 16 }}>
              {m.daily_rate_min && m.daily_rate_max
                ? `${m.daily_rate_min}€ – ${m.daily_rate_max}€ / jour`
                : `${m.daily_rate_min || m.daily_rate_max}€ / jour`}
            </p>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Description</h2>
          <p style={{ color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{m.description}</p>
        </div>

        {m.skills_required && m.skills_required.length > 0 && (
          <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Compétences requises</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {m.skills_required.map((skill: string) => (
                <span key={skill} style={{ background: '#f3f4f6', color: '#374151', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <a href={`/dashboard/missions/apply/${m.id}`} style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          padding: '14px 32px',
          borderRadius: 12,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 16,
        }}>
          Postuler à cette mission
        </a>
      </div>
    </div>
  )
}
