import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Promotion = Database["public"]["Tables"]["promotions"]["Row"];
type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];

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

/**
 * Holt alle aktiven Promotions
 * @returns Array von aktiven Promotions
 */
export async function getActivePromotions() {
  const supabase = createClient();
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

/**
 * Berechnet den Promotions-Rabatt für ein Produkt/Variante
 * @param productId - ID des Produkts
 * @param variantId - ID der Variante
 * @param basePrice - Basis-Preis
 * @returns Objekt mit rabattiertem Preis und Promotions-Details oder null
 */
export async function calculatePromotionDiscount(
  productId: string,
  variantId: string,
  basePrice: number
) {
  const promotions = await getActivePromotions();

  for (const promo of promotions) {
    let isApplicable = false;

    if (promo.applies_to === "all") {
      isApplicable = true;
    } else if (
      promo.applies_to === "specific_products" &&
      promo.product_ids
    ) {
      isApplicable = promo.product_ids.includes(productId);
    } else if (
      promo.applies_to === "specific_variants" &&
      promo.variant_ids
    ) {
      isApplicable = promo.variant_ids.includes(variantId);
    }

    if (isApplicable) {
      let discountedPrice = basePrice;

      if (promo.discount_type === "percentage") {
        discountedPrice = basePrice * (1 - promo.discount_value / 100);
      } else if (promo.discount_type === "fixed_amount") {
        discountedPrice = basePrice - promo.discount_value;
      }

      return {
        originalPrice: basePrice,
        discountedPrice: Math.max(0, discountedPrice),
        promotion: promo,
        discountAmount:
          promo.discount_type === "percentage"
            ? promo.discount_value
            : promo.discount_value,
        discountType: promo.discount_type,
      };
    }
  }

  return null;
}
