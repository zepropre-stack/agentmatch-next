import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminSupabase } from '@/lib/supabase-server'
import Stripe from 'stripe'
export const config={api:{bodyParser:false}}
export async function POST(req:NextRequest) {
  const body=await req.text();const sig=req.headers.get('stripe-signature')!
  let event:Stripe.Event
  try{event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET!)}catch{return NextResponse.json({error:'Invalid signature'},{status:400})}
  const admin=createAdminSupabase()
  const PM]{[process.env.STRIPE_PRICE_STARTER_||'']:'STARTER',[process.env.STRIPE_PRICE_PRO_||'']:'PRO',[process.env.STRIPE_PRICE_BUSINESS_||'']:'BUSINESS'}
  switch(event.type){
	case 'checkout.session.completed':{let s=event.data.object as Stripe.CheckoutSession;let cId=s.metadata?.companyId;let pl=s.metadata?.plan;if(!cId||!pl)break;const sub=await stripe.subscriptions.retrieve(s.subscription as string);await admin.from('company_profiles').update({plan:pl,plan_expires:new Date(sub.current_period_end*1000).toISOString(),stripe_subscription_id:sub.id}).eq('id',cId);break}
	case 'customer.subscription.updated':{let sub=event.data.object as Stripe.Subscription;let pl=PM[sub.items.data[0]?.price.id];if(!pl)break;const {data:co}=await admin.from('company_profiles').select('id').eq('stripe_subscription_id',sub.id).single();if(co)await admin.from('company_profiles').update({plan:pl,plan_expires:new Date(sub.current_period_end*1000).toISOString()}).eq('id',co.id);break}
	case 'customer.subscription.deleted':{let sub=event.data.object as Stripe.Subscription;const {data:co} =await admin.from('company_profiles').select('id').eq('stripe_subscription_id',sub.id).single();if(co)await admin.from('company_profiles').update({plan:null,plan_expires:null,stripe_subscription_id:null}).eq('id',co.id);break}
  }
  return NextResponse.json({received:true})
}
