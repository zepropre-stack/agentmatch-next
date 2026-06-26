'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const SECTORS = ['Tech', 'Finance', 'Marketing', 'Design', 'RH', 'Juridique', 'Consulting']
const REGIONS = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nantes', 'Remote']

export default function AgentFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = {
    sector: searchParams.get('sector') || '',
    region: searchParams.get('region') || '',
    remote: searchParams.get('remote') || '',
  }

  const apply = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/agents?${params.toString()}`)
  }

  const clear = () => router.push('/agents')
  const hasFilters = current.sector || current.region || current.remote

  return (
    <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontWeight: 700, color: '#e2e8f0' }}>Filtres</span>
        {hasFilters && (
          <button onClick={clear} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 13, cursor: 'pointer' }}>
            Effacer
          </button>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
          Secteur
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => apply('sector', current.sector === s ? '' : s)} style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid',
              borderColor: current.sector === s ? '#6366f1' : '#1e3060',
              background: current.sector === s ? '#6366f120' : 'transparent',
              color: current.sector === s ? '#818cf8' : '#94a3b8',
              fontSize: 14, cursor: 'pointer', textAlign: 'left',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
          Région
        </label>
        <select
          value={current.region}
          onChange={e => apply('region', e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #1e3060', background: '#0f1d3a', color: '#e2e8f0', fontSize: 14 }}
        >
          <option value="">Toutes régions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={current.remote === 'true'}
            onChange={e => apply('remote', e.target.checked ? 'true' : '')}
          />
          <span style={{ color: '#e2e8f0', fontSize: 14 }}>Remote uniquement</span>
        </label>
      </div>
    </div>
  )
}
