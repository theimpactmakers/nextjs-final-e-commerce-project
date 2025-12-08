import { createClient } from "@/lib/supabase/server";
import { createClient as createStaticClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import SingleProductView from "./SingleProductView";
import { getProductReviews, getReviewStats } from "@/lib/supabase/reviews";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  // Fetch product with images, variants, ingredients
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        id,
        image_url,
        alt_text,
        display_order,
        is_primary
      ),
      product_variants (
        id,
        name,
        price,
        compare_at_price,
        weight_grams,
        stock_quantity,
        is_active
      ),
      product_ingredients (
        id,
        percentage,
        display_order,
        ingredients (
          id,
          name,
          description,
          is_allergen
        )
      ),
      feeding_guidelines (
        id,
        dog_weight_kg_min,
        dog_weight_kg_max,
        daily_amount_grams,
        notes,
        display_order
      )
    `
    )
    .eq("slug", params.slug)
    .eq("product_variants.is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch reviews and stats
  const [reviews, reviewStats] = await Promise.all([
    getProductReviews(product.id),
    getReviewStats(product.id),
  ]);

  return (
    <div className="container max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        <span>&gt;</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">
          Alle Produkte
        </Link>
        <span>&gt;</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <SingleProductView product={product} reviews={reviews} reviewStats={reviewStats} />
    </div>
  );
}

// Generate static params for all products
export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .not("slug", "is", null);

  if (!products) return [];

  return products.map((product: { slug: string | null }) => ({
    slug: product.slug || "",
  }));
}
