import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminSupabase } from '@/lib/supabase-server'
import { stripe, PRICE_IDS } from '@/lib/stripe'
export async function POST(req:NextRequest) {
  try{
    const supabase=await createClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user)return NextResponse.json({error:'Non authentifié'},{status:401})
    if(user.user_metadata?.role!=='COMPANY')return NextResponse.json({error:'Réservé aux entreprises'},{status:403})
    const {plan}=await req.json()
    const priceId=PRICE_IDS[plan?.toUpperCase()]
    if(!priceId)return NextResponse.json({error:'Plan invalide'},{status:400})
    const admin=createAdminSupabase()
    const {data:company}=await admin.from('company_profiles').select('id,name,stripe_customer_id').eq('user_id',user.id).single()
    if(!company)return NextResponse.json({error:'Profil entreprise introuvable'},{status:404})
    const base=process.env.NEXT_PUBLIC_APP_URL||'https://agentmatch.ai'
    let custId=company.stripe_customer_id
    if(!custId){const c=await stripe.customers.create({email:user.email,name:company.name,metadata:{userId:user.id,companyId:company.id}});custId=c.id;await admin.from('company_profiles').update({stripe_customer_id:custId}).eq('id',company.id)}
    const sess=await stripe.checkout.sessions.create({customer:custId,payment_method_types:['card'],line_items:[{price:priceId,quantity:1}],mode:'subscription',success_url:`${base}/dashboard?payment=success&plan=${plan}`,cancel_url:`${base}/pricing?cancelled=1`,metadata:{userId:user.id,companyId:company.id,plan:plan.toUpperCase()},locale:'fr',allow_promotion_codes:true})
    return NextResponse.json({url:sess.url})
  }catch(err){console.error('[POST checkout]',err);return NextResponse.json({error:'Erreur Stripe'},{status:500})}
}
