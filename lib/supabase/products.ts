import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

/*  CLIENT-SIDE FUNKTIONEN
 * Holt alle Bestseller-Produkte aus der Datenbank
 * @param limit - Optional: Maximale Anzahl der Produkte (Standard: 10)
 * @returns Array von Bestseller-Produkten
 */
export async function getBestsellers(limit: number = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: false }) // Neueste zuerst
    .limit(limit);

  if (error) {
    console.error("Error fetching bestsellers:", error);
    return [];
  }

  return data as Product[];
}

/**
 * Holt alle Bestseller-Produkte mit zusätzlichen Filtern
 * @param options - Optionale Filter-Parameter
 * @returns Array von Bestseller-Produkten
 */
export async function getBestsellersWithFilters(options?: {
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) {
  const supabase = createClient();

  let query = supabase.from("products").select("*").eq("bestseller", true);

  // Filter nach Kategorie
  if (options?.category) {
    query = query.eq("category", options.category);
  }

  // Filter nach Preis
  if (options?.minPrice !== undefined) {
    query = query.gte("price", options.minPrice);
  }
  if (options?.maxPrice !== undefined) {
    query = query.lte("price", options.maxPrice);
  }

  // Filter nach Lagerbestand
  if (options?.inStock) {
    query = query.gt("stock", 0);
  }

  // Sortierung und Limit
  query = query
    .order("created_at", { ascending: false })
    .limit(options?.limit || 10);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching bestsellers with filters:", error);
    return [];
  }

  return data as Product[];
}

/** SERVER SIDE FUNKTIONEN
 *
 * Server-seitige Funktion für Server Components
 * Nutzt den Server-Client für bessere Performance
 */
export async function getBestsellersServer(limit: number = 10) {
  const { createClient: createServerClient } = await import(
    "@/lib/supabase/server"
  );
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching bestsellers (server):", error);
    return [];
  }

  return data as Product[];
}
