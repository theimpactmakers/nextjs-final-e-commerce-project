"use client";

import { useEffect, useState, useRef } from "react";
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
  // Alle Hooks am Anfang!
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      const supabase = createClient();

      try {
        // Step 1: Get related product IDs (single query)
        const { data: relatedIds, error: idsError } = await supabase
          .from("related_products")
          .select("related_product_id, display_order")
          .eq("product_id", productId)
          .order("display_order", { ascending: true })
          .limit(limit);

        if (idsError) throw idsError;

        if (!relatedIds || relatedIds.length === 0) {
          console.log("No related products found for:", productId);
          setRelatedProducts([]);
          return;
        }
        console.log("Found related products:", relatedIds.length);
        const productIds = relatedIds.map((r) => r.related_product_id);

        // Step 2: Batch fetch all data in parallel (3 optimized queries)
        const [productsResult, imagesResult, variantsResult] =
          await Promise.all([
            // Fetch products
            supabase
              .from("products")
              .select("id, name, slug, description")
              .in("id", productIds),

            // Fetch only primary images
            supabase
              .from("product_images")
              .select("product_id, image_url, alt_text, is_primary")
              .in("product_id", productIds)
              .eq("is_primary", true),

            // Fetch only first variant per product (cheapest)
            supabase
              .from("product_variants")
              .select(
                "product_id, id, name, price, compare_at_price, stock_quantity"
              )
              .in("product_id", productIds)
              .eq("is_active", true)
              .order("price", { ascending: true }),
          ]);

        if (productsResult.error) throw productsResult.error;
        if (imagesResult.error) throw imagesResult.error;
        if (variantsResult.error) throw variantsResult.error;

        // Step 3: Efficiently combine data client-side
        const productsMap = new Map(
          productsResult.data?.map((p) => [p.id, p]) || []
        );
        const imagesMap = new Map(
          imagesResult.data?.map((img) => [img.product_id, img]) || []
        );
        const variantsMap = new Map<string, typeof variantsResult.data>();

        variantsResult.data?.forEach((v) => {
          if (!variantsMap.has(v.product_id)) {
            variantsMap.set(v.product_id, []);
          }
          variantsMap.get(v.product_id)?.push(v);
        });

        // Step 4: Build products in original display_order
        const products = relatedIds
          .map((rel) => {
            const product = productsMap.get(rel.related_product_id);
            if (!product) return null;

            const image = imagesMap.get(product.id);
            const variants = variantsMap.get(product.id) || [];

            return {
              ...product,
              product_images: image ? [image] : [],
              product_variants: variants,
            } as RelatedProduct;
          })
          .filter((p): p is RelatedProduct => p !== null);

        console.log("Built products:", products.length);
        setRelatedProducts(products);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, limit]);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3); // Show 3 on tablets instead of 2
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-accent">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    // Show section title but indicate no products available
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-accent">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Derzeit keine ähnlichen Produkte verfügbar.</p>
        </div>
      </div>
    );
  }

  const maxIndex = Math.max(0, relatedProducts.length - itemsPerView);
  const showArrows = relatedProducts.length > itemsPerView;

  const goTo = (idx: number) => {
    setCurrentIndex(Math.max(0, Math.min(idx, maxIndex)));
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-accent">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative">
        {showArrows && (
          <>
            {/* Linker Pfeil */}
            <button
              onClick={prev}
              aria-label="Vorherige Produkte"
              className="hidden md:flex items-center justify-center absolute -left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-accent rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ transform: "translateY(-50%)" }}
              disabled={currentIndex === 0}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className=""
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            {/* Rechter Pfeil */}
            <button
              onClick={next}
              aria-label="Nächste Produkte"
              className="hidden md:flex items-center justify-center absolute -right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-accent rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ transform: "translateY(-50%)" }}
              disabled={currentIndex === maxIndex}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className=""
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / itemsPerView) * currentIndex}%)`,
          }}
        >
          {relatedProducts.map((relatedProduct) => {
            const primaryImage = relatedProduct.product_images?.find(
              (img) => img.is_primary
            );
            const firstVariant = relatedProduct.product_variants?.[0];
            return (
              <div
                key={relatedProduct.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 sm:px-3 mb-6 sm:mb-10 shrink-0"
                style={{ maxWidth: `${100 / itemsPerView}%` }}
              >
                <Link
                  href={`/products/${relatedProduct.slug || relatedProduct.id}`}
                  className="block bg-card text-card-foreground rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer group"
                >
                  <div className="h-32 sm:h-40 md:h-48 bg-muted flex items-center justify-center overflow-hidden relative">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url}
                        alt={primaryImage.alt_text || relatedProduct.name || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Kein Bild
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold leading-tight line-clamp-1 text-foreground group-hover:text-accent transition-colors">
                      {relatedProduct.name}
                    </h3>
                    {relatedProduct.product_variants &&
                      relatedProduct.product_variants.length > 1 && (
                        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                          {relatedProduct.product_variants.map((variant) => (
                            <span
                              key={variant.id}
                              className="bg-muted px-2 py-0.5 rounded"
                            >
                              {variant.name}
                            </span>
                          ))}
                        </div>
                      )}
                    <div className="flex flex-col items-end gap-1">
                      {firstVariant && (
                        <span className="text-base mr-1 font-bold text-foreground flex items-center gap-2">
                          {firstVariant.compare_at_price &&
                            firstVariant.compare_at_price >
                              firstVariant.price && (
                              <span className="line-through text-red-400 text-sm font-normal">
                                €{firstVariant.compare_at_price.toFixed(2)}
                              </span>
                            )}
                          <span>€{firstVariant.price.toFixed(2)}</span>
                        </span>
                      )}
                      <span className="text-xs text-accent flex items-center gap-0.5 underline hover:no-underline group-hover:translate-x-1 transition-transform">
                        Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-foreground"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        {/* Pagination Dots */}
        {showArrows && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Gehe zu Seite ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex
                    ? "bg-accent shadow-md"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
