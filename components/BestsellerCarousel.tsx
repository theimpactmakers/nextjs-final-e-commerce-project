"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

// Typen für die Produktdaten
type ProductWithImage = {
  id: string | null;
  name: string | null;
  description: string | null;
  price: number | null;
  slug: string | null;
  meat_type: string | null;
  age_group: string | null;
  primary_image_url: string | null;
  primary_image_alt: string | null;
  [key: string]: unknown; // Allow additional properties from the view
};

type BestsellerCarouselProps = {
  products: ProductWithImage[];
};

// Chevron Icons
const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const BestsellerCarousel: React.FC<BestsellerCarouselProps> = ({
  products,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Responsive: Anzahl der sichtbaren Items pro Breakpoint
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4); // lg: 4 items
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2); // sm: 2 items
      } else {
        setItemsPerView(1); // mobile: 1 item
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalItems = products.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Produkte verfügbar
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="overflow-hidden mx-12 md:mx-16">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <Link
                href={`/products/${p.slug}`}
                className="block bg-card text-card-foreground rounded-lg border shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer"
              >
                <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={p.primary_image_url || "/images/placeholder.jpg"}
                    alt={p.primary_image_alt || p.name || "Product image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-1 p-3">
                  <h3 className="text-base font-semibold leading-tight line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {p.description}
                  </p>
                </div>
                <div className="px-3 pb-3 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-destructive">
                      {p.price} €
                    </span>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!p.id || isAddingToCart === p.id) return;

                        setIsAddingToCart(p.id);
                        try {
                          // Fetch the default variant for this product
                          const { createClient } = await import(
                            "@/lib/supabase/client"
                          );
                          const supabase = createClient();

                          const { data: variants } = await supabase
                            .from("product_variants")
                            .select("id, name, price, stock_quantity")
                            .eq("product_id", p.id)
                            .eq("is_active", true)
                            .limit(1);

                          if (variants && variants.length > 0) {
                            const variant = variants[0];
                            await addToCart(
                              variant.id,
                              p.id,
                              p.name || "Product",
                              variant.name || "Default",
                              variant.price || p.price || 0,
                              p.primary_image_url,
                              variant.stock_quantity || 0,
                              1
                            );
                          }
                        } catch (error) {
                          console.error("Error adding to cart:", error);
                        } finally {
                          setIsAddingToCart(null);
                        }
                      }}
                      disabled={isAddingToCart === p.id}
                      className="relative p-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="In den Warenkorb"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute bottom-1 right-1"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalItems > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous products"
            className="absolute top-1/2 left-0 transform -translate-y-1/2 p-3 text-foreground hover:opacity-70 transition-all cursor-pointer z-10"
          >
            <ChevronLeft className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next products"
            className="absolute top-1/2 right-0 transform -translate-y-1/2 p-3 text-foreground hover:opacity-70 transition-all cursor-pointer z-10"
          >
            <ChevronRight className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {totalItems > itemsPerView && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 md:w-2.5 md:h-2.5 lg:w-2 lg:h-2 rounded-full transition-colors duration-300 ${
                index === currentIndex
                  ? "bg-accent shadow-md"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
