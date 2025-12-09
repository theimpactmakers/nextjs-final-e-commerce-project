"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";
import type { PostgrestError } from "@supabase/supabase-js";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_images: Database["public"]["Tables"]["product_images"]["Row"][];
  product_variants: Database["public"]["Tables"]["product_variants"]["Row"][];
};

export default function ProductsExampleClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? products : products.slice(0, 9);



  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          product_images (
            id,
            image_url,
            alt_text,
            display_order,
            is_primary
          ),
          product_variants (
            id,
            name,
            price,
            compare_at_price,
            weight_grams,
            stock_quantity,
            is_active
          )
        `
        );
      if (error) {
        setError(error);
      } else {
        setProducts(data || []);
      }
    }
    fetchProducts();
  }, []);

  if (error) {
    return <div className="text-destructive">Fehler beim Laden der Produkte</div>;
  }

  return (
    <div className="container max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Unsere Produkte</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            images={product.product_images || []}
            variants={product.product_variants || []}
          />
        ))}
      </div>
      {products.length > 9 && !showAll && (
        <div className="flex justify-center mt-8">
          <button
            className="flex items-center gap-2 text-accent font-semibold text-lg hover:underline"
            onClick={() => setShowAll(true)}
          >
            Mehr anzeigen
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
