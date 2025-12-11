import { Suspense } from "react";
import JuniorProductListClient from "@/components/JuniorProductListClient";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import { getProductsByAge } from "@/lib/supabase/products-optimized";
import Image from "next/image";

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
        {/* Bestseller Slider */}
        <div className="mb-8">
          <h2 className="text-3xl text-center font-bold mb-6">
            Unsere Junior Bestseller
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
            <BestsellerCarousel ageGroup="JUNIOR" />
          </Suspense>
        </div>
        {/* Hero Section: Banner */}
        <div className="mb-8 rounded-xl overflow-hidden flex justify-center items-center bg-white">
          <Image
            src="/images/banners/seniorbanner.svg"
            alt="Junior Hundefutter Banner"
            className="w-full h-auto object-cover"
            style={{ maxHeight: 320 }}
            width={1200}
            height={320}
            priority
          />
        </div>
        {/* Filter & Products */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Alle Junior Produkte</h2>
          <JuniorProductListClient products={productsWithVariants} />
        </div>
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
