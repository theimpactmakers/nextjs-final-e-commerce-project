"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  // Verify admin access
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Unauthorized - Admin access required" };
  }

  // Update order status
  const updates: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  // Set timestamps based on status
  if (status === "shipped" && !updates.shipped_at) {
    updates.shipped_at = new Date().toISOString();
  }
  if (status === "delivered" && !updates.delivered_at) {
    updates.delivered_at = new Date().toISOString();
  }
  if (status === "cancelled" && !updates.cancelled_at) {
    updates.cancelled_at = new Date().toISOString();
  }
  if (status === "confirmed" && !updates.confirmed_at) {
    updates.confirmed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
) {
  const supabase = await createClient();

  // Verify admin access
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Unauthorized - Admin access required" };
  }

  // Update payment status
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}
