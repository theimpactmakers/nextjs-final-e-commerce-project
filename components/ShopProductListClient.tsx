"use client";
import { useState, useMemo } from "react";

import { FilterPanel } from "@/components/FilterPanel";
import SortDropdown from "@/components/SortDropdown";
import ShopProductCard from "@/components/ShopProductCard";
import Link from "next/link";

import type { Database } from "@/types";

type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];
type ProductWithVariants = ProductWithImage & {
  product_variants?: ProductVariant[];
};

function sortProducts(products: ProductWithVariants[], sort: string) {
  if (!products) return [];
  if (!sort) return products;
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      sorted.sort(
        (a, b) =>
          (a.product_variants?.[0]?.price ?? 0) -
          (b.product_variants?.[0]?.price ?? 0)
      );
      break;
    case "price-desc":
      sorted.sort(
        (a, b) =>
          (b.product_variants?.[0]?.price ?? 0) -
          (a.product_variants?.[0]?.price ?? 0)
      );
      break;
    case "name-asc":
      sorted.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      break;
    case "name-desc":
      sorted.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
      break;
    case "newest":
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;
    default:
      break;
  }
  return sorted;
}

export default function ShopProductListClient({
  products,
}: {
  products: ProductWithVariants[];
}) {
  const [sort, setSort] = useState("newest");
  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 min-h-16">
        <div className="flex-1">
          <FilterPanel />
        </div>
        <div className="flex-none pt-4 sm:pt-0">
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>
      {/* Aktive Filter-Tags immer unterhalb, damit die Höhe oben gleich bleibt */}
      {/* ...existing code... */}
      {sortedProducts && sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((p) => (
            <ShopProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">
            Keine Produkte gefunden
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Versuche es mit anderen Filtereinstellungen
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Alle Produkte anzeigen
          </Link>
        </div>
      )}
    </>
  );
}
