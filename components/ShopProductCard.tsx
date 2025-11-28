"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { calculatePromotionDiscount } from "@/lib/supabase/products";
import type { Database } from "@/types";

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

interface ShopProductCardProps {
  product: ProductWithImage;
}

interface PromotionData {
  originalPrice: number;
  discountedPrice: number;
  promotion: Database["public"]["Tables"]["promotions"]["Row"];
  discountAmount: number;
  discountType: "percentage" | "fixed_amount";
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = product.id ? isInWishlist(product.id) : false;
  const [promotionData, setPromotionData] = useState<PromotionData | null>(null);
  const [loadingPromotion, setLoadingPromotion] = useState(true);

  // Load promotion data
  useEffect(() => {
    const loadPromotion = async () => {
      if (!product.id) return;
      setLoadingPromotion(true);
      // Use min_price for promotion calculation
      const basePrice = product.min_price || 0;
      const promo = await calculatePromotionDiscount(
        product.id,
        `${product.id}_primary`,
        basePrice
      );
      setPromotionData(promo);
      setLoadingPromotion(false);
    };

    loadPromotion();
  }, [product.id, product.min_price]);

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        {/* Promotion Badge */}
        {promotionData && (
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              {promotionData.discountType === "percentage"
                ? `AKTION -${Math.round(promotionData.discountAmount)}%`
                : `AKTION -€${promotionData.discountAmount.toFixed(2)}`}
            </span>
          </div>
        )}

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
        
        {/* Price Display */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-primary">
            €{promotionData ? promotionData.discountedPrice.toFixed(2) : product.min_price?.toFixed(2) || "0.00"}
          </span>
          {promotionData && promotionData.originalPrice !== promotionData.discountedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{promotionData.originalPrice.toFixed(2)}
            </span>
          )}
          {promotionData && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
              {promotionData.promotion.name}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 space-y-2">
        <div className="flex justify-between items-center">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Zum Produkt
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Fleischsorte: {product.meat_type} / Altersgruppe: {product.age_group}
        </p>
      </div>
    </div>
  );
}
