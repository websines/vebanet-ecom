import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "")

const FROM_EMAIL = process.env.FROM_EMAIL || "Vebanet <noreply@vebanet.com>"

// Email templates
const templates = {
  orderConfirmation: (data: {
    orderNumber: string
    customerName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    shippingAddress: string
  }) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 40px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-size: 28px; font-weight: bold; color: #00e5ff; }
            h1 { color: #ffffff; margin: 0 0 8px 0; }
            .order-number { color: #9ca3af; font-size: 14px; }
            .section { margin: 24px 0; padding: 20px; background-color: #1f2937; border-radius: 12px; }
            .section-title { color: #00e5ff; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
            .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #374151; }
            .item:last-child { border-bottom: none; }
            .item-name { color: #ffffff; }
            .item-details { color: #9ca3af; font-size: 14px; }
            .total { font-size: 24px; font-weight: bold; color: #00e5ff; text-align: right; margin-top: 16px; }
            .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; background-color: #00e5ff; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VEBANET</div>
              <h1>Thank you for your order!</h1>
              <p class="order-number">Order #${data.orderNumber}</p>
            </div>

            <p>Hi ${data.customerName},</p>
            <p>We've received your order and will send you another email when it ships.</p>

            <div class="section">
              <div class="section-title">ORDER SUMMARY</div>
              ${data.items.map(item => `
                <div class="item">
                  <div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">Qty: ${item.quantity}</div>
                  </div>
                  <div class="item-details">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join("")}
              <div class="total">Total: $${data.total.toFixed(2)}</div>
            </div>

            <div class="section">
              <div class="section-title">SHIPPING ADDRESS</div>
              <p style="color: #d1d5db; margin: 0;">${data.shippingAddress.replace(/\n/g, "<br>")}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || "https://vebanet.com"}/account/orders" class="button">
                View Order
              </a>
            </div>

            <div class="footer">
              <p>Questions? Contact us at support@vebanet.com</p>
              <p>&copy; ${new Date().getFullYear()} Vebanet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  shippingNotification: (data: {
    orderNumber: string
    customerName: string
    trackingNumber: string
    trackingUrl: string
    carrier: string
  }) => ({
    subject: `Your order has shipped! - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 40px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-size: 28px; font-weight: bold; color: #00e5ff; }
            h1 { color: #ffffff; margin: 0 0 8px 0; }
            .tracking { background-color: #1f2937; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
            .tracking-label { color: #9ca3af; font-size: 12px; margin-bottom: 8px; }
            .tracking-number { color: #00e5ff; font-size: 20px; font-weight: bold; letter-spacing: 2px; }
            .button { display: inline-block; background-color: #00e5ff; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
            .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VEBANET</div>
              <h1>Your order is on its way!</h1>
            </div>

            <p>Hi ${data.customerName},</p>
            <p>Great news! Your order #${data.orderNumber} has been shipped via ${data.carrier}.</p>

            <div class="tracking">
              <div class="tracking-label">TRACKING NUMBER</div>
              <div class="tracking-number">${data.trackingNumber}</div>
              <a href="${data.trackingUrl}" class="button">Track Package</a>
            </div>

            <div class="footer">
              <p>Questions? Contact us at support@vebanet.com</p>
              <p>&copy; ${new Date().getFullYear()} Vebanet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  welcomeEmail: (data: { customerName: string; email: string }) => ({
    subject: "Welcome to Vebanet!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 40px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-size: 28px; font-weight: bold; color: #00e5ff; }
            h1 { color: #ffffff; margin: 0 0 8px 0; }
            .button { display: inline-block; background-color: #00e5ff; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
            .features { margin: 24px 0; }
            .feature { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
            .feature-icon { color: #00e5ff; font-size: 20px; }
            .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VEBANET</div>
              <h1>Welcome to the future of tech shopping!</h1>
            </div>

            <p>Hi ${data.customerName},</p>
            <p>Thank you for creating an account with Vebanet. You now have access to:</p>

            <div class="features">
              <div class="feature">
                <span class="feature-icon">🚀</span>
                <span>Faster checkout with saved addresses</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📦</span>
                <span>Easy order tracking and history</span>
              </div>
              <div class="feature">
                <span class="feature-icon">❤️</span>
                <span>Save items to your wishlist</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🎁</span>
                <span>Exclusive member deals and offers</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || "https://vebanet.com"}" class="button">
                Start Shopping
              </a>
            </div>

            <div class="footer">
              <p>Questions? Contact us at support@vebanet.com</p>
              <p>&copy; ${new Date().getFullYear()} Vebanet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

// POST /store/email/send
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { template, to, data } = req.body as {
      template: keyof typeof templates
      to: string
      data: Record<string, unknown>
    }

    if (!template || !to || !data) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: template, to, data",
      })
    }

    const templateFn = templates[template]
    if (!templateFn) {
      return res.status(400).json({
        success: false,
        message: `Invalid template: ${template}`,
      })
    }

    const emailContent = templateFn(data as never)

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    res.status(200).json({
      success: true,
      data: { id: result.data?.id },
    })
  } catch (error) {
    console.error("Email error:", error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email",
    })
  }
}
