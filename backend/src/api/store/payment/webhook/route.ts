import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-13.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

// POST /store/payment/webhook - Handle Stripe webhooks
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const sig = req.headers["stripe-signature"] as string

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body as string,
      sig,
      webhookSecret
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return res.status(400).json({
      success: false,
      message: "Webhook signature verification failed",
    })
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent ${paymentIntent.id} succeeded`)
      // Here you would update the order status in Medusa
      break

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent ${failedPayment.id} failed`)
      // Handle failed payment
      break

    case "charge.refunded":
      const refund = event.data.object as Stripe.Charge
      console.log(`Charge ${refund.id} was refunded`)
      // Handle refund
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.status(200).json({ received: true })
}
