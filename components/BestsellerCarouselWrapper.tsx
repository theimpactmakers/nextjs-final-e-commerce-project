import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { BestsellerCarouselClient } from "./BestsellerCarousel";
import type { Database } from "@/types";

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

interface BestsellerCarouselProps {
  ageGroup?: "JUNIOR" | "ADULT" | "SENIOR";
  specialsOnly?: boolean;
}

/**
 * Cached data fetching function (React 19 cache API)
 * Prevents duplicate requests within the same render cycle
 */
const getBestsellerProducts = cache(
  async (ageGroup?: "JUNIOR" | "ADULT" | "SENIOR", specialsOnly?: boolean) => {
    // Anonymous client for public data (enables ISR/SSG)
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      }
    );

    // Optimized query: Filter bestsellers first, then by age group or specials
    let query = supabase
      .from("products_with_primary_image")
      .select("*")
      .eq("bestseller", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (ageGroup) {
      query = query.eq("age_group", ageGroup);
    }

    if (specialsOnly) {
      query = query.not("specials", "is", null);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as ProductWithImage[];
  }
);

/**
 * Server Component that fetches bestseller data
 * Best Practices 2025:
 * - Uses React 19 cache() for deduplication
 * - Anonymous Supabase client (no cookies, allows ISR/SSG)
 * - Type-safe with Database types
 * - Error boundaries for graceful error handling
 *
 * Usage: Wrap in <Suspense> for streaming:
 * <Suspense fallback={<LoadingSkeleton />}>
 *   <BestsellerCarousel />
 * </Suspense>
 */
export async function BestsellerCarousel({
  ageGroup,
  specialsOnly,
}: BestsellerCarouselProps = {}) {
  try {
    const products = await getBestsellerProducts(ageGroup, specialsOnly);

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Keine Bestseller verfügbar
        </div>
      );
    }

    return <BestsellerCarouselClient products={products} />;
  } catch {
    // Error boundary will catch this in production
    return (
      <div className="text-center py-8 text-muted-foreground">
        Bestseller können nicht geladen werden
      </div>
    );
  }
}
