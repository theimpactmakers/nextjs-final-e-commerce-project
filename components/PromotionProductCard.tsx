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

  // Erstelle die URL für das Produkt - mit Variante wenn vorhanden
  const getProductUrl = () => {
    if (!product.slug) return '#';
    
    // Wenn es spezifische Varianten im Angebot gibt, nehme die erste
    if (variantsInPromotion && variantsInPromotion.length > 0) {
      return `/products/${product.slug}?variant=${variantsInPromotion[0].id}`;
    }
    
    return `/products/${product.slug}`;
  };

  const productUrl = getProductUrl();

  return (
    <Link 
      href={productUrl}
      className="w-full max-w-[360px] bg-white rounded-[15px] shadow-[0_5px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative cursor-pointer block"
    >
      {/* HOT SALE Badge */}
      {promotion && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-linear-to-r from-[#a90329] via-[#c44848] to-[#aa2238] text-white px-2.5 py-1.5 text-[13px] font-semibold uppercase tracking-wider rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.2)]">
          -{promotion.discount_value}%
        </div>
      )}

      {/* Image Section */}
      <div className="overflow-hidden">
        <div className="h-[200px] overflow-hidden relative">
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
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        {/* Category */}
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] mb-1.5">
          {product.age_group || product.meat_type || "Premium Hundefutter"}
        </div>
        
        {/* Title */}
        <h2 className="text-[18px] font-bold text-[#18181B] mb-2.5 tracking-tight leading-tight">
          {product.name}
        </h2>
        
        {/* Description */}
        <p className="text-[13px] text-[#52525B] leading-snug mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Features/Tags */}
        <div className="flex gap-1.5 mb-4">
          {product.age_group && (
            <span className="text-[10px] bg-[#F4F4F5] text-[#71717A] px-2 py-1 rounded-md font-medium">
              {product.age_group}
            </span>
          )}
          {product.meat_type && (
            <span className="text-[10px] bg-[#F4F4F5] text-[#71717A] px-2 py-1 rounded-md font-medium">
              {product.meat_type}
            </span>
          )}
          {promotion && (
            <span className="text-[10px] bg-[#F4F4F5] text-[#71717A] px-2 py-1 rounded-md font-medium">
              {promotion.name}
            </span>
          )}
        </div>

        {/* Varianten im Angebot */}
        {variantsInPromotion && variantsInPromotion.length > 0 ? (
          <div className="mt-3 border-t border-[#F4F4F5] pt-3">
            <div className="space-y-2">
              {variantsInPromotion.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-2 bg-linear-to-r  rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white bg-linear-to-r from-[#a90329] to-[#c44848] px-2 py-1 rounded-[8px]">
                      {formatWeight(variant.weight_grams)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#A1A1AA] line-through">
                      €{variant.price.toFixed(2)}
                    </span>
                    <span className="text-[15px] font-bold text-[#a90329]">
                      €{variant.discountedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : promotion && product.min_price ? (
          <div className="mt-3 border-t border-[#F4F4F5] pt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-linear-to-r rounded-md">
                <div className="flex items-center gap-2">

                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A1A1AA] line-through">
                    €{product.min_price.toFixed(2)}
                  </span>
                  <span className="text-[15px] font-bold text-[#a90329]">
                    €
                    {(
                      promotion.discount_type === "percentage"
                        ? product.min_price * (1 - promotion.discount_value / 100)
                        : product.min_price - promotion.discount_value
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        
        {/* Meta Info - Rating & Stock */}
        <div className="flex justify-between items-center border-t border-[#F4F4F5] pt-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span className="ml-1.5 text-[11px] text-[#71717A]">245 Reviews</span>
          </div>
          <div className="text-[11px] font-semibold text-[#22C55E]">
            Auf Lager
          </div>
        </div>
      </div>
    </Link>
  );
}
