'use client'
import { useState, useEffect } from 'react'

interface Mission {
  id: string
  title: string
  sector: string
  location: string
  remote: boolean
  daily_rate_min?: number
  daily_rate_max?: number
  duration_months?: number
  skills_required: string[]
  description: string
  status: string
}

const SECTORS = ['Tech', 'Finance', 'Marketing', 'Design', 'RH', 'Juridique', 'Consulting', 'Autre']

export default function MissionManager() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    sector: '',
    location: '',
    remote: false,
    daily_rate_min: '',
    daily_rate_max: '',
    duration_months: '',
    skills_required: '',
    description: '',
  })

  useEffect(() => {
    fetch('/api/missions')
      .then(r => r.json())
      .then(d => Array.isArray(d) ? setMissions(d) : null)
      .catch(() => null)
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          daily_rate_min: form.daily_rate_min ? Number(form.daily_rate_min) : null,
          daily_rate_max: form.daily_rate_max ? Number(form.daily_rate_max) : null,
          duration_months: form.duration_months ? Number(form.duration_months) : null,
          skills_required: form.skills_required.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })
      if (res.ok) {
        const m = await res.json()
        setMissions(prev => [m, ...prev])
        setShowForm(false)
        setForm({ title: '', sector: '', location: '', remote: false, daily_rate_min: '', daily_rate_max: '', duration_months: '', skills_required: '', description: '' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: '#0d1633',
    border: '1px solid #1e3060',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div>
      {showForm && (
        <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#e2e8f0', marginBottom: 20 }}>Nouvelle mission</h2>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Titre *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Développeur React Senior" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Secteur</label>
                <select style={inputStyle} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                  <option value="">Choisir...</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Localisation</label>
                <input style={inputStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Paris" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>TJM min (€)</label>
                <input style={inputStyle} type="number" value={form.daily_rate_min} onChange={e => setForm(f => ({ ...f, daily_rate_min: e.target.value }))} placeholder="300" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>TJM max (€)</label>
                <input style={inputStyle} type="number" value={form.daily_rate_max} onChange={e => setForm(f => ({ ...f, daily_rate_max: e.target.value }))} placeholder="600" />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Compétences (séparées par virgule)</label>
              <input style={inputStyle} value={form.skills_required} onChange={e => setForm(f => ({ ...f, skills_required: e.target.value }))} placeholder="React, TypeScript, Node.js" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 5 }}>Description</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={loading} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Création...' : 'Publier'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: '#1e3060', color: '#94a3b8', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginBottom: 24 }}>
          + Publier une mission
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {missions.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>Aucune mission publiée pour le moment.</p>
        )}
        {missions.map(m => (
          <div key={m.id} style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 6 }}>{m.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>{m.sector} · {m.location}</p>
                {(m.daily_rate_min || m.daily_rate_max) && (
                  <p style={{ color: '#60a5fa', fontWeight: 600, marginTop: 4 }}>
                    {m.daily_rate_min}–{m.daily_rate_max}€/j
                  </p>
                )}
              </div>
              <span style={{ background: m.status === 'active' ? '#064e3b' : '#1e3060', color: m.status === 'active' ? '#34d399' : '#94a3b8', padding: '4px 10px', borderRadius: 20, fontSize: 12 }}>
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
