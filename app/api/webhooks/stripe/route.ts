import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
// You'll get this from Stripe Dashboard → Developers → Webhooks
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    // Get the raw body as text (required for signature verification)
    const body = await req.text();

    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify the webhook signature to ensure it's from Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        {
          error: `Webhook Error: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update the order in the database
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Optional: Update order status to "failed"
        await handlePaymentFailure(paymentIntent);
        break;
      }

      case "payment_intent.processing": {
        // You can track this if needed
        break;
      }

      case "charge.succeeded":
      case "charge.updated":
        // These events are informational - payment_intent.succeeded is what we care about
        break;

      default:
        // Unhandled event type
        break;
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 * Updates the order status to "paid" and saves the transaction ID
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createClient();

  try {
    // Find the order by payment_transaction_id
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_transaction_id", paymentIntent.id)
      .single();

    if (findError || !order) {
      console.error("Order not found for payment intent:", paymentIntent.id);
      return;
    }

    // Update order status to paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      throw updateError;
    }

    // Optional: Send confirmation email here
    // await sendOrderConfirmationEmail(order);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}

/**
 * Handle failed payment
 * Updates the order status to "failed"
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createClient();

  try {
    // Find the order by payment_transaction_id
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_transaction_id", paymentIntent.id)
      .single();

    if (findError || !order) {
      console.error("Order not found for failed payment:", paymentIntent.id);
      return;
    }

    // Update order status to failed
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order status:", updateError);
      throw updateError;
    }

    // Optional: Send payment failure notification email
    // await sendPaymentFailureEmail(order);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}
