import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      userId,
      guestEmail,
      guestFirstName,
      guestLastName,
      billingAddress,
      shippingAddress,
      subtotal,
      shippingCost,
      taxAmount,
      totalAmount,
      shippingMethod,
      paymentMethod,
      paymentTransactionId,
      customerNotes,
      orderItems,
    } = body;

    // Use regular server client - RLS policy now allows guest orders
    const supabase = await createClient();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId || null,
        guest_email: userId ? null : guestEmail,
        guest_first_name: userId ? null : guestFirstName,
        guest_last_name: userId ? null : guestLastName,
        status: "pending",
        payment_status: "pending", // Will be updated to "paid" by webhook
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        payment_transaction_id: paymentTransactionId,
        customer_notes: customerNotes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw orderError;
    }

    // Create order items with the order_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItemsWithOrderId = orderItems.map((item: any) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      throw itemsError;
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
