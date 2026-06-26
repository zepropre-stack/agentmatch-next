'use client'
import { useState, useEffect } from 'react'

const SECTORS = ['Tech', 'Finance', 'Marketing', 'Design', 'RH', 'Juridique', 'Consulting', 'Autre']
const SKILLS_LIST = ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'SQL', 'Figma', 'SEO', 'Excel']

export default function ProfilEditor() {
  const [profile, setProfile] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/agents/me/profile')
      .then(r => r.json())
      .then(d => setProfile(d))
      .catch(() => null)
  }, [])

  const update = (key: string, value: unknown) => {
    setProfile(p => ({ ...p, [key]: value }))
  }

  const toggleSkill = (skill: string) => {
    const skills = (profile.skills as string[]) || []
    update('skills', skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/agents/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: '#0d1633',
    border: '1px solid #1e3060',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 14 }}>Informations personnelles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Prénom</label>
            <input style={inputStyle} value={(profile.first_name as string) || ''} onChange={e => update('first_name', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Nom</label>
            <input style={inputStyle} value={(profile.last_name as string) || ''} onChange={e => update('last_name', e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Titre professionnel</label>
          <input style={inputStyle} value={(profile.title as string) || ''} onChange={e => update('title', e.target.value)} placeholder="Développeur Full Stack Senior" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Secteur</label>
            <select style={inputStyle} value={(profile.sector as string) || ''} onChange={e => update('sector', e.target.value)}>
              <option value="">Choisir...</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>TJM (€/jour)</label>
            <input style={inputStyle} type="number" value={(profile.daily_rate as number) || ''} onChange={e => update('daily_rate', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 14 }}>Compétences</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SKILLS_LIST.map(skill => {
            const skills = (profile.skills as string[]) || []
            const active = skills.includes(skill)
            return (
              <button key={skill} onClick={() => toggleSkill(skill)} style={{
                padding: '6px 14px', borderRadius: 20, border: '1px solid',
                borderColor: active ? '#6366f1' : '#1e3060',
                background: active ? '#6366f120' : 'transparent',
                color: active ? '#818cf8' : '#94a3b8',
                fontSize: 13, cursor: 'pointer',
              }}>
                {skill}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 14 }}>Bio</h2>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
          value={(profile.bio as string) || ''}
          onChange={e => update('bio', e.target.value)}
          placeholder="Présentez votre expérience et vos spécialités..."
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={handleSave} disabled={saving} style={{
          background: saving ? '#4b5563' : '#6366f1', color: 'white', border: 'none',
          padding: '12px 28px', borderRadius: 10, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
        {saved && <span style={{ color: '#34d399', fontSize: 14 }}>✓ Profil mis à jour</span>}
      </div>
    </div>
  )
}
