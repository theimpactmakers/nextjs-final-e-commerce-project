// import { Hero } from "@/components/hero";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
          <Button asChild className="mt-4" size="lg">
            <Link href="/shop">Jetzt Shoppen</Link>
          </Button>
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
            <Card
              key={index}
              className="text-center p-4 border-2 hover:shadow-lg transition-shadow"
            >
              <CardTitle className="text-sm font-semibold">{feature}</CardTitle>
            </Card>
          ))}
        </div>

        {/* 4. Produktauswahl/Kategorie-Bereich */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Bestseller im Sortiment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Platzhalter für Produktkarten mit modernem, abgerundetem Stil */}
            {[1, 2, 3, 4].map((item) => (
              <Card
                key={item}
                className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="h-48 bg-muted flex items-center justify-center">
                  {/*  */}
                </div>
                <CardHeader>
                  <CardTitle>Produktname {item}</CardTitle>
                  <CardDescription>
                    Kurze Beschreibung des Futters.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center pb-4">
                  <span className="text-lg font-bold text-destructive">
                    29,99 €
                  </span>
                  <Button>Zum Produkt</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. Community / Newsletter Sektion (mit abgerundeten Ecken) */}
        <section className="bg-card p-10 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold text-center mb-4">
            Werde Teil unserer Community
          </h2>
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 text-lg"
            >
              FB
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 text-lg"
            >
              IG
            </Button>
          </div>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="E-Mail für Newsletter"
              className="flex-grow p-3 border rounded-lg focus:ring-primary focus:border-primary"
            />
            <Button>Anmelden</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
