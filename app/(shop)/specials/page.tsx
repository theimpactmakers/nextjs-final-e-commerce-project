// import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";
import ShopProductListClient from "@/components/ShopProductListClient";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Spezialfutter & Diätfutter | Für besondere Bedürfnisse",
  description:
    "Spezialfutter für Allergiker, Diätfutter, getreidefrei, sensitiv & mehr. Finde das passende Futter für besondere Ansprüche deines Hundes!",
  keywords:
    "Spezialfutter, Diätfutter, Allergiker Hundefutter, getreidefrei, sensitiv, Hund Spezialnahrung",
};

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

async function SpecialsContent({
  searchParams,
}: {
  searchParams: Promise<{ special?: string }>;
}) {
  const supabase = createClient();
  await searchParams;
  // Spezialfutter-Filter (optional, falls du später nach Typ filtern willst)
  // const specialFilter = params.special;

  // Query analog zu anderen Kategorieseiten, aber mit age_group 'SPECIAL'
  const query = supabase
    .from("products_with_primary_image")
    .select("*")
    .eq("age_group", "SPECIAL")
    .order("created_at", { ascending: false });

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

  // Varianten und Bilder laden
  const productIds = products?.map((p) => p.id).filter(Boolean) || [];
  const [{ data: variants }, { data: allImages }] = await Promise.all([
    supabase.from("product_variants").select("*").in("product_id", productIds),
    supabase
      .from("product_images")
      .select("*")
      .in("product_id", productIds)
      .order("display_order", { ascending: true }),
  ]);

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

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Banner Section */}
      <section className="w-full my-4">
        <div className="container max-w-7xl mx-auto px-4">
          <Image
            src="/images/banners/specialsbanner.svg"
            alt="Spezialfutter Banner"
            width={1600}
            height={300}
            className="w-full h-80 object-cover rounded-2xl shadow-sm"
            priority
          />
        </div>
      </section>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground text-left">
          Spezialfutter & Diätfutter
        </h1>
        <p className="text-muted-foreground text-left">
          {productsWithVariants?.length || 0} Produkte gefunden
        </p>
      </div>
      <ShopProductListClient products={productsWithVariants} />
    </div>
  );
}

export default async function SpecialsPage({
  searchParams,
}: {
  searchParams: Promise<{ special?: string }>;
}) {
  return <SpecialsContent searchParams={searchParams} />;
}
