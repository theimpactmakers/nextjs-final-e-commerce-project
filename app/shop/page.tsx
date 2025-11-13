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

export default async function ShopPage() {
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Unser Shop</h1>
        <p className="text-muted-foreground">
          Entdecke unsere hochwertigen Hundefutter-Produkte
        </p>
      </div>

      {/* Filter/Kategorien könnten hier hinzugefügt werden */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          Alle Produkte
        </Button>
        <Button variant="outline" size="sm">
          Welpen
        </Button>
        <Button variant="outline" size="sm">
          Erwachsen
        </Button>
        <Button variant="outline" size="sm">
          Senior
        </Button>
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
          <p className="text-muted-foreground">Keine Produkte gefunden.</p>
        </div>
      )}
    </div>
  );
}
