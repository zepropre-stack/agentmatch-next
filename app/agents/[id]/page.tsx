import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase-server'
import ApplyButton from '@/components/ApplyButton'
import type { AgentProfile } from '@/types'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = createAdminSupabase()
  const { data } = await admin.from('agent_profiles').select('first_name,last_name,title,sectors,region').eq('id', params.id).single()
  if (!data) return { title: 'Agent introuvable' }
  return {
    title: `${data.first_name} ${data.last_name} — ${data.title} | AgentMatch AI`,
    description: `Profil de ${data.first_name} ${data.last_name}, ${data.title} spécialisé en ${data.sectors?.join(', ')}. Basé en ${data.region}. Disponible sur AgentMatch AI.`,
  }
}

export default async function AgentPage({ params }: Props) {
  const admin = createAdminSupabase()
  const { data: agent } = await admin.from('agent_profiles').select('*').eq('id', params.id).single()
  if (!agent) notFound()
  return <div>Agent</div>
}
