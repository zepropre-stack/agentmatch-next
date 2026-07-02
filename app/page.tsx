import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase-server'
import AgentCard from '@/components/AgentCard'
import MissionCard from '@/components/MissionCard'
import type { AgentProfile, Mission } from '@/types'

export const metadata: Metadata = {
  title: 'AgentPrime AI — 1ère plateforme IA de mise en relation commerciale',
  description: "AgentPrime AI est la 1ère plateforme française de mise en relation par IA entre agents commerciaux indépendants et entreprises. Trouvez l'agent idéal en moins de 24h.",
}

const STATS = [
  { value: '3 000+', label: 'Agents qualifiés' },
  { value: '94%', label: 'Taux de match réussi' },
  { value: '24h', label: 'Délai moyen' },
  { value: '12', label: 'Secteurs couverts' },
]

const STEPS = [
  { num: '01', icon: '📝', badge: 'IA', title: 'Créez votre profil', desc: "Décrivez vos besoins ou compétences en 5 minutes. Notre IA analyse 47 critères pour comprendre votre profil.", color: 'var(--blue2)' },
  { num: '02', icon: '🤖', badge: 'IA', title: 'Matching automatique', desc: "L'algorithme parcourt instantanément notre réseau et sélectionne les profils les plus compatibles.", color: 'var(--purple2)' },
  { num: '03', icon: '⚡', badge: null, title: 'Résultats en 24h', desc: 'Recevez vos premières propositions qualifiées en moins de 24h. Chaque profil est scoré et justifié.', color: 'var(--gold)' },
  { num: '04', icon: '🚀', badge: null, title: 'Go ! Collaboration', desc: 'Contactez directement, signez votre mandat en ligne et démarrez la collaboration immédiatement.', color: 'var(--green)' },
]

const FEATURES = [
  { icon: '🧠', title: 'Matching IA 47 critères', desc: 'Secteur, compétences, expérience, géographie, disponibilité, style de vente — notre algorithme analyse tout pour des résultats précis.', bg: 'rgba(37,99,235,0.15)', highlight: true },
  { icon: '⚡', title: 'Réponse en 24h', desc: 'Fini les semaines de sourcing manuel. Vos premiers candidats qualifiés arrivent en moins de 24 heures.', bg: 'rgba(245,158,11,0.15)', highlight: false },
  { icon: '✅', title: 'Profils pré-qualifiés', desc: 'Chaque agent est vérifié et évalué. Score de performance, avis clients, historique de missions — tout est transparent.', bg: 'rgba(16,185,129,0.15)', highlight: false },
  { icon: '📊', title: 'Dashboard temps réel', desc: 'Suivez candidatures, gérez vos missions et activez le matching IA depuis un tableau de bord intuitif.', bg: 'rgba(124,58,237,0.15)', highlight: false },
]

const FOR_AGENTS = [
  '✅ Accédez à des mandats qualifiés dans votre secteur et région',
  '✅ Profil mis en avant auprès des bonnes entreprises',
  '✅ Commissions transparentes dès le 1er contact',
  '✅ Outils de suivi et messagerie intégrés',
]

