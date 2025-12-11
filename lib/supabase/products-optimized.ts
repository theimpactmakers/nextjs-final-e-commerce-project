import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export type ProductWithDetails = Product & {
  product_images: ProductImage[];
  product_variants: ProductVariant[];
  primary_image_url: string | null;
  primary_image_alt: string | null;
  min_price: number | null;
  starting_variant_name?: string;
};

interface ProductFilters {
  ageGroup?: "JUNIOR" | "ADULT" | "SENIOR";
  meatTypes?: string[];
  limit?: number;
}

/**
 * Optimized product fetching with React 19 cache()
 * Eliminates N+1 queries by using batch fetching with .in()
 *
 * Best Practices Next.js 16 + React 19:
 * - Uses cache() for request deduplication
 * - Anonymous Supabase client (no cookies, allows ISR)
 * - Batch queries with .in() to prevent N+1
 * - Parallel Promise.all() for optimal performance
 * - Type-safe with Database types
 */
export const getProductsWithDetails = cache(
  async (filters: ProductFilters = {}): Promise<ProductWithDetails[]> => {
    // Anonymous client for public data (enables ISR/SSG)
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      }
    );

    // Step 1: Build products query
    let productsQuery = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.ageGroup) {
      productsQuery = productsQuery.eq("age_group", filters.ageGroup);
    }

    if (filters.meatTypes && filters.meatTypes.length > 0) {
      productsQuery = productsQuery.in("meat_type", filters.meatTypes);
    }

    if (filters.limit) {
      productsQuery = productsQuery.limit(filters.limit);
    }

    const { data: productsData, error: productsError } = await productsQuery;

    if (productsError) throw productsError;
    if (!productsData || productsData.length === 0) return [];

    const products = productsData as Product[];
    const productIds = products.map((p) => p.id);

    // Step 2: Batch fetch variants and images in parallel
    // This prevents N+1 queries - instead of N queries, we do 2 queries total
    const [variantsResult, imagesResult] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*")
        .in("product_id", productIds)
        .eq("is_active", true)
        .order("price", { ascending: true }),

      supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
    ]);

    if (variantsResult.error) throw variantsResult.error;
    if (imagesResult.error) throw imagesResult.error;

    const variants = (variantsResult.data || []) as ProductVariant[];
    const images = (imagesResult.data || []) as ProductImage[];

    // Step 3: Efficiently combine data using Maps (O(1) lookups)
    const variantsMap = new Map<string, ProductVariant[]>();
    variants.forEach((variant) => {
      if (!variantsMap.has(variant.product_id)) {
        variantsMap.set(variant.product_id, []);
      }
      variantsMap.get(variant.product_id)!.push(variant);
    });

    const imagesMap = new Map<string, ProductImage[]>();
    const primaryImageMap = new Map<string, ProductImage>();

    images.forEach((image) => {
      if (!imagesMap.has(image.product_id)) {
        imagesMap.set(image.product_id, []);
      }
      imagesMap.get(image.product_id)!.push(image);

      // Track primary image
      if (image.is_primary) {
        primaryImageMap.set(image.product_id, image);
      }
    });

    // Step 4: Combine all data efficiently
    return products.map((product) => {
      const variants = variantsMap.get(product.id) || [];
      const images = imagesMap.get(product.id) || [];
      const primaryImage = primaryImageMap.get(product.id);

      // Calculate min price from variants
      const minPrice =
        variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : null;

      return {
        ...product,
        product_variants: variants,
        product_images: images,
        primary_image_url: primaryImage?.image_url || null,
        primary_image_alt: primaryImage?.alt_text || null,
        min_price: minPrice,
      };
    });
  }
);

/**
 * Get products by age group with all details
 * Optimized version for age-specific pages
 */
export const getProductsByAge = cache(
  async (
    ageGroup: "JUNIOR" | "ADULT" | "SENIOR",
    meatTypes?: string[]
  ): Promise<ProductWithDetails[]> => {
    return getProductsWithDetails({
      ageGroup,
      meatTypes: meatTypes && meatTypes.length > 0 ? meatTypes : undefined,
    });
  }
);
