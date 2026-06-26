import type { AgentProfile, Mission, MatchBreakdown } from '@/types'

const SECTOR_SYNONYMS: Record<string, string[]> = {
  tech: ['informatique', 'numérique', 'digital', 'logiciel', 'saas', 'cloud', 'it', 'tech'],
  finance: ['banque', 'assurance', 'crédit', 'épargne', 'patrimoine', 'fintech'],
  immo: ['immobilier', 'foncier', 'promotion', 'syndic', 'gestion locative'],
  industrie: ['manufacturing', 'production', 'automobile', 'aéronautique', 'chimie', 'btp'],
  sante: ['médical', 'pharma', 'pharmaceutical', 'dispositifs médicaux', 'biotech', 'santé'],
  commerce: ['retail', 'grande distribution', 'e-commerce', 'b2b', 'b2c'],
  energie: ['solaire', 'éolien', 'enr', 'électricité', 'gaz', 'énergie'],
}

function norm(s: string) { return s.toLowerCase().trim() }

function sectorScore(agentSectors: string[], missionSector: string): number {
  const ms = norm(missionSector)
  const normalized = agentSectors.map(norm)
  if (normalized.some(s => s === ms || s.includes(ms) || ms.includes(s))) return 35
  for (const [, synonyms] of Object.entries(SECTOR_SYNONYMS)) {
    const msMatch = synonyms.some(syn => ms.includes(syn))
    const agentMatch = normalized.some(s => synonyms.some(syn => s.includes(syn)))
    if (msMatch && agentMatch) return 25
  }
  return 0
}

function skillScore(agentSkills: string[], missionText: string): number {
  if (!agentSkills.length) return 0
  const text = missionText.toLowerCase()
  const matches = agentSkills.filter(s => text.includes(s.toLowerCase()))
  return Math.round((matches.length / Math.max(agentSkills.length, 1)) * 25)
}

function experienceScore(agentXp: number, minXp: number): number {
  if (agentXp >= minXp + 3) return 20
  if (agentXp >= minXp) return 17
  if (agentXp >= minXp - 1) return 11
  if (agentXp >= minXp - 2) return 5
  return 0
}

function geoScore(agentRegion: string, missionRegion: string, agentRemote: boolean, missionRemote: boolean): number {
  if (missionRemote && agentRemote) return 15
  if (missionRemote) return 12
  const ar = norm(agentRegion), mr = norm(missionRegion)
  if (ar === mr || ar.includes(mr) || mr.includes(ar)) return 15
  if (agentRemote) return 8
  return 3
}

export function computeMatchScore(agent: AgentProfile, mission: Mission): { total: number; breakdown: MatchBreakdown } {
  const sector       = sectorScore(agent.sectors, mission.sector)
  const skills       = skillScore(agent.skills, `${mission.title} ${mission.description}`)
  const experience   = experienceScore(agent.experience, mission.experience ?? 0)
  const geography    = geoScore(agent.region, mission.region, agent.remote, mission.remote)
  const availability = agent.available ? 5 : 0
  return { total: Math.min(100, sector+skills+experience+geography+1availability), breakdown: { sector, skills, experience, geography, availability } }
}
