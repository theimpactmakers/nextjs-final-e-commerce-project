import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// Type for cart items
interface CartItem {
  price: number;
  quantity: number;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get request body
    const body = await request.json();
    const { items, shippingMethod } = body as {
      items: CartItem[];
      shippingMethod: string;
    };

    // Validate items exist
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate order total from items
    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );

    // Get shipping cost from database
    let shippingCost = 0;
    if (shippingMethod) {
      const { data: method } = await supabase
        .from("shipping_methods")
        .select("base_price, free_shipping_threshold")
        .eq("code", shippingMethod)
        .single();

      if (method) {
        // Check if order qualifies for free shipping
        if (
          method.free_shipping_threshold &&
          subtotal >= method.free_shipping_threshold
        ) {
          shippingCost = 0;
        } else {
          shippingCost = method.base_price || 0;
        }
      }
    }

    // Calculate total (Stripe uses smallest currency unit - cents for EUR)
    const totalAmount = subtotal + shippingCost;
    const amountInCents = Math.round(totalAmount * 100);

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        subtotal: subtotal.toFixed(2),
        shipping_cost: shippingCost.toFixed(2),
        total: totalAmount.toFixed(2),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
