// --- ProductCard-Design wie auf products-example ---
import ProductCard from "./ProductCard";
import type { Database } from "@/types";

type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"] & {
    product_variants?: ProductVariant[];
    product_images?: ProductImage[];
  };

export default function ShopProductCard({
  product,
}: {
  product: ProductWithImage;
}) {
  // Fallback: Erzeuge einen Fake-Variant, wenn keine Varianten vorhanden sind (z.B. auf Shop-Seite)
  const safeId = product.id ?? "unknown";
  const safeBestseller = product.bestseller ?? false;
  const safeEan = product.ean ?? 0;
  const variants: ProductVariant[] =
    Array.isArray(product.product_variants) &&
    product.product_variants.length > 0
      ? (product.product_variants as ProductVariant[])
      : [
          {
            id: safeId,
            name: product.starting_variant_name || "Standard",
            price: product.min_price ?? 0,
            compare_at_price: null,
            stock_quantity: 99,
            allow_backorder: null,
            available_from: null,
            available_until: null,
            cost_price: null,
            created_at: null,
            is_active: null,
            low_stock_threshold: null,
            product_id: safeId,
            shipping_cost: null,
            tax_rate: null,
            track_inventory: null,
            updated_at: null,
            weight_grams: 0,
          },
        ];
  const images: ProductImage[] =
    Array.isArray(product.product_images) && product.product_images.length > 0
      ? (product.product_images as ProductImage[])
      : ([
          product.primary_image_url
            ? {
                id: safeId,
                image_url: product.primary_image_url,
                alt_text: product.primary_image_alt || product.name || "",
                display_order: 0,
                is_primary: true,
                product_id: safeId,
                created_at: null,
                updated_at: null,
              }
            : undefined,
        ].filter(Boolean) as ProductImage[]);
  const safeProduct = {
    ...product,
    id: safeId,
    bestseller: safeBestseller,
    ean: safeEan,
    is_featured: product.is_featured ?? false,
    is_new: product.is_new ?? false,
    is_on_sale: product.is_on_sale ?? false,
    name: product.name ?? "",
    slug: product.slug ?? "",
  };
  return (
    <ProductCard product={safeProduct} images={images} variants={variants} />
  );
}
