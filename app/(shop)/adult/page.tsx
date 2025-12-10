import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import type { Database } from "@/types";
import { FilterPanel } from "@/components/FilterPanel";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";

export const revalidate = 60;

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

async function AdultContent({
  searchParams,
}: {
  searchParams: { meat?: string };
}) {
  const { meat } = await searchParams;
  const supabase = createClient();

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

  let query = supabase
    .from("products_with_primary_image")
    .select("*")
    .eq("age_group", "ADULT")
    .order("created_at", { ascending: false });

  if (meat) {
    const meatArray = meat.split(',').filter(Boolean);
    const dbValues = meatArray
      .map((m) => meatEnumValues[m.toLowerCase()])
      .filter(Boolean);
    
    if (dbValues.length > 0) {
      query = query.in("meat_type", dbValues);
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
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900">
          Hundefutter für Adult
        </h1>
        <p className="text-lg text-green-800 max-w-2xl">
          Premium-Ernährung für deinen erwachsenen Hund. Energie, Vitalität und
          Gesundheit in jedem Bissen.
        </p>
      </div>

      {/* Bestseller Slider */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Unsere Adult Bestseller</h2>
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
          <BestsellerCarousel ageGroup="ADULT" />
        </Suspense>
      </div>

      {/* Info Section */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">⚡ Optimale Energie</h3>
          <p className="text-gray-600">
            Ausgewogenes Verhältnis von Proteinen und Fetten für Aktivität
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">🦴 Starke Knochen</h3>
          <p className="text-gray-600">
            Calcium und Phosphor für langfristige Gesundheit
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">✨ Glänzendes Fell</h3>
          <p className="text-gray-600">
            Omega-3 und Omega-6 für gesunde Haut und Fell
          </p>
        </div>
      </div>

      {/* Filter & Products */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Alle Adult Produkte</h2>
        <FilterPanel currentAge="adult" />

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
              href="/adult"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Alle Adult Produkte anzeigen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function AdultLoading() {
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

export default async function AdultPage({
  searchParams,
}: {
  searchParams: { meat?: string };
}) {
  return (
    <Suspense fallback={<AdultLoading />}>
      <AdultContent searchParams={searchParams} />
    </Suspense>
  );
}
