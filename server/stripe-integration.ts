import Stripe from "stripe";
import { ENV } from "./_core/env";

// Initialize Stripe
export const stripe = new Stripe(ENV.stripeSecretKey);

// Define product and price IDs for Moda Aurea
export const STRIPE_PRODUCTS = {
  PRODUCT_ID: "prod_moda_aurea", // You'll need to create this in Stripe Dashboard
};

// Create a checkout session for an order
export async function createCheckoutSession(
  orderData: {
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    totalPrice: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      size: string;
      color?: string;
    }>;
  },
  origin: string
) {
  try {
    // Create line items for Stripe
    const lineItems = orderData.items.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: `${item.name} - Tamanho: ${item.size}${item.color ? ` - Cor: ${item.color}` : ""}`,
          metadata: {
            product_name: item.name,
            size: item.size,
            color: item.color || "N/A",
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      line_items: lineItems,
      mode: "payment",
      customer_email: orderData.customerEmail,
      client_reference_id: orderData.orderNumber,
      metadata: {
        order_number: orderData.orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
) {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    throw error;
  }
}

// Handle successful payment
export async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const orderNumber = session.client_reference_id;
  const customerEmail = session.customer_email;

  console.log(`Payment successful for order: ${orderNumber}`);
  console.log(`Customer email: ${customerEmail}`);

  // Update order status in database
  // This will be done in the webhook handler
  return {
    orderNumber,
    customerEmail,
    sessionId: session.id,
  };
}

// Get payment intent details
export async function getPaymentIntentDetails(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
}
