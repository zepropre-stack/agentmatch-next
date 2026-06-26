import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'AgentMatch AI — Recrutement commercial propulsé par l\'IA', template: '%s | AgentMatch AI' },
  description: 'Trouvez les meilleurs agents commerciaux pour vos missions grâce à l\'intelligence artificielle. Matching sur 47 critères, réponse en 48h.',
  keywords: ['agent commercial', 'recrutement commercial', 'matching IA', 'apporteur affaires', 'ingénieur commercial'],
  metadataBase: new URL('https://agentmatch.ai'),
  openGraph: { type: 'website', locale: 'fr_FR', url: 'https://agentmatch.ai' },
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
