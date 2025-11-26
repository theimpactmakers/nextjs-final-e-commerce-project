import { HeroSlider } from "../components/HeroSlider";
import { SLIDES_DATA } from "./(data)/slideData";
import { BestsellerCarousel } from "../components/BestsellerCarouselWrapper";
import Button from "@/components/Button";

// Choose your rendering strategy:
// Option 1: ISR (Incremental Static Regeneration) - RECOMMENDED
export const revalidate = 60; // Rebuild every 60 seconds

// Option 2: Dynamic (Always fresh, but slower)
// export const dynamic = 'force-dynamic';

// Option 3: Static (Only rebuild on deployment)
// Remove both lines above

export default async function Home() {
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

          {/* Carousel fetches its own bestseller data */}
          <BestsellerCarousel />
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
            <Button variant="secondary">Anmelden</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
