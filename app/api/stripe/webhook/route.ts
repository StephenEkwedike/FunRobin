export const runtime = "nodejs"

import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"

import { getDb } from "@/lib/mongo"

const stripeSecret = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" })
  : null

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[stripe-webhook] signature error", message)
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  const db = await getDb()
  const users = db.collection("users")

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const data = event.data.object as Stripe.Checkout.Session | Stripe.Subscription
      const email =
        (data as Stripe.Checkout.Session).customer_details?.email ||
        (data as Stripe.Checkout.Session).customer_email ||
        (data as Stripe.Subscription).customer_email

      const customerId =
        (data as Stripe.Checkout.Session).customer?.toString() ||
        (data as Stripe.Subscription).customer?.toString()

      if (email || customerId) {
        await users.updateOne(
          email ? { email: email.toLowerCase() } : { stripeCustomerId: customerId },
          {
            $set: {
              plan: "pro",
              stripeCustomerId: customerId,
              updatedAt: new Date(),
            },
          },
          { upsert: !!email }
        )
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer?.toString()
      if (customerId) {
        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: { plan: "free", updatedAt: new Date() },
          }
        )
      }
    }
  } catch (error) {
    console.error("[stripe-webhook] handler error", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
