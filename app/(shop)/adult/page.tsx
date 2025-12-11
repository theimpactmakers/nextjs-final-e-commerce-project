import { Suspense } from "react";
import Link from "next/link";
import AdultProductListClient from "@/components/AdultProductListClient";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import { getProductsByAge } from "@/lib/supabase/products-optimized";

export const revalidate = 60;

export const metadata = {
  title: "Hundefutter für Adult Hunde | Premium Futter für erwachsene Hunde",
  description:
    "Optimales Futter für erwachsene Hunde. Ausgewogene Nährstoffe für Energie, starke Knochen & glänzendes Fell. Jetzt Adult Hundefutter online bestellen!",
  keywords:
    "Adult Hundefutter, Futter erwachsene Hunde, Premium Hundefutter Adult",
};

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

async function AdultContent({
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
      "ADULT",
      meatTypes && meatTypes.length > 0 ? meatTypes : undefined
    );

    if (!products || products.length === 0) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-12 bg-linear-to-r from-green-50 to-green-100 rounded-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900">
              Hundefutter für Adult
            </h1>
            <p className="text-lg text-green-800 max-w-2xl">
              Premium-Ernährung für deinen erwachsenen Hund. Energie, Vitalität
              und Gesundheit in jedem Bissen.
            </p>
          </div>
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
        </div>
      );
    }

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 bg-linear-to-r from-green-50 to-green-100 rounded-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900">
            Hundefutter für Adult
          </h1>
          <p className="text-lg text-green-800 max-w-2xl">
            Premium-Ernährung für deinen erwachsenen Hund. Energie, Vitalität
            und Gesundheit in jedem Bissen.
          </p>
        </div>

        {/* Bestseller Slider */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Unsere Adult Bestseller</h2>
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
          <AdultProductListClient
            products={products.map((p) => ({
              ...p,
              product_variants: p.product_variants || [],
              product_images: p.product_images || [],
              primary_image_url: p.primary_image_url || null,
              primary_image_alt: p.primary_image_alt || p.name || "",
              min_price: p.min_price ?? null,
              starting_variant_name: p.starting_variant_name ?? "",
            }))}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading adult products:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p>Produkte konnten nicht geladen werden.</p>
        </div>
      </div>
    );
  }
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
