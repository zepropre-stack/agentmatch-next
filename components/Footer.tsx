import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#02050e', borderTop: '1px solid #1e3060', padding: '48px 24px 24px', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1e40af,#7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
              <span style={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgentMatch AI</span>
            </div>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, margin: 0 }}>La plateforme de recrutement commercial propulsée par l'intelligence artificielle.</p>
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Plateforme</h4>
            {[['Agents commerciaux', '/agents'], ['Missions', '/missions'], ['Tarifs', '/pricing'], ['Dashboard', '/dashboard']].map(([label, href]) => (
              <Link href={href} key={href} style={{ display: 'block', color: '#64748b', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Secteurs</h4>
            {['SaaS & Tech', 'Finance & Assurance', 'Immobilier', 'Industrie', 'Énergie'].map(s => (
              <Link href={`/agents?sector=${encodeURIComponent(s)}`} key={s} style={{ display: 'block', color: '#64748b', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>{s}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Contact</h4>
            <a href="mailto:contact@agentmatch.ai" style={{ display: 'block', color: '#64748b', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>contact@agentmatch.ai</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e3060', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#334155', fontSize: 13, margin: 0 }}>© 2024 AgentMatch AI</p>
        </div>
      </div>
    </footer>
  )
}
