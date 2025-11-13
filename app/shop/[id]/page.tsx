import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        {" / "}
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Produktbild */}
        <div className="bg-muted rounded-lg overflow-hidden">
          <img
            src={product.bild_url}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Produktinformationen */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.beschreibung}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">
              {product.preis} €
            </span>
            {product.gewicht && (
              <span className="text-muted-foreground">/ {product.gewicht}</span>
            )}
          </div>

          {/* Produktdetails */}
          <Card>
            <CardHeader>
              <CardTitle>Produktdetails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.fleischsorte && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fleischsorte:</span>
                  <span className="font-medium">{product.fleischsorte}</span>
                </div>
              )}
              {product.altersgruppe && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Altersgruppe:</span>
                  <span className="font-medium">{product.altersgruppe}</span>
                </div>
              )}
              {product.gewicht && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gewicht:</span>
                  <span className="font-medium">{product.gewicht}</span>
                </div>
              )}
              {product.lagerbestand !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verfügbarkeit:</span>
                  <span
                    className={`font-medium ${
                      product.lagerbestand > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.lagerbestand > 0 ? "Auf Lager" : "Ausverkauft"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aktionen */}
          <div className="space-y-3">
            <Button size="lg" className="w-full" disabled={product.lagerbestand === 0}>
              In den Warenkorb
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/shop">Zurück zum Shop</Link>
            </Button>
          </div>

          {/* Zusatzinformationen */}
          <div className="border-t pt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>Kostenloser Versand ab 50€</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>30 Tage Rückgaberecht</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Sichere Zahlung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weitere Produktbeschreibung */}
      {product.beschreibung && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Produktbeschreibung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {product.beschreibung}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
