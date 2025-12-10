import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { BestsellerCarouselClient } from "./BestsellerCarousel";
import type { Database } from "@/types";

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

/**
 * Cached data fetching function (React 19 cache API)
 * Prevents duplicate requests within the same render cycle
 */
const getNewProducts = cache(async () => {
  // Anonymous client for public data (enables ISR/SSG)
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  // Optimized query: Select only needed fields, use index on is_new
  const { data, error } = await supabase
    .from("products_with_primary_image")
    .select(
      "id, name, slug, description, age_group, meat_type, min_price, primary_image_url, primary_image_alt, is_new, created_at"
    )
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw error;
  return data as ProductWithImage[];
});

/**
 * Server Component that fetches newest products data
 * Best Practices 2025:
 * - Uses React 19 cache() for deduplication
 * - Anonymous Supabase client (no cookies, allows ISR/SSG)
 * - Type-safe with Database types
 * - Error boundaries for graceful error handling
 * 
 * Usage: Wrap in <Suspense> for streaming:
 * <Suspense fallback={<LoadingSkeleton />}>
 *   <NewProductsCarousel />
 * </Suspense>
 */
export async function NewProductsCarousel() {
  try {
    const products = await getNewProducts();

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Keine neuen Produkte verfügbar
        </div>
      );
    }

    return <BestsellerCarouselClient products={products} />;
  } catch (error) {
    // Error boundary will catch this in production
    return (
      <div className="text-center py-8 text-muted-foreground">
        Neueste Produkte können nicht geladen werden
      </div>
    );
  }
}
