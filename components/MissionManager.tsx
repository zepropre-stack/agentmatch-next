'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Mission } from '@/types'

const SECTORS = ['SaaS & Tech', 'Finance & Assurance', 'Immobilier', 'Industrie', 'Énergie', 'Santé & Pharma', 'Retail & Commerce']
const REGIONS = ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Occitanie', 'Provence-Alpes-Côte d\'Azur', 'Nouvelle-Aquitaine', 'Hauts-de-France', 'Grand Est', 'Bretagne', 'Remote']
const TYPES = ['CDI', 'Freelance', 'Commission pure', 'Portage salarial']

interface Props { missions: (Mission & { applications?: { count: number }[] })[]; companyId: string }

const STATUS_COLORS: Record<string, string> = { ACTIVE: '#10b981', PAUSED: '#f59e0b', CLOSED: '#475569' }
const STATUS_LABELS: Record<string, string> = { ACTIVE: 'Active', PAUSED: 'En pause', CLOSED: 'Fermée' }

export default function MissionManager({ missions: initial }: Props) {
  const [missions, setMissions] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', sector: '', region: '', remote: false, mission_type: 'CDI', experience: 0, commission: '', budget: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const createMission = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/missions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setMissions(m => [data, ...m]); setShowForm(false)
    setForm({ title: '', description: '', sector: '', region: '', remote: false, mission_type: 'CDI', experience: 0, commission: '', budget: '' })
  }

  const closeMission = async (id: string) => {
    if (!confirm('Fermer cette mission ?')) return
    await fetch(`/api/missions/${id}`, { method: 'DELETE' })
    setMissions(m => m.map(ms => ms.id === id ? { ...ms, status: 'CLOSED' as const } : ms))
  }

  const runMatching = async (id: string) => {
    setLoading(true)
    const res = await fetch(`/api/matching/mission/${id}`, { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { alert(data.error); return }
    alert(`✅ ${data.matches?.length || 0} profils trouvés`)
    router.push(`/dashboard/matching?mission=${id}`)
  }

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#0d1633', border: '1px solid #1e3060', borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none' }

  return (
    <div>
      {showForm && (
        <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#e2e8f0', marginBottom: 20 }}>Nouvelle mission</h2>
          <form onSubmit={createMission}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Titre *</label>
              <input style={inputStyle} value={form.title} onChange={set('title')} required placeholder="Commercial SaaS B2B Senior" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Secteur *</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.sector} onChange={set('sector')} required><option value="">Choisir...</option>{SECTORS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Région *</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.region} onChange={set('region')} required><option value="">Choisir...</option>{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Type</label><select style={{ ...inputStyle, cursor: 'pointer' }} value={form.mission_type} onChange={set('mission_type')}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Expérience min</label><input type="number" style={inputStyle} value={form.experience} onChange={set('experience')} min={0} max={30} /></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Commission</label><input style={inputStyle} value={form.commission} onChange={set('commission')} placeholder="8-12% CA" /></div>
              <div><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Budget</label><input style={inputStyle} value={form.budget} onChange={set('budget')} placeholder="Selon profil" /></div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}><input type="checkbox" checked={form.remote} onChange={set('remote')} style={{ width: 16, height: 16 }} />Remote possible</label></div>
            <div style={{ marginBottom: 20 }}><label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Description *</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={form.description} onChange={set('description')} required placeholder="Décrivez la mission..." /></div>
            {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#0d1633', border: '1px solid #1e3060', color: '#94a3b8', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>Annuler</button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', fontSize: 14 }}>{loading ? 'Publication...' : '📤 Publier'}</button>
            </div>
          </form>
        </div>
      )}
      {!showForm && <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '14px', background: 'transparent', border: '2px dashed #1e3060', color: '#475569', borderRadius: 14, cursor: 'pointer', fontSize: 14, marginBottom: 20 }}>+ Créer une nouvelle mission</button>}
      {missions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}><div style={{ fontSize: 48, marginBottom: 12 }}>📋</div><div>Aucune mission publiée</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {missions.map(mission => {
            const appCount = Array.isArray(mission.applications) ? (mission.applications[0] as { count?: number })?.count ?? 0 : 0
            const expanded = expandedId === mission.id
            return (
              <div key={mission.id} style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedId(expanded ? null : mission.id)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 4 }}>{mission.title}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ color: '#64748b', fontSize: 13 }}>{mission.sector}</span>
                      <span style={{ color: '#64748b', fontSize: 13 }}><br>{appCount} candidatures{appCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <span style={{ background: STATUS_COLORS[mission.status] + '20', color: STATUS_COLORS[mission.status], padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{STATUS_LABELS[mission.status]}</span>
                  <span style={{ color: '#475569', fontSize: 18 }}>{expanded ? '▲' : '▼'}</span>
                </div>
                {expanded && (
                  <div style={{ padding: '0 22px 18px', borderTop: '1px solid #1e3060' }}>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: '14px 0' }}>{mission.description}</p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {mission.status === 'ACTIVE' && (<>
                        <button onClick={() => runMatching(mission.id)} disabled={loading} style={{ padding: '8px 16px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>🧠 Matching IA</button>
                        <button onClick={() => closeMission(mission.id)} style={{ padding: '8px 16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Fermer</button>
                      </>)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
