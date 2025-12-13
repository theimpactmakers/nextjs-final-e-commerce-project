import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST() {
  try {
    const supabase = createServiceRoleClient();

    // Get all pending orders
    const { data: pendingOrders, error } = await supabase
      .from("orders")
      .select("id, payment_transaction_id, payment_status")
      .eq("payment_status", "pending")
      .not("payment_transaction_id", "is", null);

    if (error) {
      console.error("Error fetching pending orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({
        message: "No pending orders to sync",
        synced: 0,
      });
    }

    let syncedCount = 0;
    const results = [];

    // Check each order's payment status with Stripe
    for (const order of pendingOrders) {
      try {
        // Fetch the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          order.payment_transaction_id
        );

        // If payment succeeded in Stripe, update our database
        if (paymentIntent.status === "succeeded") {
          const { error: updateError } = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          if (updateError) {
            console.error(`Failed to update order ${order.id}:`, updateError);
            results.push({
              orderId: order.id,
              status: "error",
              message: updateError.message,
            });
          } else {
            syncedCount++;
            results.push({
              orderId: order.id,
              status: "synced",
              stripeStatus: paymentIntent.status,
            });
          }
        } else {
          results.push({
            orderId: order.id,
            status: "unchanged",
            stripeStatus: paymentIntent.status,
          });
        }
      } catch (stripeError) {
        console.error(
          `Error checking payment intent for order ${order.id}:`,
          stripeError
        );
        results.push({
          orderId: order.id,
          status: "error",
          message:
            stripeError instanceof Error
              ? stripeError.message
              : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: `Synced ${syncedCount} of ${pendingOrders.length} orders`,
      synced: syncedCount,
      total: pendingOrders.length,
      results,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
