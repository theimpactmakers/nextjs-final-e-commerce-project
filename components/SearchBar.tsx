"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  product_variants?: {
    price: number;
  }[];
  product_images?: {
    image_url: string;
    is_primary: boolean | null;
  }[];
};

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function SearchBar({
  isMobile = false,
  onClose,
}: SearchBarProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Suche in der Datenbank
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      const supabase = createClient();

      try {
        const searchTerm = searchQuery.toLowerCase();

        // Map search terms to enum values
        const ageGroupMap: Record<string, string> = {
          junior: "JUNIOR",
          welpe: "JUNIOR",
          junghund: "JUNIOR",
          adult: "ADULT",
          erwachsen: "ADULT",
          senior: "SENIOR",
          alt: "SENIOR",
        };

        const meatTypeMap: Record<string, string> = {
          ente: "ENTE",
          duck: "ENTE",
          rind: "RIND",
          beef: "RIND",
          kaninchen: "KANINCHEN",
          rabbit: "KANINCHEN",
          lamm: "LAMM",
          lamb: "LAMM",
          pferd: "PFERD",
          horse: "PFERD",
          wild: "WILD",
          lachs: "LACHS",
          salmon: "LACHS",
          huhn: "HUHN",
          chicken: "HUHN",
        };

        const specialsMap: Record<string, string> = {
          diat: "DIAT",
          diät: "DIAT",
          hypoallergen: "HYPOALLERGEN",
          allergen: "HYPOALLERGEN",
          darm: "DARM",
          darmgesundheit: "DARM",
          gelenk: "GELENK",
          gelenkfit: "GELENK",
        };

        // Check if search term matches any enum values
        const ageGroupMatch = ageGroupMap[searchTerm];
        const meatTypeMatch = meatTypeMap[searchTerm];
        const specialsMatch = specialsMap[searchTerm];

        // Build query with basic search first
        let query = supabase
          .from("products")
          .select(
            `
            id,
            name,
            slug,
            description,
            age_group,
            meat_type,
            specials,
            product_variants(price),
            product_images(image_url, is_primary)
          `
          )
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(50);

        // Add enum filters if matches found
        if (ageGroupMatch || meatTypeMatch || specialsMatch) {
          const enumFilters = [];
          if (ageGroupMatch) enumFilters.push(`age_group.eq.${ageGroupMatch}`);
          if (meatTypeMatch) enumFilters.push(`meat_type.eq.${meatTypeMatch}`);
          if (specialsMatch) enumFilters.push(`specials.eq.${specialsMatch}`);

          if (enumFilters.length > 0) {
            query = query.or(enumFilters.join(","));
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error("Search error:", error);
          setSearchResults([]);
          setShowResults(false);
        } else {
          // Filter out products without variants
          let validProducts = (data || []).filter(
            (p) => p.product_variants && p.product_variants.length > 0
          );

          // Try to fetch ingredients separately for matching products (non-blocking)
          try {
            const productIds = validProducts.map((p) => p.id);
            if (productIds.length > 0) {
              const { data: ingredientData } = await supabase
                .from("product_ingredients")
                .select(
                  `
                  product_id,
                  ingredient:ingredients(name)
                `
                )
                .in("product_id", productIds);

              // Add products that match by ingredient
              if (ingredientData) {
                const matchingProductIds = ingredientData
                  .filter((pi: any) =>
                    pi.ingredient?.name?.toLowerCase().includes(searchTerm)
                  )
                  .map((pi: any) => pi.product_id);

                // Add these products if not already included
                if (matchingProductIds.length > 0) {
                  const { data: additionalProducts } = await supabase
                    .from("products")
                    .select(
                      `
                      id,
                      name,
                      slug,
                      description,
                      age_group,
                      meat_type,
                      specials,
                      product_variants(price),
                      product_images(image_url, is_primary)
                    `
                    )
                    .in("id", matchingProductIds)
                    .limit(10);

                  if (additionalProducts) {
                    validProducts = [
                      ...validProducts,
                      ...additionalProducts,
                    ].filter(
                      (p) => p.product_variants && p.product_variants.length > 0
                    );
                  }
                }
              }
            }
          } catch (ingredientError) {
            // Silently fail ingredient search - still show other results
            console.warn("Ingredient search failed:", ingredientError);
          }

          // Remove duplicates and limit results
          const uniqueProducts = Array.from(
            new Map(validProducts.map((p) => [p.id, p])).values()
          ).slice(0, 8);

          setSearchResults(uniqueProducts);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={
          isMobile
            ? "flex items-center w-full"
            : "hidden md:flex items-center mr-2 self-end group"
        }
      >
        <label
          htmlFor={isMobile ? "mobile-search" : "header-search"}
          className="sr-only"
        >
          Suche
        </label>
        <div className="relative w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-accent hover:text-primary hover:scale-90 active:text-foreground active:scale-100 w-4 h-4 transition-all cursor-pointer"
            aria-hidden
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }}
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id={isMobile ? "mobile-search" : "header-search"}
            name="q"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchFocused ? "Wonach suchst Du?" : "Suche..."}
            onFocus={() => {
              setSearchFocused(true);
              if (searchQuery.trim().length >= 2) {
                setShowResults(true);
              }
            }}
            onBlur={() => setSearchFocused(false)}
            className={`w-full bg-white/95 border border-primary rounded-full py-1.5 pl-9 pr-3 focus:outline-hidden focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-all ${
              searchFocused ? "text-xs" : "text-sm"
            } ${isMobile ? "w-full" : "w-56"}`}
            autoComplete="off"
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div
          className={`${isMobile ? "absolute" : "fixed md:absolute"} top-${
            isMobile ? "full" : "16 md:top-full"
          } left-0 right-0 md:left-auto md:right-0 mt-${
            isMobile ? "2" : "0 md:mt-2"
          } w-full md:w-96 max-w-full md:max-w-[calc(100vw-2rem)] bg-white/98 backdrop-blur-sm border border-gray-200/30 rounded-${
            isMobile ? "md" : "none md:rounded-md"
          } shadow-lg p-2 z-50 max-h-[calc(100vh-5rem)] md:max-h-96 overflow-y-auto`}
        >
          <div className="text-xs text-muted-foreground px-3 py-2 font-semibold">
            {searchResults.length} Ergebnisse gefunden
          </div>
          <ul className="space-y-1">
            {searchResults.map((product) => {
              const primaryImage = product.product_images?.find(
                (img) => img.is_primary
              );
              const imageUrl =
                primaryImage?.image_url ||
                product.product_images?.[0]?.image_url;
              const price = product.product_variants?.[0]?.price || 0;

              // Prüfe ob die URL gültig ist (nicht example.com)
              const isValidImageUrl =
                imageUrl && !imageUrl.includes("example.com");

              return (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                      if (isMobile && onClose) {
                        onClose();
                      }
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[hsl(var(--secondary))] transition-colors group"
                  >
                    {isValidImageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-muted-foreground text-xs">
                        Kein Bild
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-primary group-hover:text-foreground truncate">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {product.description}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-accent">
                      €{price.toFixed(2)}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {searchResults.length >= 8 && (
            <div className="border-t border-gray-200/30 mt-2 pt-2">
              <Link
                href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => {
                  setShowResults(false);
                  setSearchQuery("");
                }}
                className="block text-center text-sm text-accent hover:text-primary hover:underline py-2"
              >
                Alle Ergebnisse anzeigen
              </Link>
            </div>
          )}
        </div>
      )}

      {showResults &&
        searchQuery.trim().length >= 2 &&
        searchResults.length === 0 &&
        !isSearching && (
          <div className="fixed md:absolute top-16 md:top-full left-0 right-0 md:left-auto md:right-0 mt-0 md:mt-2 w-full md:w-96 max-w-full md:max-w-[calc(100vw-2rem)] bg-white/98 backdrop-blur-sm border border-gray-200/30 rounded-none md:rounded-md shadow-lg p-4 z-50">
            <div className="text-sm text-muted-foreground text-center">
              Keine Produkte gefunden für &ldquo;{searchQuery}&rdquo;
            </div>
          </div>
        )}
    </div>
  );
}
