"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveReview(reviewId: string) {
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

  // Approve review
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true, updated_at: new Date().toISOString() })
    .eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function rejectReview(reviewId: string) {
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

  // Reject review (set to not approved)
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: false, updated_at: new Date().toISOString() })
    .eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReview(reviewId: string) {
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

  // Delete review
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}
