import { createClient } from "@/lib/supabase/server";
import { createClient as createStaticClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  // Fetch product with images and variants
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
    .eq("slug", params.slug)
    .eq("product_variants.is_active", true)
    .single();

  if (error || !products) {
    notFound();
  }

  const product = products;

  return (
    <div className="container max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      {/* Product Details - Centered */}
      <div className="max-w-2xl mx-auto">
        <ProductCard
          product={product}
          images={product.product_images || []}
          variants={product.product_variants || []}
        />
      </div>

      {/* Additional Product Info */}
      {product.feeding_recommendation && (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Fütterungsempfehlung</h2>
          <p className="text-muted-foreground whitespace-pre-line">
            {product.feeding_recommendation}
          </p>
        </div>
      )}

      {/* Back to Shop Button */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
        >
          ← Zurück zum Shop
        </Link>
      </div>
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
