import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  {
    name: "Welpenfutter",
    slug: "welpen",
    description: "Speziell für Welpen entwickelt",
    image: "https://placehold.co/400x300",
    productCount: 12,
  },
  {
    name: "Adult Futter",
    slug: "erwachsen",
    description: "Für erwachsene Hunde",
    image: "https://placehold.co/400x300",
    productCount: 24,
  },
  {
    name: "Senior Futter",
    slug: "senior",
    description: "Für ältere Hunde ab 7 Jahren",
    image: "https://placehold.co/400x300",
    productCount: 8,
  },
  {
    name: "Trockenfutter",
    slug: "trockenfutter",
    description: "Hochwertige Trockenfutter-Auswahl",
    image: "https://placehold.co/400x300",
    productCount: 18,
  },
  {
    name: "Nassfutter",
    slug: "nassfutter",
    description: "Schmackhaftes Nassfutter",
    image: "https://placehold.co/400x300",
    productCount: 15,
  },
  {
    name: "Snacks & Leckerlis",
    slug: "snacks",
    description: "Gesunde Belohnungen",
    image: "https://placehold.co/400x300",
    productCount: 20,
  },
];

export default function KategorienPage() {
  return (
    <div className="container max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Kategorien</h1>
        <p className="text-muted-foreground">
          Durchsuche unsere Produktkategorien
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.slug}
            className="overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="h-48 bg-muted overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {category.productCount} Produkte
              </p>
              <Button asChild className="w-full">
                <Link href={`/kategorien/${category.slug}`}>
                  Kategorie ansehen
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
