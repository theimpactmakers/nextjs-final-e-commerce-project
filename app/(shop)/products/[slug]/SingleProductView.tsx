"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { calculatePromotionDiscount } from "@/lib/supabase/products";
import RelatedProducts from "@/components/RelatedProducts";
import type { Database } from "@/types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_images: Database["public"]["Tables"]["product_images"]["Row"][];
  product_variants: Database["public"]["Tables"]["product_variants"]["Row"][];
  product_ingredients: (Database["public"]["Tables"]["product_ingredients"]["Row"] & {
    ingredients: Database["public"]["Tables"]["ingredients"]["Row"];
  })[];
  feeding_guidelines: Database["public"]["Tables"]["feeding_guidelines"]["Row"][];
};

interface SingleProductViewProps {
  product: Product;
}

interface PromotionData {
  originalPrice: number;
  discountedPrice: number;
  promotion: Database["public"]["Tables"]["promotions"]["Row"];
  discountAmount: number;
  discountType: "percentage" | "fixed_amount";
}

export default function SingleProductView({ product }: SingleProductViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.product_variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "ingredients" | "feeding" | "reviews"
  >("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [promotionData, setPromotionData] = useState<PromotionData | null>(
    null
  );

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(product.id);

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

      // Show success message
      alert("Produkt wurde zum Warenkorb hinzugefügt!");
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
    <div className="space-y-12">
      {/* Main Product Section */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnail Gallery - Left Side */}
          {sortedImages.length > 0 && (
            <div className="flex flex-col gap-3 w-24 shrink-0">
              {sortedImages.slice(0, 3).map((image, index) => (
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

          {/* Main Image - Right Side */}
          <div className="relative w-[600px] h-[600px] bg-muted rounded-lg overflow-hidden shrink-0">
            <Image
              src={sortedImages[currentImageIndex].image_url}
              alt={
                sortedImages[currentImageIndex].alt_text ||
                product.name ||
                "Product"
              }
              fill
              className="object-cover"
              sizes="600px"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {promotionData && (
                <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                  Sparpreis
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4,2 (10) Produkt bewerten
              </span>
            </div>
          </div>

          {/* Key Features */}
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>Enthält die Muskelmasse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>Stärkt die natürlichen Abwehrkräfte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>Das ausgewogene Nährstoffprofil</span>
            </li>
          </ul>

          {/* Size Selector */}
          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">
              Größe: <span className="font-bold">{selectedVariant.name}</span>
            </label>
            <div className="flex gap-3">
              {product.product_variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all cursor-pointer ${
                    selectedVariant.id === variant.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-muted-foreground/30 hover:border-accent/50 text-foreground"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {finalPrice.toFixed(2)} €
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              inkl. MwSt. ggf. zzgl. Versand
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium whitespace-nowrap">
                Anzahl:
              </label>
              <div className="flex items-center border-2 border-muted-foreground/30 rounded-lg flex-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-accent hover:text-foreground hover:bg-muted transition-colors cursor-pointer rounded-l-lg font-bold"
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
                  className="flex-1 text-center border-x-2 border-muted-foreground/30 py-2 font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                  className="px-4 py-2 text-accent hover:text-foreground hover:bg-muted transition-colors cursor-pointer rounded-r-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={
              !selectedVariant.stock_quantity ||
              selectedVariant.stock_quantity === 0 ||
              isAddingToCart
            }
            className="w-full bg-background text-accent border-2 border-accent hover:bg-accent hover:text-white py-3 rounded-lg font-medium transition-all duration-350 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group"
          >
            {isAddingToCart ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Wird hinzugefügt...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 stroke-accent group-hover:stroke-white transition-all duration-350"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Zum Warenkorb hinzufügen
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={
              !selectedVariant.stock_quantity ||
              selectedVariant.stock_quantity === 0 ||
              isAddingToCart
            }
            className="w-full bg-accent text-white border-2 border-accent hover:bg-background hover:text-accent py-3 rounded-lg font-medium transition-all duration-350 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 group"
          >
            {isAddingToCart ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Wird verarbeitet...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 stroke-white group-hover:stroke-accent transition-all duration-350"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Sofort kaufen
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="w-full border-2 border-border hover:border-primary py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                inWishlist
                  ? "fill-accent stroke-none"
                  : "fill-none stroke-current"
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
            {inWishlist
              ? "Von Wunschliste entfernen"
              : "Zur Wunschliste hinzufügen"}
          </button>

          {/* Shipping Info */}
          <div className="space-y-3 text-sm border-t pt-4">
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
                <strong>Versandkostenfrei mit Click & Collect</strong>
                <p className="text-muted-foreground">
                  Bestellungen kostenfreie ab 49,00 €
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
                <strong>Kostenlose Rücksendung</strong>
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
                <strong>Auf Lager - In 1-3 Werktagen bei Ihnen</strong>
                {selectedVariant.stock_quantity && (
                  <span className="text-muted-foreground ml-1">
                    ({selectedVariant.stock_quantity} verfügbar)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border rounded-lg overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
              activeTab === "description"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Beschreibung
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
              activeTab === "ingredients"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Inhaltsstoffe
          </button>
          <button
            onClick={() => setActiveTab("feeding")}
            className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
              activeTab === "feeding"
                ? "border-b-2 border-accent text-accent"
                : "hover:bg-muted"
            }`}
          >
            Fütterungsempfehlung
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
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
            <div className="text-center py-8 text-muted-foreground">
              Noch keine Bewertungen vorhanden. Seien Sie der Erste, der dieses
              Produkt bewertet!
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        productId={product.id}
        title="Entdecke ähnliche Produkte"
        subtitle="Produkte, die andere Kunden auch gekauft haben"
        limit={4}
      />
    </div>
  );
}
