import { createClient } from "@supabase/supabase-js";
import { BestsellerCarouselClient } from "./BestsellerCarousel";

interface BestsellerCarouselProps {
  ageGroup?: "JUNIOR" | "ADULT" | "SENIOR";
}

/**
 * Server Component that fetches bestseller data
 * Uses anonymous Supabase client for better performance:
 * - Allows static/ISR rendering (not forced to dynamic)
 * - No cookies needed for public data
 * - Faster edge caching
 * - Supports filtering by age group
 */
export async function BestsellerCarousel({
  ageGroup,
}: BestsellerCarouselProps = {}) {
  // Use anonymous client for public data (allows ISR)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // Build query with optional age group filter
  let query = supabase
    .from("products_with_primary_image")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);

  if (ageGroup) {
    query = query.eq("age_group", ageGroup);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching bestsellers:", error);
    return (
      <div className="text-center py-8 text-muted-foreground">
        Bestseller können nicht geladen werden
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Bestseller verfügbar
      </div>
    );
  }

  return <BestsellerCarouselClient products={products} />;
}
