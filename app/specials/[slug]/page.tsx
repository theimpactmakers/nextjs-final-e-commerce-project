import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

const specialCategories: Record<
  string,
  { name: string; description: string; icon: string; info: string }
> = {
  diat: {
    name: "Diätfutter",
    description: "Speziell für übergewichtige Hunde entwickelt",
    icon: "⚖️",
    info: "Unser Diätfutter ist kalorienreduziert und enthält alle wichtigen Nährstoffe für eine gesunde Gewichtsreduktion.",
  },
  allergie: {
    name: "Allergiefutter",
    description: "Hypoallergene Rezepturen für sensible Hunde",
    icon: "🌾",
    info: "Speziell für Hunde mit Futtermittelallergien entwickelt. Mit ausgewählten, verträglichen Proteinquellen.",
  },
  getreidefrei: {
    name: "Getreidefreies Futter",
    description: "Ohne Getreide für eine artgerechte Ernährung",
    icon: "🚫",
    info: "Komplett ohne Getreide hergestellt. Ideal für Hunde mit Getreideunverträglichkeit.",
  },
  bio: {
    name: "Bio-Futter",
    description: "100% biologische und natürliche Zutaten",
    icon: "🌱",
    info: "Zertifiziertes Bio-Futter mit Zutaten aus kontrolliert biologischem Anbau.",
  },
  zahnpflege: {
    name: "Zahnpflege",
    description: "Produkte für gesunde Zähne und frischen Atem",
    icon: "🦷",
    info: "Spezielle Kroketten-Struktur und Inhaltsstoffe zur Unterstützung der Zahngesundheit.",
  },
  gelenkpflege: {
    name: "Gelenkpflege",
    description: "Mit Glucosamin und Chondroitin für gesunde Gelenke",
    icon: "🦴",
    info: "Angereichert mit Glucosamin und Chondroitin zur Unterstützung der Gelenkfunktion.",
  },
};

export default async function SpecialCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = specialCategories[slug];

  if (!category) {
    notFound();
  }

  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("erstellt_am", { ascending: false });

  if (error) {
    console.error(error);
    return <p>Fehler beim Laden der Produkte.</p>;
  }

  return (
    <div className="container max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        {" / "}
        <Link href="/specials" className="hover:text-foreground">
          Spezialfutter
        </Link>
        {" / "}
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{category.icon}</span>
          <div>
            <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-blue-900 dark:text-blue-100">{category.info}</p>
          </CardContent>
        </Card>
      </div>

      {/* Produktgitter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={product.bild_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.beschreibung}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">
                  {product.preis} €
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.gewicht}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href={`/shop/${product.id}`}>Details ansehen</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {products && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Derzeit keine Produkte in dieser Kategorie verfügbar.
          </p>
          <Button asChild>
            <Link href="/shop">Alle Produkte ansehen</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
