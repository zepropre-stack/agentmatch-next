import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  const { plan } = await req.json()
  if (!plan) {
    return NextResponse.json({ error: 'Plan requis' }, { status: 400 })
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey === 'sk_live_placeholder') {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }
  const priceMap: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    business: process.env.STRIPE_PRICE_BUSINESS,
  }
  const priceId = priceMap[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
  }
  return NextResponse.json({ message: 'Stripe checkout à configurer', priceId })
}
