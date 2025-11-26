import { createClient } from "@supabase/supabase-js";
import { BestsellerCarouselClient } from "./BestsellerCarousel";

/**
 * Server Component that fetches bestseller data
 * Uses anonymous Supabase client for better performance:
 * - Allows static/ISR rendering (not forced to dynamic)
 * - No cookies needed for public data
 * - Faster edge caching
 */
export async function BestsellerCarousel() {
  // Use anonymous client for public data (allows ISR)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: products, error } = await supabase
    .from("products_with_primary_image")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: false })
    .limit(10);

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
