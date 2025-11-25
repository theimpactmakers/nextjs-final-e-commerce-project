import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Database } from "@/types";
import { FilterPanel } from "@/components/FilterPanel";

// Revalidate alle 60 Sekunden für frische Daten
export const revalidate = 60;

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

// Diese Komponente wird serverseitig gerendert
async function ShopContent({
  searchParams,
}: {
  searchParams: { age?: string; meat?: string };
}) {
  // Entpacke searchParams asynchron
  const { age, meat } = await searchParams;

  const supabase = createClient();

  // Hole Filter-Parameter
  const ageFilter = age;
  const meatFilter = meat;

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

  // Erstelle Titel basierend auf Filtern
  const getPageTitle = () => {
    const parts = [];

    if (ageFilter) {
      const ageLabels: Record<string, string> = {
        junior: "Junior",
        adult: "Adult",
        senior: "Senior",
      };
      parts.push(ageLabels[ageFilter.toLowerCase()] || ageFilter.toUpperCase());
    }

    if (meatFilter) {
      const meatLabels: Record<string, string> = {
        ente: "Ente",
        rind: "Rind",
        kaninchen: "Kaninchen",
        lamm: "Lamm",
        pferd: "Pferd",
        wild: "Wild",
        lachs: "Lachs",
      };
      parts.push(meatLabels[meatFilter.toLowerCase()] || meatFilter.toUpperCase());
    }

    if (parts.length > 0) {
      return `Hundefutter - ${parts.join(" & ")}`;
    }

    return "Hundefutter";
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          {getPageTitle()}
        </h1>
        <p className="text-muted-foreground">
          {products?.length || 0}{" "}
          {products?.length === 1 ? "Produkt" : "Produkte"} gefunden
        </p>
      </div>

      {/* Main Layout: Filter + Products */}
      <div>
        {/* Filter Panel - Above Products */}
        <FilterPanel />

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={p.primary_image_url || "/images/placeholder.jpg"}
                    alt={p.primary_image_alt || p.name || "Product image"}
                    className="w-full h-full object-cover"
                  />

                  {/* Badges für Kategorien */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {p.age_group && (
                      <span className="bg-accent/90 text-white text-xs px-2 py-1 rounded-full">
                        {p.age_group}
                      </span>
                    )}
                    {p.meat_type && (
                      <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                        {p.meat_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Zum Produkt
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fleischsorte: {p.meat_type} / Altersgruppe: {p.age_group}
                  </p>
                </div>
              </div>
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
      </div>
    </div>
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
