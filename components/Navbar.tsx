'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface NavUser { email: string; role: string; profile: { first_name?: string; name?: string } | null }

export default function Navbar() {
  const [user, setUser] = useState<NavUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d?.email) setUser(d) }).catch(() => {})
  }, [pathname])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null); router.push('/')
  }

  const displayName = user?.profile?.first_name || user?.profile?.name || user?.email?.split('@')[0] || ''

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(4,8,26,0.95)' : 'rgba(4,8,26,0.75)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid #1e3060' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 19, background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgentPrime AI</span>
          <span style={{ fontSize: 10, fontWeight: 700, background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: 4 }}>BETA</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[
            { href: '/agents', label: 'Agents' },
            { href: '/missions', label: 'Missions' },
            { href: '/pricing', label: 'Tarifs' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              textDecoration: 'none',
              color: pathname.startsWith(href) ? '#60a5fa' : '#94a3b8',
              background: pathname.startsWith(href) ? 'rgba(37,99,235,0.1)' : 'transparent',
              transition: 'all .2s',
            }}>{label}</Link>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <>
              <Link href="/dashboard" style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(37,99,235,0.15)', border: '1px solid #2a4080', color: '#60a5fa', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Dashboard</Link>
              <div style={{ position: 'relative' }}>
                <div
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1e40af,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                  onClick={() => setMenuOpen(!menuOpen)}
                >{displayName.charAt(0).toUpperCase()}</div>
                {menuOpen && (
                  <div style={{ position: 'absolute', top: 44, right: 0, background: '#0f1d3a', border: '1px solid #1e3060', borderRadius: 12, padding: 8, minWidth: 160, zIndex: 100 }}>
                    <div style={{ padding: '8px 12px', color: '#94a3b8', fontSize: 13, borderBottom: '1px solid #1e3060', marginBottom: 4 }}>{displayName}</div>
                    <Link href="/dashboard/profil" style={{ display: 'block', padding: '8px 12px', color: '#e2e8f0', textDecoration: 'none', borderRadius: 6, fontSize: 14 }}>Mon profil</Link>
                    <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, borderRadius: 6 }}>Déconnexion</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '8px 16px', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Connexion</Link>
              <Link href="/register/agent" style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 16px rgba(37,99,235,0.3)', transition: 'all .2s' }}>Commencer gratuitement</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
                    }
