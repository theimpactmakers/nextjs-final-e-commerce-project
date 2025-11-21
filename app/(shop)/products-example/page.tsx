import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export default async function ProductsExample() {
  const supabase = createClient();

  // Fetch products with their images and variants
  const { data: products, error } = await supabase
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
      )
    `
    )
    .eq("product_variants.is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-destructive">Fehler beim Laden der Produkte</div>
    );
  }

  return (
    <div className="container max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Unsere Produkte
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            images={product.product_images || []}
            variants={product.product_variants || []}
          />
        ))}
      </div>
    </div>
  );
}
