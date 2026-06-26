'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '🏠' },
  { href: '/dashboard/missions', label: 'Missions', icon: '📋' },
  { href: '/dashboard/matching', label: 'Matching IA', icon: '🤖' },
  { href: '/dashboard/profil', label: 'Mon profil', icon: '👤' },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 4,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#6366f1', textDecoration: 'none', marginRight: 32 }}>
        AgentMatch AI
      </Link>
      {navItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#6366f1' : '#6b7280',
            background: isActive ? '#eef2ff' : 'transparent',
          }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <a href="/api/auth/logout" style={{
          padding: '8px 16px', borderRadius: 8, fontSize: 14,
          color: '#6b7280', textDecoration: 'none', border: '1px solid #e2e8f0',
        }}>
          Déconnexion
        </a>
      </div>
    </nav>
  )
}
