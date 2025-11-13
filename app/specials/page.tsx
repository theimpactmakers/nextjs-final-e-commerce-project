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

const specialCategories = [
  {
    slug: "diat",
    name: "Diätfutter",
    description: "Speziell für übergewichtige Hunde entwickelt",
    icon: "⚖️",
  },
  {
    slug: "allergie",
    name: "Allergiefutter",
    description: "Hypoallergene Rezepturen für sensible Hunde",
    icon: "🌾",
  },
  {
    slug: "getreidefrei",
    name: "Getreidefreies Futter",
    description: "Ohne Getreide für eine artgerechte Ernährung",
    icon: "🚫",
  },
  {
    slug: "bio",
    name: "Bio-Futter",
    description: "100% biologische und natürliche Zutaten",
    icon: "🌱",
  },
  {
    slug: "zahnpflege",
    name: "Zahnpflege",
    description: "Produkte für gesunde Zähne und frischen Atem",
    icon: "🦷",
  },
  {
    slug: "gelenkpflege",
    name: "Gelenkpflege",
    description: "Mit Glucosamin und Chondroitin für gesunde Gelenke",
    icon: "🦴",
  },
];

export default async function SpecialsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .limit(4);

  return (
    <div className="container max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Spezialfutter</h1>
        <p className="text-muted-foreground">
          Futter für besondere Bedürfnisse deines Hundes
        </p>
      </div>

      {/* Kategorien */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {specialCategories.map((category) => (
          <Card
            key={category.slug}
            className="hover:shadow-lg transition-shadow group cursor-pointer"
          >
            <CardHeader>
              <div className="text-4xl mb-2">{category.icon}</div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/specials/${category.slug}`}>
                  Produkte ansehen
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Produkte */}
      {products && products.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Empfohlene Produkte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/shop/${product.id}`}>Details ansehen</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
