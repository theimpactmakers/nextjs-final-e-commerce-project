import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types";
// neu imp.
import { HeroSlider } from "../components/HeroSlider";
import { SLIDES_DATA } from "./(data)/slideData";
import { BestsellerCarousel } from "../components/BestsellerCarousel";

// Use static generation with ISR for better performance
export const revalidate = 60;

type ProductWithImage =
  Database["public"]["Views"]["products_with_primary_image"]["Row"];

export default async function Home() {
  const supabase = createClient();

  // Use the new view that includes primary image data
  const { data: products, error } = (await supabase
    .from("products_with_primary_image")
    .select("*")
    .order("created_at", { ascending: false })) as {
    data: ProductWithImage[] | null;
    error: Error | null;
  };

  if (error) {
    console.error(error);
    return <p>Fehler beim Laden der Produkte.</p>;
  }

  return (
    <div className="w-full">
      {/* 1. Hero / Banner Sektion (Volle Breite) */}
      <HeroSlider slides={SLIDES_DATA} />

      {/* 2. Hauptinhalt - Zentriert und begrenzt (Container) */}
      <main className="container max-w-7xl px-4 flex flex-col gap-16">
        {/* 3. Feature-Leiste */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Gratis Versand",
            "Sichere Zahlung",
            "Expertenberatung",
            "24/7 Support",
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-xl border-2 shadow-xs text-center p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-sm font-semibold">{feature}</h3>
            </div>
          ))}
        </div>

        {/* 4. Bestseller Bereich mit Carousel */}
        <section>
          <div className="px-12 md:px-16 mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Bestseller im Sortiment
            </h2>
            <p className="text-muted-foreground text-sm">
              Entdecken Sie unsere beliebtesten Futtersorten, die bei
              Vierbeinern am besten ankommen!
            </p>
          </div>

          {/* NEUER CAROUSEL */}
          <BestsellerCarousel products={products || []} />
        </section>

        {/* 5. Community / Newsletter */}
        <section className="bg-card p-10 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold text-center mb-4">
            Werde Teil unserer Community
          </h2>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-12 w-12 text-lg">
              FB
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-12 w-12 text-lg">
              IG
            </button>
          </div>

          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="E-Mail für Newsletter"
              className="grow p-3 border rounded-lg focus:ring-primary focus:border-primary"
            />
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Anmelden
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
