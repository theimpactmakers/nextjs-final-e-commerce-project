"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type RelatedProduct = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  product_images: Array<{
    image_url: string;
    alt_text: string | null;
    is_primary: boolean | null;
  }>;
  product_variants: Array<{
    id: string;
    name: string;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
  }>;
};

interface RelatedProductsProps {
  productId: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function RelatedProducts({
  productId,
  title = "Entdecke ähnliche Produkte",
  subtitle = "Produkte, die andere Kunden auch gekauft haben",
  limit = 4,
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      const supabase = createClient();

      try {
        // Fetch related products from database
        const { data: relatedProductsData } = await supabase
          .from("related_products")
          .select(
            `
            related_product_id,
            products!related_products_related_product_id_fkey (
              id,
              name,
              slug,
              description,
              product_images (
                image_url,
                alt_text,
                is_primary
              ),
              product_variants (
                id,
                name,
                price,
                compare_at_price,
                stock_quantity
              )
            )
          `
          )
          .eq("product_id", productId)
          .order("display_order", { ascending: true })
          .limit(limit);

        if (relatedProductsData) {
          const products = relatedProductsData
            .map((rp) => rp.products)
            .flat()
            .filter((p) => p !== null) as RelatedProduct[];

          setRelatedProducts(products);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, limit]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => {
          const primaryImage = relatedProduct.product_images?.find(
            (img) => img.is_primary
          );
          const firstVariant = relatedProduct.product_variants?.[0];

          return (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.slug || relatedProduct.id}`}
              className="group cursor-pointer h-full"
            >
              <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.image_url}
                      alt={primaryImage.alt_text || relatedProduct.name || ""}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Kein Bild
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 grow">
                  <h3 className="font-medium line-clamp-2 mb-2">
                    {relatedProduct.name}
                  </h3>
                  {firstVariant && (
                    <p className="text-lg font-bold text-foreground">
                      €{firstVariant.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
