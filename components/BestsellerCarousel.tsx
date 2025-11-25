"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Typen für die Produktdaten
type ProductWithImage = {
  id: string | null;
  name: string | null;
  description: string | null;
  min_price: number | null;
  starting_variant_name: string | null;
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
      <div className="py-4 pb-8 overflow-hidden">
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
                <div className="h-32 bg-muted flex items-center justify-center overflow-hidden relative">
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
                        className="w-12 h-12 text-gray-400"
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
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-semibold leading-tight line-clamp-1 text-foreground group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-foreground">
                        ab {p.min_price ? Number(p.min_price).toFixed(2) : "N/A"} €
                      </span>
                      {p.starting_variant_name && (
                        <span className="text-[10px] text-muted-foreground">
                          {p.starting_variant_name}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-accent flex items-center gap-0.5 underline hover:no-underline group-hover:translate-x-1 transition-transform">
                      Produktdetails
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
          <ChevronLeft className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next products"
          className="absolute top-1/2 right-0 transform -translate-y-1/2 p-3 text-foreground hover:opacity-70 transition-all cursor-pointer z-10"
        >
          <ChevronRight className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10" />
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
