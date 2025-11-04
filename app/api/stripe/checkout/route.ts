export const runtime = "nodejs"

import { NextResponse } from "next/server"
import Stripe from "stripe"

import { auth } from "@/auth"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const priceId = process.env.STRIPE_PRICE_PRO
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" }) : null

export async function POST() {
  if (!stripe || !priceId || !siteUrl) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
  }

  const session = await auth()
  console.log("[/api/stripe/checkout] session email:", session?.user?.email)
  const email = session?.user?.email

  if (!email) {
    return NextResponse.json(
      { error: "Not authenticated", hint: "Please sign in to start your trial." },
      { status: 401 }
    )
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: `${siteUrl}/?upgrade=success`,
    cancel_url: `${siteUrl}/pricing?upgrade=cancelled`,
  })

  if (!checkout.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }

  return NextResponse.json({ url: checkout.url })
}
