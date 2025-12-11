import { Suspense } from "react";
import Link from "next/link";
import AdultProductListClient from "@/components/AdultProductListClient";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import { getProductsByAge } from "@/lib/supabase/products-optimized";
import Image from "next/image";

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
          <div className="mb-12 rounded-xl overflow-hidden flex justify-center items-center bg-white">
            <Image
              src="/images/banners/adultbanner.svg"
              alt="Adult Hundefutter Banner"
              className="w-full h-auto object-cover"
              style={{ maxHeight: 320 }}
              width={1200}
              height={320}
              priority
            />
          </div>
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              Keine Produkte gefunden
            </p>
            <p className="text-red-600">
              Produkte konnten nicht geladen werden.
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
        {/* Bestseller Slider */}
        <div className="mb-8">
          <h2 className="text-3xl text-center font-bold mb-6">
            Unsere Adult Bestseller
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
            <BestsellerCarousel ageGroup="ADULT" />
          </Suspense>
        </div>
        {/* Hero Section: Banner */}
        <div className="mb-8 rounded-xl overflow-hidden flex justify-center items-center bg-white">
          <Image
            src="/images/banners/adultbanner.svg"
            alt="Adult Hundefutter Banner"
            className="w-full h-auto object-cover"
            style={{ maxHeight: 320 }}
            width={1200}
            height={320}
            priority
          />
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
