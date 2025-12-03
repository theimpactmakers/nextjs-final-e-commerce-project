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
    const { items, shippingMethod, paymentMethodType } = body as {
      items: CartItem[];
      shippingMethod: string;
      paymentMethodType?: string;
    };

    console.log("=== Payment Intent API Debug ===");
    console.log("Received paymentMethodType:", paymentMethodType);
    console.log("Type of paymentMethodType:", typeof paymentMethodType);
    console.log("Full body:", {
      items: items.length,
      shippingMethod,
      paymentMethodType,
    });

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

    console.log("Creating PaymentIntent with method type:", paymentMethodType);

    // Create Payment Intent with specific payment method type
    // Default to 'card' if no method type specified
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      payment_method_types: [paymentMethodType || "card"],
      metadata: {
        subtotal: subtotal.toFixed(2),
        shipping_cost: shippingCost.toFixed(2),
        total: totalAmount.toFixed(2),
        payment_method_type: paymentMethodType || "card",
      },
    });

    console.log("PaymentIntent created successfully:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      payment_method_types: paymentIntent.payment_method_types,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentMethodTypes: paymentIntent.payment_method_types, // Send back what was actually created
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // Check if error is due to unsupported payment method
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("payment_method_types") ||
      errorMessage.includes("not activated")
    ) {
      return NextResponse.json(
        {
          error:
            "Diese Zahlungsmethode ist derzeit nicht verfügbar. Bitte wählen Sie eine andere Zahlungsmethode.",
          unsupportedMethod: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
