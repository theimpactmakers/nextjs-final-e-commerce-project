/**
 * SERVER-SIDE ONLY - Produkt und Promotions Funktionen
 * Diese Datei darf NUR in Server Components importiert werden!
 * Caching erfolgt über Page-Level revalidate
 */

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Promotion = Database["public"]["Tables"]["promotions"]["Row"];

/**
 * Holt alle aktiven Promotions (Server-Side)
 * Caching erfolgt über Page-Level revalidate, nicht über unstable_cache
 * @returns Array von aktiven Promotions
 */
export async function getActivePromotionsServer() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .lte("starts_at", now)
    .gte("ends_at", now);

  if (error) {
    console.error("Error fetching active promotions:", error);
    return [];
  }

  return data as Promotion[];
}
