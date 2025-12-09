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

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(3);
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
    return null;
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
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3 mb-10 shrink-0"
                style={{ maxWidth: `${100 / itemsPerView}%` }}
              >
                <Link
                  href={`/products/${relatedProduct.slug || relatedProduct.id}`}
                  className="block bg-card text-card-foreground rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer group"
                >
                  <div className="h-32 bg-muted flex items-center justify-center overflow-hidden relative">
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
