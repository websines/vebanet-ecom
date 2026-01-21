import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-13.basil",
})

// POST /store/payment/create-intent
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { amount, currency = "usd", metadata = {} } = req.body as {
      amount: number
      currency?: string
      metadata?: Record<string, string>
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      })
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })

    res.status(200).json({
      success: true,
      data: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
    })
  } catch (error) {
    console.error("Stripe error:", error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Payment creation failed",
    })
  }
}

// GET /store/payment/:paymentIntentId
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { paymentIntentId } = req.params as { paymentIntentId: string }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    res.status(200).json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    })
  } catch (error) {
    console.error("Stripe error:", error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve payment",
    })
  }
}
