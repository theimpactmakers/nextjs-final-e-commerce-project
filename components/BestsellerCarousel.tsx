"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

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
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const { addToCart } = useCart();

  // Responsive: Adjust items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4); // lg: 4 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3); // md: 3 items
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
  const stepSize = 1; // Jump 1 product at a time for smoother experience
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + stepSize;
      return nextIndex > maxIndex ? 0 : nextIndex;
    });
  }, [maxIndex, stepSize]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - stepSize;
      return nextIndex < 0 ? maxIndex : nextIndex;
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Produkte verfügbar
      </div>
    );
  }

  return (
    <div className="relative w-full px-12 md:px-16">
      {/* Carousel Container */}
      <div className="py-4 overflow-hidden">
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
                className="block bg-card text-card-foreground rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer group"
              >
                <div className="h-40 bg-muted flex items-center justify-center overflow-hidden relative">
                  {p.primary_image_url &&
                  p.primary_image_url !== "/images/placeholder.jpg" ? (
                    <Image
                      src={p.primary_image_url}
                      alt={p.primary_image_alt || p.name || "Product image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex-1 space-y-2 mb-3">
                    <h3 className="text-base font-semibold leading-tight line-clamp-2 text-foreground hover:underline hover:decoration-2 active:text-primary transition-all">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-foreground">
                        {p.price} €
                      </span>
                      <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5 underline hover:no-underline hover:text-foreground active:text-foreground active:underline cursor-pointer">
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
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 group/cart">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/cart:opacity-100 transition-all">
                        {/* Minus Button - visible on hover */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!p.id) return;
                            setQuantity((prev) => ({
                              ...prev,
                              [p.id!]: Math.max(1, (prev[p.id!] || 1) - 1),
                            }));
                          }}
                          className="p-1.5 rounded-md bg-muted text-accent hover:bg-accent/90 hover:text-white cursor-pointer transition-colors"
                          aria-label="Menge verringern"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>

                        {/* Quantity Display - visible on hover */}
                        <span className="text-sm font-semibold text-foreground min-w-6 text-center">
                          {quantity[p.id!] || 1}
                        </span>

                        {/* Plus Button - visible on hover */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!p.id) return;
                            setQuantity((prev) => ({
                              ...prev,
                              [p.id!]: Math.min(99, (prev[p.id!] || 1) + 1),
                            }));
                          }}
                          className="p-1.5 rounded-md bg-muted text-accent hover:bg-accent/90 hover:text-white cursor-pointer transition-colors"
                          aria-label="Menge erhöhen"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Cart Button */}
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
                              const qty = quantity[p.id!] || 1;
                              await addToCart(
                                variant.id,
                                p.id,
                                p.name || "Product",
                                variant.name || "Default",
                                variant.price || p.price || 0,
                                p.primary_image_url,
                                variant.stock_quantity || 0,
                                qty
                              );
                              // Reset quantity after adding to cart
                              setQuantity((prev) => ({
                                ...prev,
                                [p.id!]: 1,
                              }));
                            }
                          } catch (error) {
                            console.error("Error adding to cart:", error);
                          } finally {
                            setIsAddingToCart(null);
                          }
                        }}
                        disabled={isAddingToCart === p.id}
                        className={`relative p-2.5 rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/cartbtn ${
                          isAddingToCart === p.id
                            ? "bg-accent/20 text-accent animate-pulse"
                            : "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-md active:scale-95"
                        }`}
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
                          className="transition-all"
                        >
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
                        </svg>
                        {/* Plus icon - visible on hover */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="absolute -top-1 -right-1 opacity-0 group-hover/cartbtn:opacity-100 transition-all bg-accent rounded-full p-0.5"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
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

      {/* Pagination Dots */}
      {maxIndex > 0 && (
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
