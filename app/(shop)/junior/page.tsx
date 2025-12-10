import { Suspense } from "react";
import JuniorProductListClient from "@/components/JuniorProductListClient";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import { getProductsByAge } from "@/lib/supabase/products-optimized";

export const revalidate = 60;

export const metadata = {
  title: "Welpenfutter & Junior Hundefutter | Optimale Ernährung für Welpen",
  description:
    "Speziell entwickeltes Futter für Welpen & Junghunde. Unterstützt optimales Wachstum, Zahnentwicklung & Immunsystem. Jetzt Welpenfutter bestellen!",
  keywords:
    "Welpenfutter, Junior Hundefutter, Futter für Welpen, Junghunde Ernährung",
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

async function JuniorContent({
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
      "JUNIOR",
      meatTypes && meatTypes.length > 0 ? meatTypes : undefined
    );

    const productsWithVariants = products.map((p) => ({
      ...p,
      product_variants: p.product_variants || [],
      product_images: p.product_images || [],
      primary_image_url: p.primary_image_url || null,
      primary_image_alt: p.primary_image_alt || p.name || "",
      min_price: p.min_price ?? null,
      starting_variant_name: p.starting_variant_name ?? "",
    }));

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Hundefutter für Junior
          </h1>
          <p className="text-lg text-blue-800 max-w-2xl">
            Speziell entwickelt für wachsende Welpen. Alles, was dein Junior für
            eine gesunde Entwicklung braucht.
          </p>
        </div>

        {/* Bestseller Slider */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Unsere Junior Bestseller</h2>
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
            <BestsellerCarousel ageGroup="JUNIOR" />
          </Suspense>
        </div>

        {/* Info Section */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">
              👶 Optimale Zusammensetzung
            </h3>
            <p className="text-gray-600">
              Hochwertige Proteine und Vitamine für optimales Wachstum
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">🦷 Zahnentwicklung</h3>
            <p className="text-gray-600">
              Spezielle Nährstoffe unterstützen das Knochenwachstum
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">💪 Immunsystem</h3>
            <p className="text-gray-600">
              Antioxidantien für ein starkes Immunsystem von Anfang an
            </p>
          </div>
        </div>

        {/* Filter, Sortierung & Produktkarten wie im Shop */}
        <JuniorProductListClient products={productsWithVariants} />
      </div>
    );
  } catch (error) {
    console.error("Error loading junior products:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p>Produkte konnten nicht geladen werden.</p>
        </div>
      </div>
    );
  }
}

export default async function JuniorPage({
  searchParams,
}: {
  searchParams: { meat?: string };
}) {
  return <JuniorContent searchParams={searchParams} />;
}
