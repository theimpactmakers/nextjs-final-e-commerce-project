// import { Hero } from "@/components/hero";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient(); // <-- Server Client
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("erstellt_am", { ascending: false });

  if (error) {
    console.error(error);
    return <p>Fehler beim Laden der Produkte.</p>;
  }
  return (
    <div className="w-full">
      {/* 1. Hero / Banner Sektion (Volle Breite) */}
      <section className="h-96 bg-[hsl(var(--muted-foreground))] flex items-center justify-center mb-12">
        <div className="text-center p-8 bg-background/80 rounded-lg shadow-2xl">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Die Jagd ist eröffnet
          </h1>
          <p className="text-lg text-foreground/80">
            Qualität, die man riechen kann!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 mt-4"
          >
            Jetzt Shoppen
          </Link>
        </div>
      </section>

      {/* 2. Hauptinhalt - Zentriert und begrenzt (Container) */}
      <main className="container max-w-7xl px-4 flex flex-col gap-16">
        {/* 3. Feature-Leiste (Wolfsblut-Elemente) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Gratis Versand",
            "Sichere Zahlung",
            "Expertenberatung",
            "24/7 Support",
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-xl border-2 shadow-sm text-center p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-sm font-semibold">{feature}</h3>
            </div>
          ))}
        </div>

        {/* 4. Produktauswahl/Kategorie-Bereich */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Bestseller im Sortiment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((p) => (
              <div
                key={p.id}
                className="bg-card text-card-foreground rounded-xl border shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={p.bild_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {p.beschreibung}
                  </p>
                </div>
                <div className="p-6 pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-destructive">
                      {p.preis} €
                    </span>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Zum Produkt
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fleischsorte: {p.fleischsorte} / Altersgruppe:{" "}
                    {p.altersgruppe}
                  </p>
                  {p.category && (
                    <p className="text-xs text-primary">
                      Kategorie: {p.category.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Community / Newsletter Sektion (mit abgerundeten Ecken) */}
        <section className="bg-card p-10 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold text-center mb-4">
            Werde Teil unserer Community
          </h2>
          <div className="flex justify-center space-x-4 mb-6">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-12 w-12 text-lg">
              FB
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-12 w-12 text-lg">
              IG
            </button>
          </div>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="E-Mail für Newsletter"
              className="flex-grow p-3 border rounded-lg focus:ring-primary focus:border-primary"
            />
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Anmelden
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
