import { Suspense } from "react";
import SeniorProductListClient from "@/components/SeniorProductListClient";
import Link from "next/link";
import Image from "next/image";
import { BestsellerCarousel } from "@/components/BestsellerCarouselWrapper";
import { getProductsByAge } from "@/lib/supabase/products-optimized";

export const revalidate = 60;

export const metadata = {
  title: "Senior Hundefutter | Spezielles Futter für ältere Hunde",
  description:
    "Gesundes Futter für Senior Hunde. Unterstützt Gelenkgesundheit, Verdauung & mentale Vitalität. Jetzt Senior Hundefutter online kaufen!",
  keywords: "Senior Hundefutter, Futter ältere Hunde, Gelenkgesundheit Hund",
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
          <div className="mb-12 rounded-xl overflow-hidden flex justify-center items-center bg-white">
            <Image
              src="/images/banners/seniorbanner.svg"
              alt="Senior Hundefutter Banner"
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

        {/* Bestseller Slider */}
        <div className="mb-8">
          <h2 className="text-3xl text-center font-bold mb-6">Unsere Senior Bestseller</h2>
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
            <BestsellerCarousel ageGroup="SENIOR" />
          </Suspense>
        </div>
        {/* Hero Section: Banner */}
        <div className="mb-8 rounded-xl overflow-hidden flex justify-center items-center bg-white">
          <Image
            src="/images/banners/seniorbanner.svg"
            alt="Senior Hundefutter Banner"
            className="w-full h-auto object-cover"
            style={{ maxHeight: 320 }}
            width={1200}
            height={320}
            priority
          />
        </div>

        {/* Filter & Products */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Alle Senior Produkte</h2>
          <SeniorProductListClient
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
