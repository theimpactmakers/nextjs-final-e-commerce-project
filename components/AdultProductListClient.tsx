"use client";
import ShopProductListClient from "@/components/ShopProductListClient";
import type { Database } from "@/types";

type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"] & {
    product_variants?: ProductVariant[];
    product_images?: ProductImage[];
    primary_image_url?: string | null;
    primary_image_alt?: string | null;
    min_price?: number | null;
    starting_variant_name?: string;
  };

export default function AdultProductListClient({
  products,
}: {
  products: ProductWithImage[];
}) {
  return <ShopProductListClient products={products} />;
}
