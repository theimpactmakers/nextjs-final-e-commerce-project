import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Database } from "@/types";
import PromotionProductListClient from "@/components/PromotionProductListClient";
import { getActivePromotionsServer } from "@/lib/supabase/products-server";

export const revalidate = 60;

export const metadata = {
  title: "Angebote & Aktionen | Hundefutter Sale bis zu 20% Rabatt",
  description:
    "Aktuelle Rabatte auf Premium Hundefutter! Bis zu 20% sparen auf ausgewählte Produkte. Limitierte Angebote - jetzt zugreifen!",
  keywords: "Hundefutter Angebote, Leckerlis Sale, Rabatt Hundefutter",
};

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

async function PromotionsContent({
  searchParams,
}: {
  searchParams: { age?: string; meat?: string; promo?: string };
}) {
  const { age, meat, promo } = await searchParams;
  const supabase = await createClient();

  try {
    // Hole alle aktiven Promotions (Server-Side, Caching via Page revalidate)
    let activePromotions = await getActivePromotionsServer();

    // Filtere nach spezifischer Promotion, wenn promo-Parameter vorhanden
    if (promo) {
      activePromotions = activePromotions.filter((p) => p.id === promo);
    }

    if (!activePromotions || activePromotions.length === 0) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Aktuelle Angebote
            </h1>
            <p className="text-xl text-muted-foreground">
              Derzeit sind keine Angebote verfügbar
            </p>
          </div>
        </div>
      );
    }

    // Sammle alle Produkt-IDs und Varianten-IDs aus den aktiven Promotions
    const productIdsSet = new Set<string>();
    const variantIdsSet = new Set<string>();
    const hasAllPromotion = activePromotions.some(
      (p) => p.applies_to === "all"
    );

    activePromotions.forEach((promo) => {
      if (promo.product_ids) {
        promo.product_ids.forEach((id) => productIdsSet.add(id));
      }
      if (promo.variant_ids) {
        promo.variant_ids.forEach((id) => variantIdsSet.add(id));
      }
    });

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
      lamm: "LAMM",
      pferd: "PFERD",
      wild: "WILD",
      lachs: "LACHS",
      huhn: "HUHN",
    };

    // Filter nach Altersgruppe wenn vorhanden
    if (age) {
      // Unterstütze mehrere Werte, getrennt durch Komma
      const ageValues = age.split(",").map((a) => a.trim().toLowerCase());
      const dbAgeValues = ageValues
        .map((a) => ageEnumValues[a])
        .filter(Boolean);

      if (dbAgeValues.length > 0) {
        query = query.in("age_group", dbAgeValues);
      }
    }

    // Filter nach Fleischsorte wenn vorhanden
    if (meat) {
      // Unterstütze mehrere Werte, getrennt durch Komma
      const meatValues = meat.split(",").map((m) => m.trim().toLowerCase());
      const dbMeatValues = meatValues
        .map((m) => meatEnumValues[m])
        .filter(Boolean);

      if (dbMeatValues.length > 0) {
        query = query.in("meat_type", dbMeatValues);
      }
    }

    const { data: allProducts, error } = (await query) as {
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

    if (!allProducts || allProducts.length === 0) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Aktuelle Angebote
            </h1>
            <p className="text-xl text-muted-foreground">
              Keine Produkte gefunden
            </p>
          </div>
        </div>
      );
    }

    // Batch-lade alle Varianten für Produkte mit Varianten-Promotions in einem Query
    const productIdsForVariants = allProducts
      .map((p) => p.id)
      .filter((id): id is string => !!id);

    const { data: allVariants } = await supabase
      .from("product_variants")
      .select("*")
      .in("product_id", productIdsForVariants)
      .eq("is_active", true);

    // Erstelle Maps für schnellen Zugriff
    const variantsMap = new Map<string, typeof allVariants>();
    allVariants?.forEach((v) => {
      if (!variantsMap.has(v.product_id)) {
        variantsMap.set(v.product_id, []);
      }
      variantsMap.get(v.product_id)?.push(v);
    });

    const promoMap = new Map<string, (typeof activePromotions)[0]>();
    activePromotions.forEach((p) => {
      if (p.applies_to === "specific_products" && p.product_ids) {
        p.product_ids.forEach((id) => promoMap.set(id, p));
      }
    });

    // Filtere Produkte, die im Angebot sind und baue sie wie im Shop-Client auf
    type ProductVariant =
      Database["public"]["Tables"]["product_variants"]["Row"];
    type ProductImage = {
      alt_text: string | null;
      created_at: string | null;
      display_order: number;
      id: string;
      image_url: string;
      is_primary: boolean | null;
      product_id: string;
      updated_at: string | null;
    };
    type ProductWithVariants = ProductWithImage & {
      product_variants?: ProductVariant[];
      product_images?: ProductImage[];
    };
    const productsInPromotion: ProductWithVariants[] = [];

    for (const product of allProducts) {
      if (!product.id) continue;

      // Nur Produkte, die in einer Promotion sind (wie vorher)
      let isPromo = false;
      if (hasAllPromotion) isPromo = true;
      if (promoMap.has(product.id)) isPromo = true;
      if (!isPromo && variantIdsSet.size > 0) {
        const productVariants = variantsMap.get(product.id) || [];
        if (productVariants.some((v) => variantIdsSet.has(v.id))) {
          isPromo = true;
        }
      }
      if (!isPromo) continue;

      // Füge Varianten und Bilder wie im Shop hinzu (alle Felder der Variante)
      const variantsRaw = variantsMap.get(product.id);
      productsInPromotion.push({
        ...product,
        product_variants: Array.isArray(variantsRaw)
          ? (variantsRaw as ProductVariant[])
          : [],
        product_images: [], // Optional: Hier könnten Bilder geladen werden, falls benötigt
      });
    }

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Promotion Description Banner - Mittig und schön gestylt */}
          {promo &&
            activePromotions.length > 0 &&
            activePromotions[0].description && (
              <div className="my-8 flex justify-center">
                <div className="max-w-3xl w-full bg-linear-to-r from-red-50 via-orange-50 to-red-50 rounded-2xl shadow-lg border-2 border-red-200 p-6 md:p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-8 h-8 text-red-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Aktionsangebot
                      </h2>
                      <svg
                        className="w-8 h-8 text-red-600 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
                      {activePromotions[0].description}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="inline-flex items-center px-6 py-2 rounded-full text-lg font-bold bg-red-600 text-white shadow-md">
                        {activePromotions[0].discount_type === "percentage"
                          ? `${activePromotions[0].discount_value}% RABATT`
                          : `€${activePromotions[0].discount_value.toFixed(
                              2
                            )} RABATT`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Für "Alle Angebote" - zeige Grid mit allen Descriptions */}
          {!promo &&
            activePromotions.length > 0 &&
            activePromotions.some((p) => p.description) && (
              <div className="my-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
                  Aktuelle Aktionen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePromotions
                    .filter((p) => p.description)
                    .map((promo) => (
                      <div
                        key={promo.id}
                        className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-md border-2 border-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-6 h-6 text-orange-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <h3 className="font-bold text-lg text-gray-900">
                              {promo.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {promo.description}
                          </p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">
                              {promo.discount_type === "percentage"
                                ? `-${promo.discount_value}%`
                                : `-€${promo.discount_value.toFixed(2)}`}
                            </span>
                            <Link
                              href={`/promotions?promo=${promo.id}`}
                              className="text-sm font-semibold text-primary hover:text-accent transition-colors underline"
                            >
                              Jetzt ansehen →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          <p className="text-muted-foreground text-center">
            {productsInPromotion?.length || 0}{" "}
            {productsInPromotion?.length === 1 ? "Produkt" : "Produkte"} im
            Angebot
          </p>
        </div>

        {/* Main Layout: Filter + Products */}
        <div>
          {/* Zurück-Link wenn spezifische Promotion gefiltert */}
          {promo && (
            <div className="mb-6">
              <Link
                href="/promotions"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Zurück zu allen Angeboten
              </Link>
            </div>
          )}

          {/* Products Grid */}
          <PromotionProductListClient products={productsInPromotion} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in PromotionsContent:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p>Ein Fehler ist aufgetreten.</p>
        </div>
      </div>
    );
  }
}

// Spezieller Filter für Promotions-Seite (mit Altersgruppe und Fleischsorte)

function PromotionsLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Aktuelle Angebote werden geladen...
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: { age?: string; meat?: string; promo?: string };
}) {
  return (
    <Suspense fallback={<PromotionsLoading />}>
      <PromotionsContent searchParams={searchParams} />
    </Suspense>
  );
}
