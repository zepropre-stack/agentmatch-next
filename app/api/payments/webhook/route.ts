import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !webhookSecret || webhookSecret === 'whsec_placeholder') {
    return NextResponse.json({ received: true })
  }
  console.log('Webhook received, body length:', body.length)
  return NextResponse.json({ received: true })
}
