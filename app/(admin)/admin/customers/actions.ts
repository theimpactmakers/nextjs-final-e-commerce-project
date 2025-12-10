"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Verify admin access
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nicht angemeldet");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Keine Berechtigung");
  }

  return user;
}

// Update customer role
export async function updateCustomerRole(
  customerId: string,
  role: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin();

    const adminClient = createServiceRoleClient();
    const { error } = await adminClient
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", customerId);

    if (error) throw error;

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${customerId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating customer role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Fehler beim Aktualisieren",
    };
  }
}

// Update customer profile
export async function updateCustomerProfile(
  customerId: string,
  data: {
    first_name?: string;
    last_name?: string;
    gender?: string;
    date_of_birth?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin();

    const adminClient = createServiceRoleClient();
    const { error } = await adminClient
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", customerId);

    if (error) throw error;

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${customerId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Fehler beim Aktualisieren",
    };
  }
}

// Delete customer account (dangerous - should be used carefully)
export async function deleteCustomer(
  customerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin();

    const adminClient = createServiceRoleClient();

    // First delete related data (addresses, wishlist, cart items, etc.)
    // This should ideally be handled by database cascades
    await adminClient.from("addresses").delete().eq("user_id", customerId);
    await adminClient.from("wishlist_items").delete().eq("user_id", customerId);

    // Delete from auth.users (this will cascade to profiles)
    const { error } = await adminClient.auth.admin.deleteUser(customerId);

    if (error) throw error;

    revalidatePath("/admin/customers");

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Fehler beim Löschen des Kunden",
    };
  }
}

// Get customer details with all related data
export async function getCustomerDetails(customerId: string) {
  try {
    await verifyAdmin();

    const adminClient = createServiceRoleClient();

    // Get profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", customerId)
      .single();

    if (!profile) {
      return null;
    }

    // Get email from auth.users
    const {
      data: { user },
    } = await adminClient.auth.admin.getUserById(customerId);

    // Get addresses
    const { data: addresses } = await adminClient
      .from("addresses")
      .select("*")
      .eq("user_id", customerId)
      .order("is_default", { ascending: false });

    // Get orders
    const { data: orders } = await adminClient
      .from("orders")
      .select("*")
      .eq("user_id", customerId)
      .order("created_at", { ascending: false });

    // Get reviews
    const { data: reviews } = await adminClient
      .from("reviews")
      .select(
        `
        *,
        products(name, slug)
      `
      )
      .eq("user_id", customerId)
      .order("created_at", { ascending: false });

    return {
      ...profile,
      email: user?.email || "",
      email_confirmed: user?.email_confirmed_at ? true : false,
      last_sign_in: user?.last_sign_in_at || null,
      addresses: addresses || [],
      orders: orders || [],
      reviews: reviews || [],
    };
  } catch (error) {
    console.error("Error getting customer details:", error);
    return null;
  }
}
