import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "")
const FROM_EMAIL = process.env.FROM_EMAIL || "Vebanet <noreply@vebanet.com>"

// Order Shipped Event
export default async function orderShippedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; fulfillment_id: string }>) {
  const { id: orderId, fulfillment_id } = event.data

  const orderModuleService = container.resolve("order")
  const fulfillmentModuleService = container.resolve("fulfillment")
  const customerModuleService = container.resolve("customer")

  try {
    const order = await orderModuleService.retrieveOrder(orderId)
    const fulfillment = await fulfillmentModuleService.retrieveFulfillment(fulfillment_id, {
      relations: ["tracking_links"],
    })

    const customer = order.customer_id
      ? await customerModuleService.retrieveCustomer(order.customer_id)
      : null

    const customerEmail = customer?.email || order.email
    const customerName = customer
      ? `${customer.first_name} ${customer.last_name}`
      : "Valued Customer"

    if (!customerEmail) {
      console.error("No customer email found for order:", orderId)
      return
    }

    const trackingLink = fulfillment.tracking_links?.[0]
    const trackingNumber = trackingLink?.tracking_number || "N/A"
    const trackingUrl = trackingLink?.url || "#"
    const carrier = fulfillment.provider_id || "Carrier"

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Your order has shipped! - ${order.display_id || orderId}`,
      html: generateShippingEmail({
        orderNumber: order.display_id?.toString() || orderId,
        customerName,
        trackingNumber,
        trackingUrl,
        carrier,
      }),
    })

    console.log(`Shipping notification email sent for order ${orderId}`)
  } catch (error) {
    console.error("Error sending shipping notification email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}

function generateShippingEmail(data: {
  orderNumber: string
  customerName: string
  trackingNumber: string
  trackingUrl: string
  carrier: string
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
  `
}
