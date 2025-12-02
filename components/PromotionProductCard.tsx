"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Database } from "@/types";

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

type Promotion = Database["public"]["Tables"]["promotions"]["Row"];

interface PromotionProductCardProps {
  product: ProductWithImage & {
    promotionDetails?: {
      promotion: Promotion;
      variantsInPromotion?: Array<{
        id: string;
        name: string;
        weight_grams: number;
        price: number;
        discountedPrice: number;
      }>;
    };
  };
}

export default function PromotionProductCard({
  product,
}: PromotionProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = product.id ? isInWishlist(product.id) : false;
  const [showVariants, setShowVariants] = useState(false);

  const promotion = product.promotionDetails?.promotion;
  const variantsInPromotion = product.promotionDetails?.variantsInPromotion;

  // Formatiere Gewicht
  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams}g`;
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
      {/* Großer Promotion-Banner */}
      {promotion && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white px-4 py-2 rounded-bl-2xl shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Angebot
            </div>
            <div className="text-2xl font-bold leading-tight">
              {promotion.discount_type === "percentage"
                ? `-${Math.round(promotion.discount_value)}%`
                : `-€${promotion.discount_value.toFixed(2)}`}
            </div>
          </div>
        </div>
      )}

      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        {/* Wishlist Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (product.id) {
              if (inWishlist) {
                await removeFromWishlist(product.id);
              } else {
                await addToWishlist(product.id);
              }
            }
          }}
          className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110"
          title={
            inWishlist
              ? "Von Wunschliste entfernen"
              : "Zur Wunschliste hinzufügen"
          }
        >
          <svg
            className={`h-5 w-5 transition-colors ${
              inWishlist
                ? "fill-red-500 stroke-red-500"
                : "fill-none stroke-gray-600"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <img
          src={product.primary_image_url || "/images/placeholder.jpg"}
          alt={product.primary_image_alt || product.name || "Product image"}
          className="w-full h-full object-cover"
        />

        {/* Badges für Kategorien */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          {product.age_group && (
            <span className="bg-accent/90 text-white text-xs px-2 py-1 rounded-full">
              {product.age_group}
            </span>
          )}
          {product.meat_type && (
            <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
              {product.meat_type}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Promotion Name */}
        {promotion && (
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {promotion.name}
            </span>
          </div>
        )}

        {/* Varianten im Angebot */}
        {variantsInPromotion && variantsInPromotion.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <button
              onClick={() => setShowVariants(!showVariants)}
              className="flex items-center justify-between w-full text-sm font-medium text-left group"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Angebots-Varianten ({variantsInPromotion.length})
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  showVariants ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showVariants && (
              <div className="mt-3 space-y-2">
                {variantsInPromotion.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded">
                        {formatWeight(variant.weight_grams)}
                      </span>
                      <span className="text-sm text-gray-700">
                        {variant.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 line-through">
                        €{variant.price.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        €{variant.discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Preis-Display für "all" oder "specific_products" Promotions */}
        {promotion && !variantsInPromotion && product.min_price && (
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-red-600">
              ab €
              {(
                promotion.discount_type === "percentage"
                  ? product.min_price * (1 - promotion.discount_value / 100)
                  : product.min_price - promotion.discount_value
              ).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              €{product.min_price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 pt-0 space-y-2">
        <div className="flex justify-between items-center">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Jetzt im Angebot sichern →
          </Link>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {promotion?.description || "Limitiertes Angebot - Nur solange Vorrat reicht"}
        </p>
      </div>
    </div>
  );
}
