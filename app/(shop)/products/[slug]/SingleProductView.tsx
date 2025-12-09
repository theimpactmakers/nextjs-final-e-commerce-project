"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewContext";
import { calculatePromotionDiscount } from "@/lib/supabase/products";
import RelatedProducts from "@/components/RelatedProducts";
import ReviewStats from "@/components/ReviewStats";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import {
  AddToCartButton,
  BuyNowButton,
  AddToWishlistButton,
} from "@/components/Button";
import type { Database } from "@/types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_images: Database["public"]["Tables"]["product_images"]["Row"][];
  product_variants: Database["public"]["Tables"]["product_variants"]["Row"][];
  product_ingredients: (Database["public"]["Tables"]["product_ingredients"]["Row"] & {
    ingredients: Database["public"]["Tables"]["ingredients"]["Row"];
  })[];
  feeding_guidelines: Database["public"]["Tables"]["feeding_guidelines"]["Row"][];
};

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
};

interface SingleProductViewProps {
  product: Product;
  reviews: Review[];
  reviewStats: ReviewStats;
}

interface PromotionData {
  originalPrice: number;
  discountedPrice: number;
  promotion: Database["public"]["Tables"]["promotions"]["Row"];
  discountAmount: number;
  discountType: "percentage" | "fixed_amount";
}

