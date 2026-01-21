import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "")
const FROM_EMAIL = process.env.FROM_EMAIL || "Vebanet <noreply@vebanet.com>"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

// Customer Created Event - Welcome Email
export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = event.data.id

  const customerModuleService = container.resolve("customer")

  try {
    const customer = await customerModuleService.retrieveCustomer(customerId)

    if (!customer.email) {
      console.error("No email found for customer:", customerId)
      return
    }

    const customerName = customer.first_name || "there"

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customer.email,
      subject: "Welcome to Vebanet!",
      html: generateWelcomeEmail({
        customerName,
        email: customer.email,
      }),
    })

    console.log(`Welcome email sent to customer ${customerId}`)
  } catch (error) {
    console.error("Error sending welcome email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}

function generateWelcomeEmail(data: {
  customerName: string
  email: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; padding: 40px; }
          .header { text-align: center; margin-bottom: 32px; }
          .logo { font-size: 28px; font-weight: bold; color: #00e5ff; }
          h1 { color: #ffffff; margin: 0 0 8px 0; }
          .button { display: inline-block; background-color: #00e5ff; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .features { margin: 24px 0; }
          .feature { display: flex; align-items: center; gap: 12px; padding: 12px 0; color: #d1d5db; }
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
            <a href="${FRONTEND_URL}" class="button">
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
  `
}
