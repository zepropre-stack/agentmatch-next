export type Role = 'AGENT' | 'COMPANY' | 'ADMIN'
export type Plan = 'STARTER' | 'PRO' | 'BUSINESS'
export type MissionStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED'
export type ApplicationStatus = 'PENDING' | 'VIEWED' | 'ACCEPTED' | 'REJECTED'

export interface User {
  id: string; email: string; role: Role; verified: boolean; created_at: string
}

export interface AgentProfile {
  id: string; user_id: string; first_name: string; last_name: string; title: string; bio?: string; phone?: string; city: string; region: string; remote: boolean; sectors: string[]; skills: string[]; experience: number; commission?: string; cv_url?: string; photo_url?: string; available: boolean; score: number; created_at: string
}

export interface CompanyProfile {
  id: string; user_id: string; name: string; siret?: string; sector: string; size?: string; website?: string; description?: string; logo_url?: string; plan?: Plan; plan_expires?: string; stripe_customer_id?: string; stripe_subscription_id?: string; created_at: string
}

export interface Mission {
  id: string; company_id: string; title: string; description: string; sector: string; region: string; remote: boolean; mission_type: string; experience: number; commission?: string; budget?: string; status: MissionStatus; featured: boolean; created_at: string; company?: Pick<CompanyProfile, 'name' | 'sector' | 'logo_url'>; _count?: { applications: number }
}

export interface Application {
  id: string; mission_id: string; agent_id: string; message?: string; status: ApplicationStatus; created_at: string; mission?: Mission; agent?: AgentProfile
}

export interface MatchBreakdown { sector: number; skills: number; experience: number; geography: number; availability: number }

export interface Match {
  id: string; mission_id: string; agent_id: string; score: number; breakdown: MatchBreakdown; created_at: string; agent?: AgentProfile; mission?: Mission
}

export interface PlanConfig {
  id: Plan; name: string; price: number; priceAnnual: number; color: string; description: string; features: string[]; maxMissions: number; maxMatches: number; highlighted?: boolean
}

export const PLANS: Record<Lowercase<Plan>, PlanConfig> = {
  starter: { id: 'STARTER', name: 'Starter Marketplace', price: 89, priceAnnual: 74, color: '#60a5fa', description: '3 missions actives', features: ['3 annonces actives', 'Candidatures illimitées', 'Contact candidats', 'Tableau de bord', 'Support email'], maxMissions: 3, maxMatches: 5 },
  pro: { id: 'PRO', name: 'Pro IA Matching', price: 149, priceAnnual: 124, color: '#ffffff', description: '5 missions & Matching IA', features: ['5 annonces actives', 'Matching IA proactif', '15 contacts directs/mois', 'Score compatibilité', 'Alertes IA', 'Chat prioritaire'], maxMissions: 5, maxMatches: 15, highlighted: true },
  business: { id: 'BUSINESS', name: 'Business (tout inclus)', price: 219, priceAnnual: 182, color: '#fbbf24', description: 'Missions illimitées & contacts illimités', features: ['Missions illimitées', 'Contacts illimités', 'Analytics avancés', 'Account manager dédié', 'API access', 'Support 24/7'], maxMissions: Infinity, maxMatches: Infinity }
}
