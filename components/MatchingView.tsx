'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  role: 'AGENT' | 'COMPANY'
  missions?: { id: string; title: string; sector: string; region: string }[]
  initialMatches?: unknown[]
  matches?: unknown[]
  selectedMissionId?: string
  plan?: string | null
}

export default function MatchingView({ role, missions, initialMatches = [], matches: agentMatches = [], selectedMissionId, plan }: Props) {
  const [selectedMission, setSelectedMission] = useState(selectedMissionId || '')
  const [results, setResults] = useState<unknown[]>(initialMatches)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const runMatching = async () => {
    if (!selectedMission) { setError('Sélectionnez une mission'); return }
    setLoading(true); setError('')
    const res = await fetch(`/api/matching/mission/${selectedMission}`, { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setResults(data.matches || [])
    router.replace(`/dashboard/matching?mission=${selectedMission}`)
  }

  if (role === 'AGENT') {
    return (
      <div>
        {agentMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
            <div style={{ color: '#64748b' }}>Aucun match IA pour le moment</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(agentMatches as Record<string, unknown>[]).map((m, i) => {
              const mission = m.missions as Record<string, unknown>
              const company = (mission?.company_profiles as Record<string, string>)
              return (
                <div key={i} style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 16, marginBottom: 4 }}>{mission?.title as string}</div>
                      <div style={{ color: '#60a5fa', fontSize: 14 }}>{company?.name}</div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', padding: '6px 14px', borderRadius: 20, fontWeight: 800, fontSize: 16 }}>{m.score as number}%</div>
                  </div>
                  <Link href={`/missions/${mission?.id as string}`} style={{ color: '#60a5fa', fontSize: 13, textDecoration: 'none' }}>Voir la mission →</Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {!plan || plan === 'STARTER' ? (
        <div style={{ background: 'linear-gradient(135deg,#0d1a3a,#1a0d3a)', border: '1px solid #3b82f6', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 18, marginBottom: 8 }}>Matching IA disponible avec le plan Pro</div>
          <Link href="/pricing" style={{ display: 'inline-block', padding: '14px 28px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>Passer au plan Pro →</Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 14 }}>Sélectionnez une mission</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <select value={selectedMission} onChange={e => setSelectedMission(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', background: '#080f24', border: '1px solid #1e3060', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none' }}>
                <option value="">Choisir mission...</option>
                {(missions || []).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <button onClick={runMatching} disabled={loading || !selectedMission}
                style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}>
                {loading ? 'Analyse...' : '🧠 Lancer matching'}
              </button>
            </div>
            {error && <div style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</div>}
          </div>
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(results as Record<string, unknown>[]).map((r, i) => {
                const agent = r.agent as Record<string, unknown>
                const initials = `${(agent.first_name as string)?.[0] || ''}${(agent.last_name as string)?.[0] || ''}`.toUpperCase()
                return (
                  <div key={i} style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 14, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>{agent.first_name as string} {agent.last_name as string}</div>
                          <div style={{ color: '#60a5fa', fontSize: 13 }}>{agent.title as string}</div>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', padding: '6px 14px', borderRadius: 20, fontWeight: 800, fontSize: 18 }}>{r.score as number}%</div>
                      </div>
                      <Link href={`/agents/${agent.id as string}`} style={{ color: '#60a5fa', fontSize: 13, textDecoration: 'none' }}>Voir profil</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
