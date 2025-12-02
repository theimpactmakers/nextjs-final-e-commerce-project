import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Database } from "@/types";
import { FilterPanel } from "@/components/FilterPanel";
import PromotionProductCard from "@/components/PromotionProductCard";
import { getActivePromotions } from "@/lib/supabase/products";

export const revalidate = 60;

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

async function PromotionsContent({
  searchParams,
}: {
  searchParams: { age?: string; meat?: string };
}) {
  const { age, meat } = await searchParams;
  const supabase = await createClient();

  try {
    // Hole alle aktiven Promotions
    const activePromotions = await getActivePromotions();

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

    // Sammle alle Produkt-IDs aus den aktiven Promotions
    const productIds: string[] = [];
    const variantIds: string[] = [];

    activePromotions.forEach((promo) => {
      if (promo.applies_to === "all") {
        // Für "all" brauchen wir später alle Produkte zu filtern
      } else if (promo.product_ids) {
        productIds.push(...promo.product_ids);
      } else if (promo.variant_ids) {
        variantIds.push(...promo.variant_ids);
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
      lamm: "LAHM",
      pferd: "PFERD",
      wild: "WILD",
      lachs: "LACHS",
      huhn: "HUHN",
    };

    // Filter nach Altersgruppe wenn vorhanden
    if (age) {
      // Unterstütze mehrere Werte, getrennt durch Komma
      const ageValues = age.split(',').map(a => a.trim().toLowerCase());
      const dbAgeValues = ageValues
        .map(a => ageEnumValues[a])
        .filter(Boolean);
      
      if (dbAgeValues.length > 0) {
        query = query.in("age_group", dbAgeValues);
      }
    }

    // Filter nach Fleischsorte wenn vorhanden
    if (meat) {
      // Unterstütze mehrere Werte, getrennt durch Komma
      const meatValues = meat.split(',').map(m => m.trim().toLowerCase());
      const dbMeatValues = meatValues
        .map(m => meatEnumValues[m])
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

    // Filtere Produkte, die im Angebot sind
    // Wir erstellen ein erweitertes Array mit Promotion-Infos
    type ProductWithPromotionInfo = ProductWithImage & {
      promotionDetails?: {
        promotion: typeof activePromotions[0];
        variantsInPromotion?: Array<{
          id: string;
          name: string;
          weight_grams: number;
          price: number;
          discountedPrice: number;
        }>;
      };
    };

    const productsInPromotion: ProductWithPromotionInfo[] = [];

    if (allProducts) {
      for (const product of allProducts) {
        if (!product.id) continue;

        let productPromotion: ProductWithPromotionInfo["promotionDetails"] = undefined;

        // Prüfe ob das Produkt selbst in einer Promotion ist
        for (const promo of activePromotions) {
          if (promo.applies_to === "all") {
            productPromotion = { promotion: promo };
            break;
          } else if (promo.applies_to === "specific_products" && promo.product_ids) {
            if (promo.product_ids.includes(product.id)) {
              productPromotion = { promotion: promo };
              break;
            }
          } else if (promo.applies_to === "specific_variants" && promo.variant_ids) {
            // Hole alle Varianten des Produkts um zu prüfen, welche davon im Angebot sind
            const { data: variants } = await supabase
              .from("product_variants")
              .select("id, name, weight_grams, price")
              .eq("product_id", product.id)
              .in("id", promo.variant_ids);

            if (variants && variants.length > 0) {
              // Berechne rabattierte Preise
              const variantsWithDiscount = variants.map((v) => {
                let discountedPrice = v.price;
                if (promo.discount_type === "percentage") {
                  discountedPrice = v.price * (1 - promo.discount_value / 100);
                } else if (promo.discount_type === "fixed_amount") {
                  discountedPrice = v.price - promo.discount_value;
                }
                return {
                  ...v,
                  discountedPrice: Math.max(0, discountedPrice),
                };
              });

              productPromotion = {
                promotion: promo,
                variantsInPromotion: variantsWithDiscount,
              };
              break;
            }
          }
        }

        if (productPromotion) {
          productsInPromotion.push({
            ...product,
            promotionDetails: productPromotion,
          });
        }
      }
    }

    // Erstelle Titel basierend auf Filtern
    const getPageTitle = () => {
      const parts = ["Aktuelle Angebote"];

      if (age) {
        const ageLabels: Record<string, string> = {
          junior: "Junior",
          adult: "Adult",
          senior: "Senior",
        };
        parts.push(ageLabels[age.toLowerCase()] || age.toUpperCase());
      }

      if (meat) {
        const meatLabels: Record<string, string> = {
          ente: "Ente",
          rind: "Rind",
          kaninchen: "Kaninchen",
          lamm: "Lamm",
          pferd: "Pferd",
          wild: "Wild",
          lachs: "Lachs",
          huhn: "Huhn",
        };
        parts.push(meatLabels[meat.toLowerCase()] || meat.toUpperCase());
      }

      return parts.join(" - ");
    };

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            {getPageTitle()}
          </h1>
          <p className="text-muted-foreground">
            {productsInPromotion?.length || 0}{" "}
            {productsInPromotion?.length === 1 ? "Produkt" : "Produkte"} im
            Angebot
          </p>
          {activePromotions.length > 0 && (
            <div className="mt-4 space-y-2">
              {activePromotions.slice(0, 3).map((promo) => (
                <p key={promo.id} className="text-sm text-accent font-semibold">
                  🎉 {promo.name}
                  {promo.discount_type === "percentage"
                    ? ` - ${promo.discount_value}% Rabatt`
                    : ` - €${promo.discount_value.toFixed(2)} Rabatt`}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Main Layout: Filter + Products */}
        <div>
          {/* Filter Panel - Mit Altersgruppe und Fleischsorte für Promotions-Seite */}
          <PromotionsFilterPanel />

          {/* Products Grid */}
          {productsInPromotion && productsInPromotion.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsInPromotion.map((p) => (
                <PromotionProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Keine Produkte im Angebot gefunden
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Versuche es mit anderen Filtereinstellungen
              </p>
              <Link
                href="/promotions"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Alle Angebote anzeigen
              </Link>
            </div>
          )}
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
function PromotionsFilterPanel() {
  return (
    <div className="mb-8">
      <FilterPanel currentAge="promotions" />
    </div>
  );
}

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
  searchParams: { age?: string; meat?: string };
}) {
  return (
    <Suspense fallback={<PromotionsLoading />}>
      <PromotionsContent searchParams={searchParams} />
    </Suspense>
  );
}