const FOR_COMPANIES = [
  "✅ Trouvez l'agent commercial idéal en moins de 24h",
  '✅ Matching IA sur 47 critères métier',
  '✅ Profils pré-vérifiés et scorés',
  '✅ Essai gratuit 7 jours, sans CB',
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
      <section style={{ position: 'relative', padding: '120px 64px 100px', textAlign: 'center', overflow: 'hidden' }}>
        <div className="hero-bg" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          <div className="badge-ai" style={{ marginBottom: 28, display: 'inline-flex' }}>
            <span>⭐</span><span>1ère plateforme française de mise en relation commerciale par IA</span>
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', color: 'var(--text)' }}>
            Trouvez l&apos;agent commercial<br />
            <span style={{ background: 'linear-gradient(135deg, var(--blue3), var(--purple2), var(--gold2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>idéal par intelligence artificielle</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text2)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7 }}>Matching IA sur 47 critères. Profils pré-qualifiés. Mandats rémunérés à la commission. Résultat en moins de 24h.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link href="/register/company" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>Je recrute un agent →</Link>
            <Link href="/register/agent" style={{ padding: '16px 36px', background: 'rgba(37,99,235,0.1)', border: '1px solid var(--border2)', color: 'var(--blue3)', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>Je suis agent commercial</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, maxWidth: 720, margin: '0 auto', background: 'var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg2)', padding: '22px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,var(--blue3),var(--gold2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(stats.agents > 0 || stats.missions > 0) && (
        <div style={{ maxWidth: 1280, margin: '0 auto 60px', padding: '0 24px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 28px', display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ color: 'var(--text3)', fontSize: 14 }}>🔴 En direct :</div>
            <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 600 }}>● {stats.agents} agents disponibles</div>
            <div style={{ color: 'var(--blue2)', fontSize: 14, fontWeight: 600 }}>● {stats.missions} missions actives</div>
          </div>
        </div>
      )}

      <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--blue2)', marginBottom: 12 }}>PROCESSUS</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Comment ça marche</h2>
          <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>4 étapes pour trouver ou devenir l&apos;agent commercial idéal</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {STEPS.map((step) => (
            <div key={step.num} className="step-card">
              <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(59,130,246,0.12)', position: 'absolute', top: 12, right: 16 }}>{step.num}</div>
              {step.badge && <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, background: 'linear-gradient(135deg,var(--blue),var(--purple))', color: 'white', padding: '2px 8px', borderRadius: 4, marginBottom: 10 }}>{step.badge}</div>}
              <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: step.color }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--blue2)', marginBottom: 12 }}>POUR QUI</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)' }}>Une plateforme, deux profils</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), var(--card))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '36px 32px' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🧑‍💼</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue3)', marginBottom: 8 }}>Pour les agents commerciaux</h3>
            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Accédez aux meilleures opportunités de mandats commerciaux dans votre secteur. Inscription 100% gratuite.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {FOR_AGENTS.map((item, i) => <div key={i} style={{ color: 'var(--text)', fontSize: 14 }}>{item}</div>)}
            </div>
            <Link href="/register/agent" style={{ display: 'inline-flex', padding: '12px 24px', background: 'linear-gradient(135deg,var(--blue),var(--purple))', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>S&apos;inscrire gratuitement →</Link>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05), var(--card))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '36px 32px' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🏢</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>Pour les entreprises</h3>
            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Déléguez votre développement commercial à des agents indépendants vérifiés. Résultat garanti ou remboursé.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {FOR_COMPANIES.map((item, i) => <div key={i} style={{ color: 'var(--text)', fontSize: 14 }}>{item}</div>)}
            </div>
            <Link href="/register/company" style={{ display: 'inline-flex', padding: '12px 24px', background: 'linear-gradient(135deg,var(--gold),#d97706)', color: '#000', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Essai gratuit 7 jours →</Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--blue2)', marginBottom: 12 }}>FONCTIONNALITÉS</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Tout ce dont vous avez besoin</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: f.highlight ? 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.05))' : 'var(--card)', border: f.highlight ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.agents.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--blue2)', marginBottom: 6 }}>AGENTS VÉRIFIÉS</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Agents en vedette</h2>
            </div>
            <Link href="/agents" style={{ color: 'var(--blue3)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Voir tous les agents →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {(featured.agents as AgentProfile[]).map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>
      )}

      {featured.missions.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--gold)', marginBottom: 6 }}>MISSIONS ACTIVES</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Dernières missions</h2>
            </div>
            <Link href="/missions" style={{ color: 'var(--blue3)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Toutes les missions →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {(featured.missions as Mission[]).map(m => <MissionCard key={m.id} mission={m} />)}
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1280, margin: '0 auto 100px', padding: '0 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {[
            { emoji: '⭐', quote: "En 48h j'avais 3 agents qualifiés qui correspondaient parfaitement à notre secteur BTP. Impressionnant.", name: 'Marc D.', title: 'CEO, BatimPro', color: 'var(--blue2)' },
            { emoji: '🏆', quote: "J'ai trouvé 2 mandats dans ma région la semaine de mon inscription. La plateforme est vraiment bien faite.", name: 'Sophie L.', title: 'Agent commercial indépendant', color: 'var(--gold)' },
            { emoji: '💎', quote: 'Le matching IA est bluffant. On nous propose exactement les bons profils, sans perdre de temps à trier.', name: 'Thomas R.', title: 'DG Commercial, TechSales', color: 'var(--purple2)' },
          ].map((t, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{t.emoji}</div>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontWeight: 700, color: t.color, fontSize: 14 }}>{t.name}</div>
                <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 2 }}>{t.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto 80px', padding: '0 64px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 24, padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge-ai" style={{ marginBottom: 24, display: 'inline-flex' }}>🚀 Rejoignez les pionniers</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>
              Prêt à accélérer<br />
              <span style={{ background: 'linear-gradient(135deg,var(--blue3),var(--purple2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>votre développement commercial ?</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 18, maxWidth: 560, margin: '0 auto 40px' }}>Rejoignez des centaines d&apos;entreprises qui recrutent leurs agents commerciaux via AgentPrime AI.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register/company" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 32px rgba(37,99,235,0.4)' }}>Démarrer maintenant — Essai 7 jours gratuit</Link>
              <Link href="/pricing" style={{ padding: '16px 36px', background: 'rgba(37,99,235,0.1)', border: '1px solid var(--border2)', color: 'var(--blue3)', borderRadius: 14, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>Voir les tarifs</Link>
            </div>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 16 }}>✓ Sans engagement &nbsp;✓ Sans carte bancaire &nbsp;✓ Support inclus</p>
          </div>
        </div>
      </section>
    </>
  )
                 }
