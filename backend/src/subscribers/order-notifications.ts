import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Resend } from "resend"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "")
const FROM_EMAIL = process.env.FROM_EMAIL || "Vebanet <noreply@vebanet.com>"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

// Order Placed Event
export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id

  // Get order service to fetch order details
  const orderModuleService = container.resolve("order")
  const customerModuleService = container.resolve("customer")

  try {
    const order = await orderModuleService.retrieveOrder(orderId, {
      relations: ["items", "shipping_address"],
    })

    // Get customer details
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

    // Format order items
    const items = order.items?.map((item) => ({
      name: item.title || item.variant?.title || "Product",
      quantity: item.quantity,
      price: item.unit_price || 0,
    })) || []

    // Format shipping address
    const shippingAddress = order.shipping_address
      ? [
          `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          order.shipping_address.address_1,
          order.shipping_address.address_2,
          `${order.shipping_address.city}, ${order.shipping_address.province} ${order.shipping_address.postal_code}`,
          order.shipping_address.country_code?.toUpperCase(),
        ]
          .filter(Boolean)
          .join("\n")
      : "Address not available"

    // Send order confirmation email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation - ${order.display_id || orderId}`,
      html: generateOrderConfirmationEmail({
        orderNumber: order.display_id?.toString() || orderId,
        customerName,
        items,
        total: (order.total || 0) / 100, // Convert from cents
        shippingAddress,
      }),
    })

    console.log(`Order confirmation email sent for order ${orderId}`)
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}

// Email template generator
function generateOrderConfirmationEmail(data: {
  orderNumber: string
  customerName: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  shippingAddress: string
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
            ${data.items
              .map(
                (item) => `
              <div class="item">
                <div>
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">Qty: ${item.quantity}</div>
                </div>
                <div class="item-details">$${((item.price * item.quantity) / 100).toFixed(2)}</div>
              </div>
            `
              )
              .join("")}
            <div class="total">Total: $${data.total.toFixed(2)}</div>
          </div>

          <div class="section">
            <div class="section-title">SHIPPING ADDRESS</div>
            <p style="color: #d1d5db; margin: 0; white-space: pre-line;">${data.shippingAddress}</p>
          </div>

          <div style="text-align: center;">
            <a href="${FRONTEND_URL}/account/orders" class="button">
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
  `
}
