"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

type Product =
  Database["public"]["Views"]["products_with_primary_image"]["Row"] & {
    starting_variant_id?: string;
  };

export function WishlistSection() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const supabase = createClient();

      const productIds = wishlist.map((item) => item.productId);

      // Get products with their starting variant
      const { data, error } = await supabase
        .from("products_with_primary_image")
        .select("*")
        .in("id", productIds);

      if (error) {
        console.error("Error loading wishlist products:", error);
        setProducts([]);
      } else {
        // For each product, get the starting variant ID
        const productsWithVariants = await Promise.all(
          (data || []).map(async (product) => {
            const { data: variant } = await supabase
              .from("product_variants")
              .select("id")
              .eq("product_id", product.id)
              .order("price", { ascending: true })
              .limit(1)
              .single();

            return {
              ...product,
              starting_variant_id: variant?.id,
            };
          })
        );

        // Sort products by the order they were added to wishlist
        const sortedProducts = productsWithVariants.sort((a, b) => {
          const aIndex = wishlist.findIndex((item) => item.productId === a.id);
          const bIndex = wishlist.findIndex((item) => item.productId === b.id);
          return bIndex - aIndex; // Most recently added first
        });
        setProducts(sortedProducts);
      }
      setIsLoading(false);
    };

    loadWishlistProducts();
  }, [wishlist]);

  const handleAddToCart = async (product: Product) => {
    if (!product.starting_variant_id || !product.id) {
      alert("Dieses Produkt hat keine verfügbare Variante");
      return;
    }

    // Get variant details
    const supabase = createClient();
    const { data: variant } = await supabase
      .from("product_variants")
      .select("*")
      .eq("id", product.starting_variant_id)
      .single();

    if (!variant) {
      alert("Variante nicht gefunden");
      return;
    }

    await addToCart(
      variant.id,
      product.id,
      product.name || "Produkt",
      variant.name || "",
      Number(variant.price),
      product.primary_image_url || null,
      variant.stock_quantity || 0,
      1
    );
    alert(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  };

  const handleRemove = (productId: string | null) => {
    if (!productId) return;
    removeFromWishlist(productId);
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Lädt Wunschliste...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold mb-2">
          Deine Wunschliste ist leer
        </h3>
        <p className="text-muted-foreground mb-4">
          Füge Produkte zu deiner Wunschliste hinzu, um sie später zu kaufen
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Meine Wunschliste ({products.length})
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Product Image */}
            <div className="aspect-square relative bg-muted">
              {product.primary_image_url ? (
                <img
                  src={product.primary_image_url}
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Kein Bild
                </div>
              )}
              {/* Remove button overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(product.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                title="Von Wunschliste entfernen"
              >
                <svg
                  className="h-4 w-4 text-red-600"
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

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2 mb-2">
                {product.name}
              </h3>
              {product.min_price && (
                <p className="text-sm font-medium text-primary">
                  Ab {Number(product.min_price).toFixed(2)} €
                </p>
              )}
              {product.starting_variant_name && (
                <p className="text-xs text-muted-foreground mt-1">
                  {product.starting_variant_name}
                </p>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                In den Warenkorb
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-card rounded-xl border shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Produktdetails</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <svg
                  className="h-5 w-5"
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

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                {selectedProduct.primary_image_url ? (
                  <img
                    src={selectedProduct.primary_image_url}
                    alt={selectedProduct.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Kein Bild verfügbar
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedProduct.name}
                  </h3>
                  {selectedProduct.description && (
                    <p className="text-muted-foreground">
                      {selectedProduct.description}
                    </p>
                  )}
                </div>

                {selectedProduct.min_price && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {Number(selectedProduct.min_price).toFixed(2)} €
                    </span>
                    {selectedProduct.starting_variant_name && (
                      <span className="text-sm text-muted-foreground">
                        ab {selectedProduct.starting_variant_name}
                      </span>
                    )}
                  </div>
                )}

                {/* Product Badges */}
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.age_group && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {selectedProduct.age_group}
                    </span>
                  )}
                  {selectedProduct.meat_type && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {selectedProduct.meat_type}
                    </span>
                  )}
                  {selectedProduct.bestseller && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  In den Warenkorb
                </button>
                <Link
                  href={`/products/${selectedProduct.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Details ansehen
                </Link>
                <button
                  onClick={() => handleRemove(selectedProduct.id)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-red-200 bg-background hover:bg-red-50 hover:text-red-700 h-10 px-4 py-2"
                  title="Von Wunschliste entfernen"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
