import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";
import ShopProductListClient from "@/components/ShopProductListClient";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import Image from "next/image";

// Revalidate alle 60 Sekunden für frische Daten
export const revalidate = 60;

export const metadata = {
  title: "Spezialfutter - Diätfutter, Hypoallergen & mehr | Elite Dog TREATS",
  description:
    "Spezialfutter für besondere Bedürfnisse: Diätfutter, hypoallergenes Futter, Darmgesundheit und Gelenkfit. Finde das passende Futter für deinen Hund!",
  keywords:
    "Spezialfutter, Diätfutter, Hypoallergen, Darmgesundheit, Gelenkfit, Hundefutter Spezialnahrung",
};

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

// Loading State
function SpecialsLoading() {
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

async function SpecialsContent({
  searchParams,
}: {
  searchParams: Promise<{ special?: string; meat?: string }>;
}) {
  const supabase = createClient();

  // Await searchParams before accessing its properties
  const params = await searchParams;
  const specialFilter = params.special;
  const meatFilter = params.meat;

  // Starte Query mit der View - nur Produkte mit specials-Werten
  let query = supabase
    .from("products_with_primary_image")
    .select("*")
    .not("specials", "is", null)
    .order("created_at", { ascending: false });

  // Enum-Werte für Spezialfutter (großgeschrieben wie in der DB)
  const specialEnumValues: Record<string, string> = {
    diat: "DIAT",
    hypoallergen: "HYPOALLERGEN",
    darm: "DARM",
    gelenk: "GELENK",
  };

  // Fleischsorten-Mapping (großgeschrieben wie in der DB)
  const meatEnumValues: Record<string, string> = {
    ente: "ENTE",
    rind: "RIND",
    kaninchen: "KANINCHEN",
    lamm: "LAMM",
    pferd: "PFERD",
    wild: "WILD",
    lachs: "LACHS",
    huhn: "HUHN",
  };

  // Füge Filter hinzu - unterstützt mehrere Werte (kommagetrennt)
  if (specialFilter) {
    const specialValues = specialFilter
      .split(",")
      .map((s) => s.trim().toLowerCase());
    const dbSpecialValues = specialValues
      .map((s) => specialEnumValues[s])
      .filter(Boolean);

    if (dbSpecialValues.length > 0) {
      query = query.in("specials", dbSpecialValues);
    }
  }

  if (meatFilter) {
    const meatValues = meatFilter.split(",").map((m) => m.trim().toLowerCase());
    const dbMeatValues = meatValues
      .map((m) => meatEnumValues[m])
      .filter(Boolean);

    if (dbMeatValues.length > 0) {
      query = query.in("meat_type", dbMeatValues);
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

  // Load variants and all images for all products
  const productIds = products?.map((p) => p.id).filter(Boolean) || [];

  const [{ data: variants }, { data: allImages }] = await Promise.all([
    supabase.from("product_variants").select("*").in("product_id", productIds),
    supabase
      .from("product_images")
      .select("*")
      .in("product_id", productIds)
      .order("display_order", { ascending: true }),
  ]);

  // Attach variants and all images to products
  const productsWithVariants =
    products?.map((product) => {
      const productImages =
        allImages?.filter((img) => img.product_id === product.id) || [];
      return {
        ...product,
        product_variants:
          variants?.filter((v) => v.product_id === product.id) || [],
        product_images: productImages,
      };
    }) || [];

  // Map filter value to DB enum value for carousel
  const specialTypeMap: Record<
    string,
    "DIAT" | "HYPOALLERGEN" | "DARM" | "GELENK"
  > = {
    diat: "DIAT",
    hypoallergen: "HYPOALLERGEN",
    darm: "DARM",
    gelenk: "GELENK",
  };

  // Get first special type from filter (if multiple selected, use first one for carousel)
  const carouselSpecialType = specialFilter
    ? specialTypeMap[specialFilter.split(",")[0].trim().toLowerCase()]
    : undefined;

  return (
    <>
      {/* Bestseller Carousel */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl text-center font-bold mb-6">
          Spezialfutter Bestseller
        </h2>
        <Suspense
          fallback={
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[280px] animate-pulse">
                  <div className="bg-muted rounded-xl h-48 mb-4" />
                  <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                  <div className="bg-muted rounded h-3 w-1/2" />
                </div>
              ))}
            </div>
          }
        >
          <BestsellerCarousel
            specialsOnly={!carouselSpecialType}
            specialType={carouselSpecialType}
          />
        </Suspense>
      </div>

      {/* Banner Section */}
      <section className="w-full my-4">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Desktop Banner */}
          <Image
            src="/images/banners/specials-banner.webp"
            alt="Spezialfutter Banner"
            width={1600}
            height={300}
            className="hidden sm:block w-full h-80 object-cover rounded-2xl shadow-sm"
            priority
          />
          {/* Mobile Banner */}
          <Image
            src="/images/categories/spezialfutter.svg"
            alt="Spezialfutter Mobile Banner"
            width={600}
            height={200}
            className="block sm:hidden w-full h-48 object-cover rounded-2xl shadow-sm"
            priority
          />
        </div>
      </section>

      {/* Scroll Anchor for direct navigation to products */}
      <div id="produkte" className="scroll-mt-20" />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground text-left">
            Spezial Futtersorten
          </h1>
          <p className="text-muted-foreground text-left">
            {productsWithVariants?.length || 0}{" "}
            {productsWithVariants?.length === 1 ? "Produkt" : "Produkte"}{" "}
            gefunden
          </p>
        </div>

        {/* Main Layout: Products with Filter */}
        <ShopProductListClient
          products={productsWithVariants}
          ageContext="specials"
        />
      </div>
    </>
  );
}

// Hauptkomponente
export default async function SpecialsPage({
  searchParams,
}: {
  searchParams: Promise<{ special?: string; meat?: string }>;
}) {
  return (
    <Suspense fallback={<SpecialsLoading />}>
      <SpecialsContent searchParams={searchParams} />
    </Suspense>
  );
}
