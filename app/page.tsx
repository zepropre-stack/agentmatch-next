import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase-server'
import AgentCard from '@/components/AgentCard'
import MissionCard from '@/components/MissionCard'
import type { AgentProfile, Mission } from '@/types'

export const metadata: Metadata = {
  title: 'AgentMatch AI — Recrutement commercial propulsé par l\'IA',
}

const STATS = [
  { value: '3 000+', label: 'Agents qualifiés' },
  { value: '94%', label: 'Taux de match réussi' },
  { value: '48h', label: 'Délai de réponse moyen' },
  { value: '12 secteurs', label: 'Métiers couverts' },
]

const FEATURES = [
  { icon: '🧠', title: 'Matching IA 47 critères', desc: 'Notre algorithme analyse secteur, compétences, expérience, géographie et disponibilité pour vous proposer les profils les plus compatibles.' },
  { icon: '⚡', title: 'Réponse en 48h', desc: 'Recevez vos premiers candidats qualifiés en moins de 48h. Fini les semaines de sourcing manuel et les profils hors cible.' },
  { icon: '🎮', title: 'Profils pré-qualifiés', desc: 'Chaque agent est vérifié et évalué. Score de performance, avis clients, historique de missions — tout est transparent.' },
  { icon: '📊', title: 'Dashboard temps réel', desc: 'Suivez vos candidatures, gérez vos missions et activez le matching IA depuis un tableau de bord intuitif.' },
]

async function getStats() {
  try {
    const admin = createAdminSupabase()
    const [{ count: agentsCount }, { count: missionsCount }] = await Promise.all([
      admin.from('agent_profiles').select('id', { count: 'exact', head: true }).eq('available', true),
      admin.from('missions').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    ])
    return { agents: agentsCount ?? 0, missions: missionsCount ?? 0 }
  } catch { return { agents: 0, missions: 0 } }
}

async function getFeatured() {
  try {
    const admin = createAdminSupabase()
    const [{ data: agents }, { data: missions }] = await Promise.all([
      admin.from('agent_profiles').select('*').eq('available', true).order('score', { ascending: false }).limit(3),
      admin.from('missions').select('*, company_profiles(name, sector, logo_url)').eq('status', 'ACTIVE').order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(3),
    ])
    return { agents: agents || [], missions: missions || [] }
  } catch { return { agents: [], missions: [] } }
}

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeatured()])

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 600, background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 30, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ color: '#60a5fa', fontSize: 13, fontWeight: 600 }}>⚡ Propulsé par l'intelligence artificielle</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', color: '#f1f5f9' }}>
            Trouvez les meilleurs<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>agents commerciaux</span><br />
            en 48h
          </h1>

          <p style={{ fontSize: 20, color: '#64748b', lineHeight: 1.7, marginBottom: 40, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
            La plateforme de recrutement commercial propulsée par l'IA. Matching sur 47 critères, profils pré-qualifiés, missions rémunérées à la commission.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link href="/register/company" style={{ padding: '16px 32px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}>
              Je recrute un agent →
            </Link>
            <Link href="/register/agent" style={{ padding: '16px 32px', background: 'rgba(37,99,235,0.1)', border: '1px solid #2a4080', color: '#60a5fa', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Je suis agent commercial
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, maxWidth: 700, margin: '0 auto', background: '#1e3060', borderRadius: 16, overflow: 'hidden' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: '#080f24', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live stats if we have real data */}
      {(stats.agents > 0 || stats.missions > 0) && (
        <div style={{ maxWidth: 1280, margin: '0 auto 60px', padding: '0 24px' }}>
          <div style={{ background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 12, padding: '12px 24px', display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ color: '#64748b', fontSize: 14 }}>En ce moment sur la plateforme :</div>
            <div style={{ color: '#10b981', fontSize: 14, fontWeight: 600 }}>● {stats.agents} agents disponibles</div>
            <div style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600 }}>● {stats.missions} missions actives</div>
          </div>
        </div>
      )}

      {/* Features */}
      <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Comment ça marche</h2>
          <p style={{ color: '#64748b', fontSize: 18 }}>Tout le processus de recrutement commercial repensé avec l'IA.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#e2e8f0', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Agents */}
      {featured.agents.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Agents en vedette</h2>
              <p style={{ color: '#64748b', marginTop: 6, marginBottom: 0 }}>Les profils les mieux notés du mois</p>
            </div>
            <Link href="/agents" style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Voir tous les agents →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {(featured.agents as AgentProfile[]).map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>
      )}

      {/* Featured Missions */}
      {featured.missions.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Dernières missions</h2>
              <p style={{ color: '#64748b', marginTop: 6, marginBottom: 0 }}>Opportunités rémunérées à la commission</p>
            </div>
            <Link href="/missions" style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Toutes les missions →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {(featured.missions as Mission[]).map(m => <MissionCard key={m.id} mission={m} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ maxWidth: 1280, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1a3a, #1a0d3a)', border: '1px solid #2a4080', borderRadius: 24, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, position: 'relative' }}>Prêt à accélérer vos ventes ?</h2>
          <p style={{ color: '#64748b', fontSize: 18, marginBottom: 36, position: 'relative' }}>Rejoignez 500+ entreprises qui recrutent leurs agents commerciaux via AgentMatch AI.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/register/company" style={{ padding: '16px 32px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
              Démarrer maintenant — Gratuit 14 jours
            </Link>
            <Link href="/pricing" style={{ padding: '16px 32px', background: 'rgba(37,99,235,0.1)', border: '1px solid #2a4080', color: '#60a5fa', borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
