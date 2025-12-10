import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { FilterPanel } from "@/components/FilterPanel";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import { getProductsByAge } from "@/lib/supabase/products-optimized";

export const revalidate = 60;

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

async function SeniorContent({
  searchParams,
}: {
  searchParams: { meat?: string };
}) {
  const { meat } = await searchParams;

  // Parse meat filter
  let meatTypes: string[] | undefined;
  if (meat) {
    const meatArray = meat.split(",").filter(Boolean);
    meatTypes = meatArray
      .map((m) => meatEnumValues[m.toLowerCase()])
      .filter(Boolean);
  }

  // Optimized batch fetch - eliminates N+1 queries
  try {
    const products = await getProductsByAge(
      "SENIOR",
      meatTypes && meatTypes.length > 0 ? meatTypes : undefined
    );

    if (!products || products.length === 0) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-12 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-900">
              Hundefutter für Senior
            </h1>
            <p className="text-lg text-amber-800 max-w-2xl">
              Spezielle Ernährung für ältere Hunde. Unterstützt Gelenke, Verdauung und Vitalität.
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              Keine Produkte gefunden
            </p>
            <Link
              href="/senior"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Alle Senior Produkte anzeigen
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-900">
            Hundefutter für Senior
          </h1>
          <p className="text-lg text-amber-800 max-w-2xl">
            Spezielle Pflege für ältere Hunde. Gelenkunterstützung und optimale
            Verdauung im Fokus.
          </p>
        </div>

        {/* Bestseller Slider */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Unsere Senior Bestseller</h2>
          <Suspense fallback={
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[280px] animate-pulse">
                  <div className="bg-muted rounded-xl h-48 mb-4" />
                  <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                  <div className="bg-muted rounded h-3 w-1/2" />
                </div>
              ))}
            </div>
          }>
            <BestsellerCarousel ageGroup="SENIOR" />
          </Suspense>
        </div>

        {/* Info Section */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">🦴 Gelenkgesundheit</h3>
            <p className="text-gray-600">
              Glucosamin und Chondroitin für bewegliche Gelenke
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">🫁 Verdauung</h3>
            <p className="text-gray-600">
              Hochverdauliche Proteine für sensible Mägen
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">🧠 Gehirnfunktion</h3>
            <p className="text-gray-600">
              Antioxidantien unterstützen mentale Vitalität
            </p>
          </div>
        </div>

        {/* Filter & Products */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Alle Senior Produkte</h2>
          <FilterPanel currentAge="senior" />

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                    <Image
                      src={p.primary_image_url || "/images/placeholder.jpg"}
                      alt={p.name || "Product"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {p.meat_type && (
                        <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                          {p.meat_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="p-6 pt-0 space-y-2">
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                      Zum Produkt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Keine Produkte gefunden
              </p>
              <Link
                href="/senior"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Alle Senior Produkte anzeigen
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading senior products:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p>Produkte konnten nicht geladen werden.</p>
        </div>
      </div>
    );
  }
}

function SeniorLoading() {
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

export default async function SeniorPage({
  searchParams,
}: {
  searchParams: { meat?: string };
}) {
  return (
    <Suspense fallback={<SeniorLoading />}>
      <SeniorContent searchParams={searchParams} />
    </Suspense>
  );
}
