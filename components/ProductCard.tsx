"use client";

import { useState } from "react";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];

interface ProductCardProps {
  product: Product;
  images: ProductImage[];
  variants: ProductVariant[];
}

export default function ProductCard({
  product,
  images,
  variants,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  // Sort images by display_order
  const sortedImages = [...images].sort(
    (a, b) => a.display_order - b.display_order
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Calculate discount percentage
  const discountPercentage =
    selectedVariant.compare_at_price && selectedVariant.price
      ? Math.round(
          ((selectedVariant.compare_at_price - selectedVariant.price) /
            selectedVariant.compare_at_price) *
            100
        )
      : 0;

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Image Slider */}
      <div className="relative h-64 bg-muted overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEU
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product.is_on_sale && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              SALE
            </span>
          )}
        </div>

        {/* Main Image */}
        {sortedImages.length > 0 ? (
          <>
            <img
              src={sortedImages[currentImageIndex].image_url}
              alt={
                sortedImages[currentImageIndex].alt_text ||
                product.name ||
                "Product"
              }
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Navigation Arrows (only if multiple images) */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {sortedImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-primary w-4"
                          : "bg-background/60 hover:bg-background/80"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Kein Bild verfügbar
          </div>
        )}

        {/* Image Counter */}
        {sortedImages.length > 1 && (
          <div className="absolute top-3 right-3 bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium">
            {currentImageIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-1.5 p-6">
        {/* Category/Type Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          {product.age_group && (
            <span className="bg-muted px-2 py-0.5 rounded">
              {product.age_group}
            </span>
          )}
          {product.meat_type && (
            <span className="bg-muted px-2 py-0.5 rounded">
              {product.meat_type}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold leading-tight tracking-tight line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        )}
      </div>

      {/* Variants & Price */}
      <div className="px-6 pb-6 space-y-3">
        {/* Size Variants */}
        {variants.length > 1 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Größe wählen:
            </label>
            <div className="flex gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex-1 px-3 py-2 rounded-md border-2 text-sm font-medium transition-all ${
                    selectedVariant.id === variant.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Stock Info */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              €{selectedVariant.price?.toFixed(2)}
            </span>
            {selectedVariant.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                €{selectedVariant.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {selectedVariant.stock_quantity !== null && (
            <div className="text-xs">
              {selectedVariant.stock_quantity > 0 ? (
                <span className="text-green-600 font-medium">
                  ✓ Auf Lager ({selectedVariant.stock_quantity} verfügbar)
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  ✗ Nicht verfügbar
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Details
          </Link>
          <button
            disabled={
              !selectedVariant.stock_quantity ||
              selectedVariant.stock_quantity === 0
            }
            className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}
