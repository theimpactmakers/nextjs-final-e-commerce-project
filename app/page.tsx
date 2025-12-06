import { HeroSlider } from "../components/HeroSlider";
import { SLIDES_DATA } from "./(data)/slideData";
import { BestsellerCarousel } from "../components/BestsellerCarouselWrapper";
import Button from "@/components/Button";

export const revalidate = 60;

export default async function Home() {
  return (
    <div className="w-full">
      {/* Herosection */}
      <HeroSlider slides={SLIDES_DATA} />

      <main className="container max-w-7xl px-4 flex flex-col gap-20">
        {/* Kategorien Section */}
        <section className="grid md:grid-cols-3 gap-4">
          {/* Linke Promo-Karte */}
          <a
            href="/promotions"
            className="relative rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {/* Desktop Hintergrund */}
            <div
              className="absolute inset-0 bg-cover bg-center hidden md:block"
              style={{
                backgroundImage: "url('/images/categories/sale.svg')",
              }}
            />
            {/* Mobile Hintergrund */}
            <div
              className="absolute inset-0 bg-cover bg-center md:hidden"
              style={{
                backgroundImage: "url('/images/categories/salemobile.svg')",
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-3 left-3 rounded-full bg-white/80 text-black text-xs font-semibold mt-4 ml-2 px-2.5 py-1 z-20">
              SALE
            </div>
            <div className="relative z-10 flex flex-col gap-2 text-white p-3 md:p-4">
              <h3 className="text-xl font-bold mt-16">
                Feiere Angebote mit deinem Vierbeiner
              </h3>
              <p className="text-white/90 text-xs">
                Bis zu 20% Rabatt – nur für kurze Zeit!
              </p>
              <div className="mt-2">
                <span className="inline-block hover:brightness-110 hover:scale-95 transition-all pointer-events-auto">
                  <Button variant="secondary" className="text-sm py-2">
                    Zu den Angeboten
                  </Button>
                </span>
              </div>
            </div>
          </a>

          {/* Rechte Säule: */}
          <div className="md:col-span-2 grid gap-4">
            {/* Altersgruppen - horizontal oben */}
            <a
              href="#altersgruppen"
              className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-101 transition-all duration-300"
            >
              <div
                className="aspect-21/6 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/categories/altersgruppen.svg')",
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-bold tracking-wide text-center">
                  ALLE
                  <br />
                  ALTERSGRUPPEN
                </span>
              </div>
            </a>

            {/* Fleischsorten */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/marketing/specials"
                className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div
                  className="aspect-21/9 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/categories/sorten.svg')",
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold tracking-wide text-center">
                    FLEISCHSORTEN
                  </span>
                </div>
              </a>
              <a
                href="/shop/shop"
                className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div
                  className="aspect-21/9 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/images/categories/spezialfutter.svg')",
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold tracking-wide">
                    SPEZIALFUTTER
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Feature-Leiste */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Gratis Versand",
            "Sichere Zahlung",
            "Expertenberatung",
            "24/7 Support",
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-xl border shadow-xs text-center p-5 hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-semibold">{feature}</h3>
            </div>
          ))}
        </div>

        {/* Kategorien Vorschau */}
        <section id="altersgruppen">
          <div className="mb-6 px-1">
            <h2 className="text-3xl font-bold text-foreground mb-1">
              Shop nach Alter
            </h2>
            <p className="text-muted-foreground text-sm">
              Finde passende Produkte für deinen Vierbeiner.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Junior", href: "/shop/junior", bg: "bg-muted" },
              { title: "Adult", href: "/shop/adult", bg: "bg-secondary" },
              { title: "Senior", href: "/shop/senior", bg: "bg-muted" },
              {
                title: "Spezial",
                href: "/marketing/specials",
                bg: "bg-secondary",
              },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href}
                className={`group rounded-xl border ${c.bg} p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between`}
              >
                <div>
                  <h3 className="text-lg font-semibold group-brown brown-glow">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">Jetzt stöbern</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Bestseller Bereich mit Carousel bleibt erhalten */}
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
          <BestsellerCarousel />
        </section>

        {/* Promotion Banner */}
        <section className="relative overflow-hidden rounded-2xl border bg-primary text-primary-foreground p-8 md:p-12">
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Winter Spezial – 15% auf ausgewählte Snacks
            </h3>
            <p className="text-sm md:text-base opacity-95 mb-5">
              Nur für kurze Zeit. Perfekt für Geschenkboxen und Trainingssnacks.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary">Zur Aktion</Button>
              <Button variant="outline">Mehr erfahren</Button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 md:-right-16 md:-bottom-16 h-40 w-40 md:h-56 md:w-56 rounded-full bg-accent/25 blur-2xl" />
        </section>

        {/* Beratung/Content Teaser */}
        <section>
          <div className="mb-6 px-1">
            <h2 className="text-3xl font-bold">Tipps & Beratung</h2>
            <p className="text-muted-foreground text-sm">
              Wissen rund um Ernährung und Training.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Fütterungsratgeber", href: "/marketing/beratung" },
              { title: "Unsere Story", href: "/marketing/story" },
              { title: "Blog & News", href: "/marketing/blogs" },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold group-brown brown-glow">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">Weiter lesen</p>
              </a>
            ))}
          </div>
        </section>

        {/* Community / Newsletter */}
        {/* <section className="bg-card p-10 rounded-xl shadow-lg border">
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
        </section> */}

        {/* Trust / Guarantee Strip */}
        <section className="rounded-xl border bg-muted px-6 py-5">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <h4 className="font-semibold">30 Tage Zufriedenheitsgarantie</h4>
              <p className="text-muted-foreground text-sm">
                Ohne Risiko testen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Schneller Versand</h4>
              <p className="text-muted-foreground text-sm">
                In 1–3 Werktagen bei dir.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Regional produziert</h4>
              <p className="text-muted-foreground text-sm">
                Mit hochwertigen Zutaten.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
