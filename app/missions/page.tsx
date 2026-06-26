import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase-server'
import MissionCard from '@/components/MissionCard'
import type { Mission } from '@/types'

export const metadata: Metadata = {
  title: 'Missions commerciales — Opportunités rémunérées à la commission',
  description: 'Découvrez les dernières missions commerciales disponibles. Rémunération à la commission, tous secteurs, toute la France.',
}

const SECTORS = ['SaaS & Tech', 'Finance & Assurance', 'Immobilier', 'Industrie', 'Énergie', 'Santé & Pharma', 'Retail & Commerce']
const TYPES = ['CDI', 'Freelance', 'Commission pure', 'Portage salarial']

interface Props {
  searchParams: { sector?: string; region?: string; remote?: string; type?: string; page?: string }
}

export default async function MissionsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const from = (page - 1) * limit

  const admin = createAdminSupabase()
  let query = admin
    .from('missions')
    .select('*, company_profiles(name, sector, logo_url)', { count: 'exact' })
    .eq('status', 'ACTIVE')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (searchParams.sector) query = query.eq('sector', searchParams.sector)
  if (searchParams.region) query = query.ilike('region', `%${searchParams.region}%`)
  if (searchParams.remote === '1') query = query.eq('remote', true)
  if (searchParams.type) query = query.eq('mission_type', searchParams.type)

  const { data: missions, count } = await query
  const total = count ?? 0
  const totalPages = Math.ceil(total / limit)

  const buildUrl = (overrides: Record<string, string | null>) => {
    const p = new URLSearchParams()
    const merged = { ...searchParams, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/missions?${p}`
  }

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#f1f5f9', margin: '0 0 10px' }}>Missions commerciales</h1>
          <p style={{ color: '#64748b', fontSize: 17, margin: 0 }}>{total > 0 ? `${total} missions actives` : 'Missions actives'}</p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32, padding: '16px 20px', background: '#0f1d3a', borderRadius: 14, border: '1px solid #1e3060' }}>
          <select value={searchParams.sector || ''} onChange={e => window.location.href = buildUrl({ sector: e.target.value || null })}
            style={{ padding: '8px 12px', background: '#080f24', border: '1px solid #1e3060', borderRadius: 8, color: '#94a3b8', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option value="">Tous les secteurs</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={searchParams.type || ''} onChange={e => window.location.href = buildUrl({ type: e.target.value || null })}
            style={{ padding: '8px 12px', background: '#080f24', border: '1px solid #1e3060', borderRadius: 8, color: '#94a3b8', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option value="">Tous les types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <Link href={buildUrl({ remote: searchParams.remote === '1' ? null : '1' })}
            style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
              background: searchParams.remote === '1' ? 'rgba(124,58,237,0.2)' : 'transparent',
              color: searchParams.remote === '1' ? '#a78bfa' : '#64748b',
              border: `1px solid ${searchParams.remote === '1' ? 'rgba(124,58,237,0.4)' : '#1e3060'}`,
            }}>🌐 Remote</Link>

          {(searchParams.sector || searchParams.region || searchParams.remote || searchParams.type) && (
            <Link href="/missions" style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, color: '#f87171', textDecoration: 'none', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>✕ Effacer</Link>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <Link href="/dashboard/missions/new" style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              + Publier une mission
            </Link>
          </div>
        </div>

        {/* Mission list */}
        {!missions?.length ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Aucune mission trouvée</div>
            <div style={{ color: '#475569', marginBottom: 24 }}>Essayez d'élargir vos filtres</div>
            <Link href="/missions" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Voir toutes les missions</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              {(missions as Mission[]).map(m => <MissionCard key={m.id} mission={m} />)}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {page > 1 && <Link href={buildUrl({ page: String(page - 1) })} style={{ padding: '8px 16px', background: '#0f1d3a', border: '1px solid #1e3060', color: '#94a3b8', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>← Précédent</Link>}
                <span style={{ padding: '8px 16px', color: '#64748b', fontSize: 14 }}>Page {page} / {totalPages}</span>
                {page < totalPages && <Link href={buildUrl({ page: String(page + 1) })} style={{ padding: '8px 16px', background: '#0f1d3a', border: '1px solid #1e3060', color: '#94a3b8', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Suivant →</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
