"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { calculatePromotionDiscount } from "@/lib/supabase/products";
import type { Database } from "@/types";
import { Heart } from "lucide-react";
import Image from "next/image";
import { AddToCartButton } from "./Button";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];

interface ProductCardProps {
  product: Product;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface PromotionData {
  originalPrice: number;
  discountedPrice: number;
  promotion: Database["public"]["Tables"]["promotions"]["Row"];
  discountAmount: number;
  discountType: "percentage" | "fixed_amount";
}

export default function ProductCard({
  product,
  images,
  variants,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(() =>
    variants && variants.length > 0 ? variants[0] : undefined
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [promotionData, setPromotionData] = useState<PromotionData | null>(
    null
  );
  const [selectedWeight, setSelectedWeight] = useState<"3kg" | "6kg" | null>(
    null
  );
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // Sort images by display_order
  const sortedImages = [...images].sort(
    (a, b) => a.display_order - b.display_order
  );

  // Load promotion data when variant changes
  useEffect(() => {
    const loadPromotion = async () => {
      if (!selectedVariant) {
        setPromotionData(null);
        return;
      }
      const promo = await calculatePromotionDiscount(
        product.id,
        selectedVariant.id,
        selectedVariant.price
      );
      setPromotionData(promo);
    };

    loadPromotion();
  }, [selectedVariant, product.id]);

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

  // Calculate discount percentage from compare_at_price
  const variantDiscountPercentage =
    selectedVariant && selectedVariant.compare_at_price && selectedVariant.price
      ? Math.round(
          ((selectedVariant.compare_at_price - selectedVariant.price) /
            selectedVariant.compare_at_price) *
            100
        )
      : 0;

  // Get the final price (promotion takes precedence)
  const finalPrice = promotionData
    ? promotionData.discountedPrice
    : selectedVariant?.price ?? 0;

  const originalPrice = promotionData
    ? promotionData.originalPrice
    : selectedVariant?.compare_at_price || selectedVariant?.price || 0;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (
      !selectedVariant ||
      !selectedVariant.stock_quantity ||
      selectedVariant.stock_quantity === 0
    ) {
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(
        selectedVariant?.id ?? "",
        product.id,
        product.name || "Product",
        selectedVariant?.name || "Default",
        finalPrice,
        sortedImages[0]?.image_url || null,
        selectedVariant?.stock_quantity || 0,
        quantity
      );

      // Toast notification is shown by CartContext
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Image Slider */}
      <div className="relative h-56 bg-muted overflow-hidden">
        {/* Badges + Alter/Fleischsorte */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {promotionData && (
            <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-bold text-center shadow-lg inline-block w-auto">
              <span className="animate-pulse">
                {promotionData.discountType === "percentage"
                  ? `AKTION -${Math.round(promotionData.discountAmount)}%`
                  : `AKTION -€${promotionData.discountAmount.toFixed(2)}`}
              </span>
            </span>
          )}
          {variantDiscountPercentage > 0 && !promotionData && (
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{variantDiscountPercentage}%
            </span>
          )}
          {product.is_on_sale && !promotionData && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              SALE
            </span>
          )}
          {/* Alter und Fleischsorte Badges */}
          <div className="flex gap-1 mt-1">
            {product.age_group && (
              <span className="bg-muted-foreground text-white px-2 rounded text-xs font-medium shadow">
                {product.age_group}
              </span>
            )}
            {product.meat_type && (
              <span className="bg-muted-foreground text-white px-2 rounded text-xs font-medium shadow">
                {product.meat_type}
              </span>
            )}
          </div>
        </div>
        {/* Wishlist Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inWishlist) {
              await removeFromWishlist(product.id);
            } else {
              await addToWishlist(product.id);
            }
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all hover:scale-110 cursor-pointer
            ${inWishlist ? "bg-accent" : "bg-white/90 hover:bg-white"}`}
          title={
            inWishlist
              ? "Von Wunschliste entfernen"
              : "Zur Wunschliste hinzufügen"
          }
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              inWishlist
                ? "fill-white stroke-white"
                : "stroke-accent group-hover:fill-accent/20"
            }`}
            strokeWidth={2}
          />
        </button>
        {/* Main Image */}
        {sortedImages.length > 0 ? (
          <>
            <Image
              src={sortedImages[currentImageIndex].image_url}
              alt={
                sortedImages[currentImageIndex].alt_text ||
                product.name ||
                "Product"
              }
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority={currentImageIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
      </div>
      {/* Product Info */}
      <div className="flex flex-col p-6">
        {/* Product Name & Weight Selection Row */}
        <div className="flex items-start justify-between mb-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight tracking-tight line-clamp-2 min-h-10 mb-0">
              {product.name}
            </h3>
            {/* Category/Type Badges entfernt, jetzt im Bild */}
          </div>
          {/* Weight selection right-aligned */}
          <div className="flex items-center gap-2 ml-4 mt-1">
            <button
              type="button"
              className={`px-2 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
                selectedWeight === "3kg"
                  ? "bg-muted-foreground text-white border-muted-foreground"
                  : "bg-muted text-foreground border-muted hover:bg-muted-foreground hover:text-white"
              }`}
              onClick={() => setSelectedWeight("3kg")}
            >
              3kg
            </button>
            <button
              type="button"
              className={`px-2 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
                selectedWeight === "6kg"
                  ? "bg-muted-foreground text-white border-muted-foreground"
                  : "bg-muted text-foreground border-muted hover:bg-muted-foreground hover:text-white"
              }`}
              onClick={() => setSelectedWeight("6kg")}
            >
              6kg
            </button>
          </div>
        </div>
        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
            {product.description}
          </p>
        )}
        {/* Details Link: below description, left-aligned */}
        <div className="mt-2 mb-4 flex justify-start">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="text-accent font-medium text-sm underline hover:no-underline flex items-center gap-1 transition-all"
          >
            Zum Produkt
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        {variants && variants.length > 1 && selectedVariant && (
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
                    selectedVariant?.id === variant.id
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
        <div className="space-y-2 mb-2">
          <div className="flex items-baseline w-full justify-between">
            {/* Price/Promotion left-aligned, strikethrough price right of current (no promotion name badge here) */}
            <div className="flex flex-col items-start">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-black">
                  {selectedWeight === "3kg"
                    ? `€${(finalPrice * 1).toFixed(2)}`
                    : selectedWeight === "6kg"
                    ? `€${(finalPrice * 2).toFixed(2)}`
                    : `€${finalPrice?.toFixed(2)}`}
                </span>
                {originalPrice !== finalPrice && (
                  <span className="text-sm text-red-300 line-through">
                    {selectedWeight === "3kg"
                      ? `€${(originalPrice * 1).toFixed(2)}`
                      : selectedWeight === "6kg"
                      ? `€${(originalPrice * 2).toFixed(2)}`
                      : `€${originalPrice.toFixed(2)}`}
                  </span>
                )}
              </div>
            </div>
            {/* Quantity Input right-aligned */}
            <div className="flex items-center ml-auto">
              <button
                type="button"
                aria-label="Menge verringern"
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 bg-white text-accent cursor-pointer transition-colors hover:bg-accent hover:text-white disabled:opacity-50"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <span className="font-bold select-none">-</span>
              </button>
              <input
                type="number"
                min={1}
                max={selectedVariant?.stock_quantity || 99}
                value={quantity}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 1) val = 1;
                  if (
                    selectedVariant?.stock_quantity &&
                    val > selectedVariant.stock_quantity
                  )
                    val = selectedVariant.stock_quantity;
                  setQuantity(val);
                }}
                className="w-10 h-6 mx-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none hide-number-spin"
              />
              <button
                type="button"
                aria-label="Menge erhöhen"
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 bg-white text-accent cursor-pointer transition-colors hover:bg-accent hover:text-white disabled:opacity-50"
                onClick={() =>
                  setQuantity((q) =>
                    selectedVariant?.stock_quantity
                      ? Math.min(q + 1, selectedVariant.stock_quantity)
                      : q + 1
                  )
                }
                disabled={
                  selectedVariant?.stock_quantity
                    ? quantity >= selectedVariant.stock_quantity
                    : false
                }
              >
                <span className="font-bold select-none">+</span>
              </button>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <AddToCartButton
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              !selectedVariant.stock_quantity ||
              selectedVariant.stock_quantity === 0 ||
              isAddingToCart
            }
            isLoading={isAddingToCart}
          />
        </div>
        {/* Stock Status below cart button, centered (only here!) */}
        <div className="w-full flex justify-center mt-2">
          <div className="text-xs text-center">
            {selectedVariant &&
            typeof selectedVariant.stock_quantity === "number" ? (
              selectedVariant.stock_quantity > 0 ? (
                <span className="text-primary font-medium">
                  ✓ Auf Lager ({selectedVariant.stock_quantity} verfügbar)
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  ✗ Nicht verfügbar
                </span>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
