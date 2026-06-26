'use client'
import { useState } from 'react'

interface Props { profile: Record<string, unknown> | null; role: string; email: string }

const SKILLS_SUGGESTIONS = ['Prospection', 'CRM Salesforce', 'Négociation', 'Closing', 'Cold calling', 'LinkedIn', 'Présentation', 'Account management', 'Gestion pipeline', 'HubSpot']

export default function ProfilEditor({ profile: initial, role, email }: Props) {
  const [profile, setProfile] = useState(initial || {})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [skillInput, setSkillInput] = useState('')

  const set = (k: string, v: unknown) => setProfile(p => ({ ...p, [k]: v }))

  const addSkill = (s: string) => {
    const skills = (profile.skills as string[]) || []
    if (s && !skills.includes(s)) set('skills', [...skills, s])
    setSkillInput('')
  }

  const removeSkill = (s: string) => set('skills', ((profile.skills as string[]) || []).filter(x => x !== s))

  const save = async () => {
    setLoading(true)
    setError('')
    const endpoint = role === 'AGENT' ? '/api/agents/me/profile' : '/api/companies/me'
    const res = await fetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Erreur'); return }
    setProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#0d1633', border: '1px solid #1e3060', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none' }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 14 }}>Informations de connexion</h2>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Email</label>
        <input style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} value={email} readOnly />
      </div>

      {role === 'AGENT' ? (
        <>
          <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 16 }}>Identité</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Prénom</label>
                <input style={inputStyle} value={(profile.first_name as string) || ''} onChange={e => set('first_name', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Nom</label>
                <input style={inputStyle} value={(profile.last_name as string) || ''} onChange={e => set('last_name', e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Titre professionnel</label>
              <input style={inputStyle} value={(profile.title as string) || ''} onChange={e => set('title', e.target.value)} placeholder="Commercial SaaS B2B" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Téléphone</label>
                <input style={inputStyle} value={(profile.phone as string) || ''} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Ville</label>
                <input style={inputStyle} value={(profile.city as string) || ''} onChange={e => set('city', e.target.value)} placeholder="Paris" />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Bio</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={(profile.bio as string) || ''} onChange={e => set('bio', e.target.value)} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}>
              <input type="checkbox" checked={!!(profile.available)} onChange={e => set('available', e.target.checked)} style={{ width: 16, height: 16 }} />
              Je suis disponible pour de nouvelles missions
            </label>
          </div>

          <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 16 }}>Expérience & rémunération</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Années d'expérience</label>
                <input type="number" style={inputStyle} value={(profile.experience as number) || 0} onChange={e => set('experience', Number(e.target.value))} min={0} max={50} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Commission souhaitée</label>
                <input style={inputStyle} value={(profile.commission as string) || ''} onChange={e => set('commission', e.target.value)} placeholder="8-12% CA" />
              </div>
            </div>
          </div>

          <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 16 }}>Compétences</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {((profile.skills as string[]) || []).map(s => (
                <span key={s} style={{ background: '#0d1633', color: '#94a3b8', padding: '5px 12px', borderRadius: 8, fontSize: 13, border: '1px solid #1e3060', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Ajouter une compétence..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }} />
              <button onClick={() => addSkill(skillInput)} style={{ padding: '10px 16px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)', color: '#60a5fa', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>+</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SKILLS_SUGGESTIONS.filter(s => !((profile.skills as string[]) || []).includes(s)).map(s => (
                <button key={s} onClick={() => addSkill(s)} style={{ padding: '4px 10px', background: 'transparent', border: '1px dashed #1e3060', color: '#475569', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>+ {</button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15, marginBottom: 16 }}>Informations entreprise</h2>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Nom de l'entreprise</label>
            <input style={inputStyle} value={(profile.name as string) || ''} onChange={e => set('name', e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Site web</label>
            <input style={inputStyle} value={(profile.website as string) || ''} onChange={e => set('website', e.target.value)} placeholder="https://..." />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={(profile.description as string) || ''} onChange={e => set('description', e.target.value)} />
          </div>
        </div>
      )}

      {error && <div style={{ color: '#f87171', marginBottom: 14 }}>{error}</div>}
      {saved && <div style={{ color: '#10b981', marginBottom: 14 }}>✅ Profil sauvegardé !</div>}
      <button onClick={save} disabled={loading} style={{ padding: '13px 28px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer' }}>
        {loading ? 'Sauvegarde...' : '🔾 Sauvegarder les modifications'}
      </button>
    </div>
  )
}
