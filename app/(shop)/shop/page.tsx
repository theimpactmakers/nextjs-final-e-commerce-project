import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";
import ShopProductListClient from "@/components/ShopProductListClient";
import Image from "next/image";

// Revalidate alle 60 Sekunden für frische Daten
export const revalidate = 60;

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

async function ShopContent({
  searchParams,
}: {
  searchParams: { age?: string; meat?: string };
}) {
  const supabase = createClient();

  // Hole Filter-Parameter
  const ageFilter = searchParams.age;
  const meatFilter = searchParams.meat;

  // Starte Query mit der View
  let query = supabase
    .from("products_with_primary_image")
    .select("*")
    .order("created_at", { ascending: false });

  // Enum-Werte für Altersgruppe (großgeschrieben wie in der DB)
  const ageEnumValues: Record<string, string> = {
    junior: "JUNIOR",
    adult: "ADULT",
    senior: "SENIOR",
  };

  // Fleischsorten-Mapping (großgeschrieben wie in der DB)
  const meatEnumValues: Record<string, string> = {
    ente: "ENTE",
    rind: "RIND",
    kaninchen: "KANINCHEN",
    lamm: "LAHM",
    pferd: "PFERD",
    wild: "WILD",
    lachs: "LACHS",
  };

  // Füge Filter hinzu (korrekte Enum-Werte verwenden)
  if (ageFilter && ageEnumValues[ageFilter.toLowerCase()]) {
    query = query.eq("age_group", ageEnumValues[ageFilter.toLowerCase()]);
  }

  if (meatFilter) {
    const normalizedMeat = meatFilter.toLowerCase();
    const dbValue = meatEnumValues[normalizedMeat];
    if (dbValue) {
      query = query.eq("meat_type", dbValue);
    }
  }

  const { data: products, error } = (await query) as {
    data: ProductWithImage[] | null;
    error: Error | null;
  };

  if (error) {
    console.error("Fehler beim Laden der Produkte:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p>Produkte konnten nicht geladen werden.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // Load variants for all products
  const productIds = products?.map((p) => p.id).filter(Boolean) || [];
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .in("product_id", productIds);

  // Attach variants to products
  const productsWithVariants =
    products?.map((product) => ({
      ...product,
      product_variants:
        variants?.filter((v) => v.product_id === product.id) || [],
    })) || [];
  // Titel basierend auf Filtern
  const getPageTitle = () => "Alle Produkte";

  return (
    <>
      {/* Banner Section */}
      <section className="w-full my-8">
        <div className="container max-w-7xl mx-auto px-4">
          <Image
            src="/images/shop-banner.svg"
            alt="Shop Banner"
            width={1600}
            height={300}
            className="w-full h-80 object-cover rounded-2xl shadow-sm"
            priority
          />
        </div>
      </section>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-center md:text-4xl font-bold mb-2 text-foreground">
            {getPageTitle()}
          </h1>
          <p className="text-muted-foreground text-center">
            {productsWithVariants?.length || 0}{" "}
            {productsWithVariants?.length === 1 ? "Produkt" : "Produkte"}{" "}
            gefunden
          </p>
        </div>

        {/* Main Layout: Products */}
        <ShopProductListClient products={productsWithVariants} />
      </div>
    </>
  );
}

// Loading State
function ShopLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Produkte werden geladen...</p>
        </div>
      </div>
    </div>
  );
}

// Hauptkomponente
export default async function ShopPage({
  searchParams,
}: {
  searchParams: { age?: string; meat?: string };
}) {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}
