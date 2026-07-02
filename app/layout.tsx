import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'AgentPrime AI — 1ère plateforme IA de mise en relation commerciale', template: '%s | AgentPrime AI' },
  description: 'AgentPrime AI est la 1ère plateforme française de mise en relation par intelligence artificielle entre agents commerciaux indépendants et entreprises. Matching sur 47 critères, réponse en 24h.',
  keywords: ['agent commercial', 'recrutement commercial', 'matching IA', 'apporteur affaires', 'ingénieur commercial', 'AgentPrime', 'plateforme commerciale'],
  metadataBase: new URL('https://agentprime.fr'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://agentprime.fr',
    siteName: 'AgentPrime AI',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
             }