export default function SingleProductView({
  product,
  reviews: initialReviews,
  reviewStats,
}: SingleProductViewProps) {
  const searchParams = useSearchParams();
  const variantIdFromUrl = searchParams.get("variant");

  // Finde die initiale Variante basierend auf URL-Parameter oder nehme die erste
  const getInitialVariant = () => {
    if (variantIdFromUrl) {
      const variantFromUrl = product.product_variants.find(
        (v) => v.id === variantIdFromUrl
      );
      if (variantFromUrl) return variantFromUrl;
    }
    return product.product_variants[0];
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(getInitialVariant());
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "ingredients" | "feeding" | "reviews"
  >("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [promotionData, setPromotionData] = useState<PromotionData | null>(
    null
  );
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [productReviews, setProductReviews] =
    useState<Review[]>(initialReviews);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const { deleteReview, getProductReviews, checkUserCanReview } = useReviews();
  const router = useRouter();

  // Refresh reviews function (must be defined before useEffect)
  const refreshReviews = useCallback(async () => {
    const { data } = await getProductReviews(product.id);
    if (data) {
      setProductReviews(data);
    }
  }, [getProductReviews, product.id]);

  const inWishlist = isInWishlist(product.id);

  // Update selected variant nur beim ersten Laden basierend auf URL-Parameter
  useEffect(() => {
    if (!hasInitialized && variantIdFromUrl) {
      const variantFromUrl = product.product_variants.find(
        (v) => v.id === variantIdFromUrl
      );
      if (variantFromUrl) {
        setSelectedVariant(variantFromUrl);
      }
      setHasInitialized(true);
    } else if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [variantIdFromUrl, product.product_variants, hasInitialized]);

  // Sort images by display_order, add placeholder if no images
  const sortedImages =
    product.product_images && product.product_images.length > 0
      ? [...product.product_images].sort(
          (a, b) => a.display_order - b.display_order
        )
      : [
          {
            id: "placeholder-1",
            image_url:
              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
            alt_text: "Hundefutter Bild 1",
            display_order: 0,
            is_primary: true,
            product_id: product.id,
            created_at: new Date().toISOString(),
          },
          {
            id: "placeholder-2",
            image_url:
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
            alt_text: "Hundefutter Bild 2",
            display_order: 1,
            is_primary: false,
            product_id: product.id,
            created_at: new Date().toISOString(),
          },
          {
            id: "placeholder-3",
            image_url:
              "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800",
            alt_text: "Hundefutter Bild 3",
            display_order: 2,
            is_primary: false,
            product_id: product.id,
            created_at: new Date().toISOString(),
          },
        ];

  // Load promotion data when variant changes
  useEffect(() => {
    const loadPromotion = async () => {
      const promo = await calculatePromotionDiscount(
        product.id,
        selectedVariant.id,
        selectedVariant.price
      );
      setPromotionData(promo);
    };

    loadPromotion();
  }, [selectedVariant, product.id]);

  // Check if user can leave a review
  useEffect(() => {
    const checkReviewPermission = async () => {
      if (user) {
        const result = await checkUserCanReview(product.id);
        setCanReview(result.canReview);
      }
    };

    checkReviewPermission();
  }, [user, product.id, checkUserCanReview]);

  // Refresh reviews when switching to reviews tab
  useEffect(() => {
    if (activeTab === "reviews") {
      refreshReviews();
    }
  }, [activeTab, refreshReviews]);

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Möchten Sie diese Bewertung wirklich löschen?")) {
      await deleteReview(reviewId);
      await refreshReviews();
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    setEditingReview(null);
    await refreshReviews();
  };

  // Get the final price
  const finalPrice = promotionData
    ? promotionData.discountedPrice
    : selectedVariant.price;

  const originalPrice = promotionData
    ? promotionData.originalPrice
    : selectedVariant.compare_at_price || selectedVariant.price;

  const hasDiscount = finalPrice < originalPrice;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (
      !selectedVariant.stock_quantity ||
      selectedVariant.stock_quantity === 0
    ) {
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(
        selectedVariant.id,
        product.id,
        product.name || "Product",
        selectedVariant.name || "Default",
        finalPrice,
        sortedImages[0]?.image_url || null,
        selectedVariant.stock_quantity || 0,
        quantity
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async () => {
    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  // Handle buy now - add to cart and redirect to checkout
  const handleBuyNow = async () => {
    if (
      !selectedVariant.stock_quantity ||
      selectedVariant.stock_quantity === 0
    ) {
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(
        selectedVariant.id,
        product.id,
        product.name || "Product",
        selectedVariant.name || "Default",
        finalPrice,
        sortedImages[0]?.image_url || null,
        selectedVariant.stock_quantity || 0,
        quantity
      );

      // Redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12 px-2 sm:px-4">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_0.8fr] gap-6 md:gap-8">
        {/* Left: Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Thumbnail Gallery - Left Side (desktop/tablet) */}
          {sortedImages.length > 0 && (
            <div className="hidden md:flex md:flex-col gap-3 w-20 md:w-24 shrink-0">
              {sortedImages.slice(0, 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative cursor-pointer ${
                    currentImageIndex === index
                      ? "border-accent ring-2 ring-accent/20"
                      : "border-muted-foreground/30 hover:border-accent/50"
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image - Responsive */}
          <div className="relative w-full h-[220px] xs:h-[300px] sm:h-[340px] md:w-[640px] lg:w-[720px] sm:h-[420px] md:h-[600px] lg:h-[720px] bg-muted rounded-lg overflow-hidden">
            <Image
              src={sortedImages[currentImageIndex].image_url}
              alt={
                sortedImages[currentImageIndex].alt_text ||
                product.name ||
                "Product"
              }
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 600px"
              priority
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
              {product.age_group && (
                <span className="bg-primary/90 text-white px-1.5 py-0.5 rounded text-[10px] xs:text-xs font-semibold tracking-wide flex items-center justify-center text-center min-w-10 xs:min-w-12">
                  {product.age_group}
                </span>
              )}
              {promotionData && (
                <span className="bg-accent text-white px-2 py-0.5 rounded text-[10px] xs:text-xs font-bold">
                  Sparpreis
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery - Below Main Image (mobile) */}
          {sortedImages.length > 0 && (
            <div className="flex md:hidden gap-2 mt-1">
              {sortedImages.slice(0, 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    currentImageIndex === index
                      ? "border-accent ring-2 ring-accent/20"
                      : "border-muted-foreground/30 hover:border-accent/50"
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-2 sm:space-y-3">
          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
              {product.name}
            </h1>
            <div className="mb-3 sm:mb-4">
              {reviewStats.totalReviews > 0 ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(reviewStats.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    ({reviewStats.totalReviews})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  <button
                    type="button"
                    className="ml-2 text-xs text-primary underline underline-offset-4 hover:text-accent hover:no-underline focus:outline-none transition-colors cursor-pointer"
                    onClick={() => {
                      const header = document.getElementById(
                        "product-tabs-header"
                      );
                      if (header) {
                        const y =
                          header.getBoundingClientRect().top +
                          window.scrollY -
                          100;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                      setTimeout(() => setActiveTab("reviews"), 150);
                    }}
                  >
                    (Noch keine Bewertungen)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Key Features */}
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Enthält die Muskelmasse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Stärkt die natürlichen Abwehrkräfte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Das ausgewogene Nährstoffprofil</span>
            </li>
          </ul>

          {/* Small Links above first divider */}
          <div className="mt-1 mb-8 text-xs flex items-center gap-2">
            <button
              className="underline underline-offset-4 text-accent hover:text-primary hover:no-underline cursor-pointer transition-colors"
              onClick={() => {
                const header = document.getElementById("product-tabs-header");
                if (header) {
                  const y =
                    header.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
                setTimeout(() => setActiveTab("ingredients"), 150);
              }}
            >
              Inhaltsstoffe
            </button>
            <button
              className="underline underline-offset-4 text-accent hover:text-primary hover:no-underline cursor-pointer transition-colors"
              onClick={() => {
                const header = document.getElementById("product-tabs-header");
                if (header) {
                  const y =
                    header.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
                setTimeout(() => setActiveTab("feeding"), 150);
              }}
            >
              Fütterungsempfehlung
            </button>
            <button
              className="underline underline-offset-4 text-accent hover:text-primary hover:no-underline cursor-pointer transition-colors"
              onClick={() => {
                const header = document.getElementById("product-tabs-header");
                if (header) {
                  const y =
                    header.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
                setTimeout(() => setActiveTab("description"), 150);
              }}
            >
              Produktdetails
            </button>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-foreground">
                Größe:{" "}
                <span className="font-bold text-primary">
                  {selectedVariant.name}
                </span>
              </span>
              <div className="flex gap-3">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-(--app-radius) border-2 font-medium transition-all cursor-pointer ${
                      selectedVariant.id === variant.id
                        ? "border-accent bg-accent/10 text-primary"
                        : "border-muted-foreground/30 hover:border-accent/50 text-foreground"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {finalPrice.toFixed(2)} €
              </span>
              {hasDiscount && (
                <span className="text-base line-through text-red-400">
                  {originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              inkl. MwSt. ggf. zzgl. Versand
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex justify-end my-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold whitespace-nowrap">
                Anzahl:
              </label>
              <div className="flex items-center border-2 border-muted-foreground/30 rounded-[0.3125rem] overflow-hidden w-28 sm:w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 grid place-items-center text-foreground bg-muted hover:bg-accent hover:text-white transition-colors cursor-pointer font-bold"
                  aria-label="Menge verringern"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant.stock_quantity || 1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(
                          parseInt(e.target.value) || 1,
                          selectedVariant.stock_quantity || 1
                        )
                      )
                    )
                  }
                  className="w-12 text-center border-x-2 border-muted-foreground/30 py-2 font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        selectedVariant.stock_quantity || 1,
                        quantity + 1
                      )
                    )
                  }
                  className="w-10 h-10 grid place-items-center text-foreground bg-muted hover:bg-accent hover:text-white transition-colors cursor-pointer font-bold"
                  aria-label="Menge erhöhen"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Add to Cart Button */}
            <AddToCartButton
              onClick={handleAddToCart}
              isLoading={isAddingToCart}
              disabled={
                !selectedVariant.stock_quantity ||
                selectedVariant.stock_quantity === 0 ||
                isAddingToCart
              }
            />

            {/* Buy Now Button */}
            <BuyNowButton
              onClick={handleBuyNow}
              isLoading={isAddingToCart}
              disabled={
                !selectedVariant.stock_quantity ||
                selectedVariant.stock_quantity === 0 ||
                isAddingToCart
              }
            />

            {/* Wishlist Button */}
            <AddToWishlistButton onClick={toggleWishlist} active={inWishlist} />
          </div>

          {/* Shipping Info */}
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <strong className="text-xs font-semibold">
                  Versandkostenfrei mit Click & Collect
                </strong>
                <p className="text-muted-foreground text-xs">
                  Kostenfreie Bestellungen schon ab 49,- €
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <strong className="text-xs font-semibold">
                  Kostenlose Rücksendung
                </strong>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div>
                <strong className="text-xs font-semibold">
                  Auf Lager - In 1-3 Werktagen bei Ihnen
                </strong>
                {selectedVariant.stock_quantity && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    ({selectedVariant.stock_quantity} verfügbar)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div
        id="product-tabs"
        className="border rounded-lg overflow-hidden mt-16"
      >
        {/* Tab Headers */}
        <div
          id="product-tabs-header"
          className="flex items-center gap-1 border-b"
        >
          <button
            onClick={() => setActiveTab("description")}
            className={`px-3 py-2 font-medium transition-colors cursor-pointer pr-3 mr-1 border-r border-muted-foreground/30 last:border-r-0 ${
              activeTab === "description"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Beschreibung
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`px-3 py-2 font-medium transition-colors cursor-pointer pr-3 mr-1 border-r border-muted-foreground/30 last:border-r-0 ${
              activeTab === "ingredients"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Inhaltsstoffe
          </button>
          <button
            onClick={() => setActiveTab("feeding")}
            className={`px-3 py-2 font-medium transition-colors cursor-pointer pr-3 mr-1 border-r border-muted-foreground/30 last:border-r-0 ${
              activeTab === "feeding"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Fütterungsempfehlung
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-3 py-2 font-medium transition-colors cursor-pointer ${
              activeTab === "reviews"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Bewertungen
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-muted-foreground">
                {product.description || "Keine Beschreibung verfügbar."}
              </p>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div>
              {product.product_ingredients &&
              product.product_ingredients.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">Zutaten</h3>
                  <ul className="space-y-2">
                    {product.product_ingredients
                      .sort(
                        (a, b) =>
                          (a.display_order || 0) - (b.display_order || 0)
                      )
                      .map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-primary">•</span>
                          <span>
                            <strong>{item.ingredients.name}</strong>
                            {item.percentage && ` (${item.percentage}%)`}
                            {item.ingredients.is_allergen && (
                              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                Allergen
                              </span>
                            )}
                            {item.ingredients.description && (
                              <p className="text-muted-foreground mt-1">
                                {item.ingredients.description}
                              </p>
                            )}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Keine Zutatenliste verfügbar.
                </p>
              )}
            </div>
          )}

          {activeTab === "feeding" && (
            <div>
              {product.feeding_recommendation && (
                <div className="mb-6">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.feeding_recommendation}
                  </p>
                </div>
              )}

              {product.feeding_guidelines &&
              product.feeding_guidelines.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">Fütterungstabelle</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-4 py-2 text-left">
                            Hundegewicht (kg)
                          </th>
                          <th className="border px-4 py-2 text-left">
                            Tägliche Menge (g)
                          </th>
                          <th className="border px-4 py-2 text-left">
                            Hinweise
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.feeding_guidelines
                          .sort(
                            (a, b) =>
                              (a.display_order || 0) - (b.display_order || 0)
                          )
                          .map((guideline) => (
                            <tr key={guideline.id}>
                              <td className="border px-4 py-2">
                                {guideline.dog_weight_kg_min} -{" "}
                                {guideline.dog_weight_kg_max} kg
                              </td>
                              <td className="border px-4 py-2">
                                {guideline.daily_amount_grams} g
                              </td>
                              <td className="border px-4 py-2 text-sm text-muted-foreground">
                                {guideline.notes || "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Keine Fütterungsrichtlinien verfügbar.
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div id="reviews-section" className="space-y-6">
              {/* Review Stats */}
              {reviewStats.totalReviews > 0 && (
                <ReviewStats stats={reviewStats} />
              )}

              {/* Write Review Button or Info Message */}
              {user && canReview && !showReviewForm && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Bewertung schreiben
                  </button>
                </div>
              )}

              {/* Info message when user cannot review */}
              {user && !canReview && !showReviewForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800">
                    Sie können dieses Produkt nur bewerten, wenn Sie es bereits
                    gekauft haben.
                  </p>
                </div>
              )}

              {/* Login prompt for guests */}
              {!user && (
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-700 mb-3">
                    Melden Sie sich an, um eine Bewertung zu schreiben
                  </p>
                  <button
                    onClick={() =>
                      router.push(
                        "/auth/login?redirect=" + window.location.pathname
                      )
                    }
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    Anmelden
                  </button>
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingReview
                        ? "Bewertung bearbeiten"
                        : "Bewertung schreiben"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <ReviewForm
                    productId={product.id}
                    existingReview={editingReview ?? undefined}
                    onSuccess={handleReviewSubmitted}
                  />
                </div>
              )}

              {/* Review List */}
              <ReviewList
                productId={product.id}
                initialReviews={productReviews}
                currentUserId={user?.id}
                onEditReview={handleEditReview}
                onDeleteReview={handleDeleteReview}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-10 sm:mt-14 md:mt-16">
        <RelatedProducts
          productId={product.id}
          title="Entdecke ähnliche Produkte"
          subtitle="Produkte, die andere Kunden auch gekauft haben"
          limit={4}
        />
      </div>
    </div>
  );
}
