"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { calculatePromotionDiscount } from "@/lib/supabase/products";
import type { Database } from "@/types";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

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
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  ); // Start with no variant selected
  const selectedVariant = variants?.find((v) => v.id === selectedVariantId);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartClicked, setCartClicked] = useState(false);
  const [showCartPlus, setShowCartPlus] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [promotionData, setPromotionData] = useState<PromotionData | null>(
    null
  );
  const [multipleVariantsInPromo, setMultipleVariantsInPromo] = useState<{
    hasMultiple: boolean;
    maxDiscount: number;
  } | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<"3kg" | "6kg" | null>(
    null
  );
  const [manualImageChange, setManualImageChange] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // Sort images by display_order
  const sortedImages = [...images].sort(
    (a, b) => a.display_order - b.display_order
  );

  // Auto-select variant based on promotion logic
  useEffect(() => {
    if (selectedVariantId || !variants || variants.length === 0) return;

    const checkPromotions = async () => {
      // Check which variants have promotions
      const variantPromotions = await Promise.all(
        variants.map(async (v) => {
          const promo = await calculatePromotionDiscount(
            product.id,
            v.id,
            v.price
          );
          return { variant: v, promo };
        })
      );

      const variantsWithPromo = variantPromotions.filter((vp) => vp.promo);

      // If exactly ONE variant has a promotion, auto-select it
      if (variantsWithPromo.length === 1) {
        const variantToSelect = variantsWithPromo[0].variant;
        setSelectedVariantId(variantToSelect.id);
        // Extract weight from variant name
        const weightMatch = variantToSelect.name?.match(/(\d+)kg/i);
        if (weightMatch) {
          const weight = weightMatch[1];
          if (weight === "3" || weight === "6") {
            setSelectedWeight(`${weight}kg` as "3kg" | "6kg");
          }
        }
      }
      // If MULTIPLE variants have promotions, store the max discount for badge
      else if (variantsWithPromo.length > 1) {
        const maxDiscount = Math.max(
          ...variantsWithPromo.map((vp) =>
            vp.promo!.discountType === "percentage"
              ? vp.promo!.discountAmount
              : 0
          )
        );
        setMultipleVariantsInPromo({ hasMultiple: true, maxDiscount });
      }
    };

    checkPromotions();
  }, []); // Only run on mount

  // Switch image based on weight selection (only if user hasn't manually navigated)
  useEffect(() => {
    if (manualImageChange) return; // Don't auto-switch if user manually changed image

    if (selectedWeight === "3kg") {
      // Find image with display_order 1 for 3kg
      const image3kg = sortedImages.findIndex((img) => img.display_order === 1);
      if (image3kg !== -1) {
        setCurrentImageIndex(image3kg);
      }
      // If no 3kg-specific image exists, stay on current image (graceful fallback)
    } else if (selectedWeight === "6kg") {
      // Find image with display_order 2 for 6kg
      const image6kg = sortedImages.findIndex((img) => img.display_order === 2);
      if (image6kg !== -1) {
        setCurrentImageIndex(image6kg);
      }
      // If no 6kg-specific image exists, stay on current image (graceful fallback)
    } else {
      // Default: show image with display_order 0
      const imageDefault = sortedImages.findIndex(
        (img) => img.display_order === 0
      );
      if (imageDefault !== -1) {
        setCurrentImageIndex(imageDefault);
      } else {
        setCurrentImageIndex(0);
      }
    }
  }, [selectedWeight, sortedImages, manualImageChange]);

  // Load promotion data when variant changes
  useEffect(() => {
    const loadPromotion = async () => {
      if (!selectedVariant) {
        setPromotionData(null);
        return;
      }
      // When user selects a variant, hide the multiple variants badge
      setMultipleVariantsInPromo(null);

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
    setManualImageChange(true);
    setCurrentImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setManualImageChange(true);
    setCurrentImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setManualImageChange(true);
    setCurrentImageIndex(index);
    // Auto-select variant based on image display_order
    const image = sortedImages[index];
    if (image) {
      if (image.display_order === 1) {
        const variant3kg = variants.find((v) => v.weight_grams === 3000);
        if (variant3kg) {
          setSelectedVariantId(variant3kg.id);
          setSelectedWeight("3kg");
        }
      } else if (image.display_order === 2) {
        const variant6kg = variants.find((v) => v.weight_grams === 6000);
        if (variant6kg) {
          setSelectedVariantId(variant6kg.id);
          setSelectedWeight("6kg");
        }
      } else if (image.display_order === 0) {
        // Default image - clear selection
        setSelectedWeight(null);
        setSelectedVariantId(null);
      }
    }
  };

  // Get the lowest variant price for "ab" display
  const lowestVariantPrice =
    variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

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
  const finalPrice = selectedVariant
    ? promotionData
      ? promotionData.discountedPrice
      : selectedVariant.price
    : lowestVariantPrice;

  const originalPrice = selectedVariant
    ? promotionData
      ? promotionData.originalPrice
      : selectedVariant.compare_at_price || selectedVariant.price
    : 0;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (
      !selectedVariant ||
      !selectedVariant.stock_quantity ||
      selectedVariant.stock_quantity === 0
    ) {
      return;
    }

    setCartClicked(true);
    setShowCartPlus(true);
    setIsAddingToCart(true);
    try {
      // Ensure quantity is always a number
      const safeQuantity =
        typeof quantity === "string" ? parseInt(quantity, 10) : quantity;
      await addToCart(
        selectedVariant?.id ?? "",
        product.id,
        product.name || "Product",
        selectedVariant?.name || "Default",
        finalPrice,
        sortedImages[0]?.image_url || null,
        selectedVariant?.stock_quantity || 0,
        safeQuantity
      );

      // Toast notification is shown by CartContext
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb");
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setCartClicked(false), 250);
      setTimeout(() => setShowCartPlus(false), 350);
    }
  };

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="block group focus:outline-none"
      tabIndex={0}
      prefetch={false}
    >
      <div className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
        {/* Image Slider */}
        <div className="relative h-56 bg-muted overflow-hidden">
          {/* Badges + Alter/Fleischsorte */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {promotionData && (
              <span
                className={`${
                  Math.round(promotionData.discountAmount) === 10
                    ? "bg-muted-foreground"
                    : "bg-[#a90329]"
                } text-white px-2 py-1 rounded text-xs font-bold text-center shadow-lg inline-block w-auto`}
              >
                <span className="animate-pulse">
                  {promotionData.discountType === "percentage"
                    ? `AKTION -${Math.round(promotionData.discountAmount)}%`
                    : `AKTION -€${promotionData.discountAmount.toFixed(2)}`}
                </span>
              </span>
            )}
            {!promotionData && multipleVariantsInPromo?.hasMultiple && (
              <span
                className={`${
                  Math.round(multipleVariantsInPromo.maxDiscount) === 10
                    ? "bg-muted-foreground"
                    : "bg-[#a90329]"
                } text-white px-2 py-1 rounded text-xs font-bold text-center shadow-lg inline-block w-auto`}
              >
                <span className="animate-pulse">
                  AKTION -{Math.round(multipleVariantsInPromo.maxDiscount)}%
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
              {/* Age group badge removed, now shown above name */}
              {product.meat_type && (
                <span className="bg-muted-foreground/70 text-white px-2 rounded text-xs font-medium shadow">
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 transition-colors duration-150 group-hover:stroke-accent"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                    aria-label="Next image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 transition-colors duration-150 group-hover:stroke-accent"
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
                            ? "bg-accent w-4"
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
        <div className="flex flex-col p-6 pb-4">
          {/* Age group above product name, smaller */}
          {product.age_group && (
            <span className="text-sm text-muted-foreground font-normal mb-1">
              {product.age_group}
            </span>
          )}
          {/* Product Name & Weight Selection Row */}
          <div className="flex items-start justify-between mb-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold leading-tight tracking-tight line-clamp-2 min-h-10 mb-1">
                <span className="transition-colors duration-200 group-hover:text-accent hover:text-black hover:underline">
                  {product.name}
                </span>
              </h3>
              {/* Category/Type Badges entfernt, jetzt im Bild */}
            </div>
          </div>
          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
              {product.description}
            </p>
          )}
          {/* Details Link: below description, left-aligned */}
          <div className="mt-2 mb-2 flex items-center justify-between w-full">
            <div className="relative w-full">
              <span className="text-accent font-medium text-sm underline hover:no-underline flex items-center gap-1 transition-all">
                Produktdetails
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
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={
                  !selectedVariant ||
                  !selectedVariant.stock_quantity ||
                  selectedVariant.stock_quantity === 0 ||
                  isAddingToCart
                }
                className={`absolute right-0 top-11 rounded-full p-2 flex items-center justify-center shadow-lg transition-all disabled:cursor-not-allowed ${
                  !selectedVariant
                    ? "bg-white border-2 border-accent cursor-pointer"
                    : cartClicked
                    ? "border-2 border-accent bg-white hover:scale-105 cursor-pointer shadow-accent/30"
                    : "bg-accent border-2 border-transparent hover:scale-105 cursor-pointer shadow-accent/30"
                }`}
                aria-label="In den Warenkorb"
                style={{ marginBottom: 0 }}
              >
                <span className="relative inline-block group">
                  <ShoppingCart
                    className={`w-5 h-5 transition-colors ${
                      !selectedVariant
                        ? "text-accent"
                        : cartClicked
                        ? "text-accent"
                        : "text-white"
                    }`}
                  />
                  {/* Show black + when clicked, white + on hover */}
                  {showCartPlus && (
                    <span className="absolute -top-4 -right-1 bg-transparent text-black text-base font-normal select-none pointer-events-none">
                      +
                    </span>
                  )}
                  <span className="absolute -top-4 -right-1 bg-transparent text-white text-lg select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    +
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Action Row: Gewicht links, Warenkorb rechts */}
          <div className="flex items-center gap-2 pt-2 mb-4">
            <span className="text-sm text-black font-medium mr-1 mb-3 mt-4 inline-block">
              Varianten:
            </span>
            <button
              type="button"
              className={`px-3 py-1.5 rounded border text-sm font-semibold transition-colors cursor-pointer ${
                selectedWeight === "3kg"
                  ? "bg-muted-foreground text-white border-muted-foreground"
                  : "bg-muted text-foreground border-muted-foreground hover:bg-muted-foreground hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setManualImageChange(false); // Allow auto-switch when variant selected
                setSelectedWeight("3kg");
                // Find the 3kg variant
                const variant3kg = variants.find(
                  (v) => v.name.includes("3kg") || v.weight_grams === 3000
                );
                if (variant3kg) setSelectedVariantId(variant3kg.id);
              }}
            >
              3kg
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded border text-sm font-semibold transition-colors cursor-pointer ${
                selectedWeight === "6kg"
                  ? "bg-muted-foreground text-white border-muted-foreground"
                  : "bg-muted text-foreground border-muted-foreground hover:bg-muted-foreground hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setManualImageChange(false); // Allow auto-switch when variant selected
                setSelectedWeight("6kg");
                // Find the 6kg variant
                const variant6kg = variants.find(
                  (v) => v.name.includes("6kg") || v.weight_grams === 6000
                );
                if (variant6kg) setSelectedVariantId(variant6kg.id);
              }}
            >
              6kg
            </button>
          </div>
          {/* Price & Quantity Row at the bottom: Quantity left, Price right */}
          <div className="flex items-end w-full justify-between mt-2">
            {/* Quantity controls left */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Menge verringern"
                className="w-8 h-9 text-lg flex items-center justify-center rounded border border-black bg-white text-accent cursor-pointer transition-colors hover:bg-accent hover:text-white hover:border-accent disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
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
                  e.preventDefault();
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 1) val = 1;
                  if (
                    selectedVariant?.stock_quantity &&
                    val > selectedVariant.stock_quantity
                  )
                    val = selectedVariant.stock_quantity;
                  setQuantity(val);
                }}
                className="w-12 h-9 text-lg text-center border border-black rounded font-semibold focus:outline-none focus:border-accent transition-all hide-number-spin"
              />
              <button
                type="button"
                aria-label="Menge erhöhen"
                className="w-8 h-9 text-lg flex items-center justify-center rounded border border-black bg-white text-accent cursor-pointer transition-colors hover:border-accent hover:bg-accent hover:text-white disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity((q) =>
                    selectedVariant?.stock_quantity
                      ? Math.min(q + 1, selectedVariant.stock_quantity)
                      : q + 1
                  );
                }}
                disabled={
                  selectedVariant?.stock_quantity
                    ? quantity >= selectedVariant.stock_quantity
                    : false
                }
              >
                <span className="font-bold select-none">+</span>
              </button>
            </div>
            {/* Price right */}
            <div className="flex flex-col items-end gap-1">
              {selectedVariant && originalPrice > finalPrice && (
                <span className="text-sm text-black line-through">
                  €{originalPrice.toFixed(2)}
                </span>
              )}
              <div className="flex items-end gap-2">
                {!selectedVariant && (
                  <span
                    className={`text-lg font-bold mr-1 -mt-2 mb-.5 align-baseline text-black`}
                  >
                    ab
                  </span>
                )}
                <span
                  className={`text-lg font-bold ${
                    product.is_on_sale || promotionData
                      ? "text-red-700"
                      : "text-black"
                  }`}
                >
                  €{finalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* Stock Status below cart button, centered (only here!) */}
          <div className="w-full flex justify-center mt-2 mb-0">
            <div className="text-xs text-center">
              {selectedVariant &&
              typeof selectedVariant.stock_quantity === "number" ? (
                selectedVariant.stock_quantity > 0 &&
                selectedVariant.stock_quantity < 5 ? (
                  <span className="text-primary font-medium">
                    ✓ Auf Lager ({selectedVariant.stock_quantity} verfügbar)
                  </span>
                ) : selectedVariant.stock_quantity === 0 ? (
                  <span className="text-destructive font-medium">
                    ✗ Nicht verfügbar
                  </span>
                ) : null
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
