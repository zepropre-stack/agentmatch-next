import type { Metadata } from 'next'
import Link from 'next/link'
import { PLANS } from '@/types'
import PricingCard from '@/components/PricingCard'

export const metadata: Metadata = {
  title: 'Tarifs — AgentMatch AI',
  description: 'Choisissez votre plan AgentMatch AI. Starter 89€/mois, Pro 149€/mois avec matching IA, Business 219€/mois tout inclus.',
}

const FAQ = [
  { q: 'Puis-je changer de plan ?', r: 'Oui, vous pouvez upgrader ou downgrader à tout moment depuis votre espace Stripe.' },
  { q: 'Y a-t-il une période d\'essai ?', r: '14 jours d\'essai gratuit sans carte bancaire sur tous les plans.' },
  { q: 'Comment fonctionne le matching IA ?', r: 'Notre algorithme analyse 47 critères : secteur, compétences, expérience, géographie et disponibilité pour calculer un score de 0 à 100.' },
  { q: 'Puis-je annuler à tout moment ?', r: 'Oui, sans engagement ni frais de résiliation. L\'annulation est effective à la fin de la période en cours.' },
  { q: 'Les agents sont-ils vérifiés ?', r: 'Chaque profil est validé manuellement. Nous vérifions l\'identité, les références et le parcours professionnel.' },
]

export default function PricingPage() {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#f1f5f9', margin: '0 0 16px' }}>Choisissez votre plan</h1>
          <p style={{ color: '#64748b', fontSize: 19 }}>Tous les plans incluent 14 jours d'essai gratuit.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 80 }}>
          {[PLANS.starter, PLANS.pro, PLANS.business].map(plan => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto 80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 32 }}>Questions fréquentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{item.q}</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>{item.r}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '48px', background: 'linear-gradient(135deg,#0d1a3a,#1a0d3a)', borderRadius: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Prêà recruter vos agents ?</h2>
          <Link href="/register/company" style={{ display: 'inline-block', padding: '16px 36px', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Démarrer gratuitement →</Link>
        </div>
      </div>
    </div>
  )
}
