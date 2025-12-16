import { Suspense } from "react";
import { SLIDES_DATA } from "./(data)/slideData";
import { BestsellerCarousel } from "../components/BestsellerCarouselWrapper";
import { NewProductsCarousel } from "../components/NewProductsCarouselWrapper";
import Button from "@/components/Button";
import Image from "next/image";
import { AgeCategories } from "@/components/AgeCategories";
import { HeroSlider } from "../components/HeroSlider";
import LandingPageReviews from "@/components/LandingPageReviews";

export const revalidate = 60;

export const metadata = {
  title: "Elite Dog TREATS - Premium Hundefutter & Leckerlis Online kaufen",
  description:
    "Hochwertige Hundeleckerlis & Futter für Junior, Adult & Senior Hunde. 90% Frischfleisch, natürliche Zutaten, sofort lieferbar. Jetzt entdecken!",
  keywords:
    "Hundefutter, Hundeleckerlis, Premium Hundefutter, gesunde Snacks Hund, Welpenfutter, Seniorenfutter",
  openGraph: {
    title: "Elite Dog TREATS - Premium Hundefutter",
    description: "Hochwertige Hundeleckerlis mit 90% Frischfleisch",
    type: "website",
  },
};

export default async function Home() {
  return (
    <div className="w-full">
      {/* Herosection */}
      <HeroSlider slides={SLIDES_DATA} />
      <main className="container max-w-7xl px-4 flex flex-col">
        {/* Kategorien Section */}
        <section className="grid md:grid-cols-3 gap-x-4 gap-y-4">
          {/* Linke Promo-Karte */}
          <a
            href="#sale"
            className="relative rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:scale-95 transition-all duration-300 cursor-pointer"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "#e7a46d", zIndex: 0 }}
            />
            <Image
              src="/images/categories/sale.svg"
              alt="Sale Background"
              fill
              className="hidden md:block object-cover"
              style={{ zIndex: 1 }}
            />
            <Image
              src="/images/categories/salemobile.svg"
              alt="Sale Background Mobile"
              fill
              className="md:hidden object-cover"
              style={{ zIndex: 1 }}
            />
            {/* Overlay und Content */}
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className="absolute top-3 left-3 rounded-full bg-white/80 text-accent text-xs font-semibold mt-8 ml-2 px-2.5 py-1 z-20">
              SALE
            </div>
            <div className="relative z-30 flex flex-col gap-2 text-/20  p-3 md:p-4">
              <h3 className="text-xl text-black font-bold mt-20">
                Feiere Angebote mit deinem Vierbeiner
              </h3>
              <p className="text-black text-xs">
                Bis zu 20% Rabatt – nur für kurze Zeit !
              </p>
              <div className="mt-2">
                <span className="inline-block pointer-events-auto">
                  <Button
                    variant="secondary"
                    className="text-sm py-2 transition-all hover:scale-105"
                  >
                    Zu den Angeboten
                  </Button>
                </span>
              </div>
            </div>
          </a>
          {/* Rechte Säule: */}
          {/* Rechte Säule: */}
          <div className="md:col-span-2 grid gap-4">
            {" "}
            {/* Altersgruppen - horizontal oben */}
            <a
              href="#altersgruppen"
              className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-95 transition-all duration-300"
            >
              {" "}
              <div className="aspect-21/6 relative">
                <Image
                  src="/images/categories/altersgruppen.svg"
                  alt="Altersgruppen"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/30" />{" "}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-bold tracking-wide text-center">
                  {" "}
                  ALLE <br /> ALTERSGRUPPEN{" "}
                </span>{" "}
              </div>{" "}
            </a>{" "}
            {/* Fleischsorten */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/marketing/specials"
                className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-95 transition-all duration-300"
              >
                <div className="aspect-21/9 relative">
                  <Image
                    src="/images/categories/sorten.svg"
                    alt="Fleischsorten"
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold tracking-wide text-center">
                    FLEISCHSORTEN
                  </span>
                </div>
              </a>
              <a
                href="/specials"
                className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-95 transition-all duration-300"
              >
                <div className="aspect-21/9 relative">
                  <Image
                    src="/images/categories/spezialfutter.svg"
                    alt="Spezialfutter"
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
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
        {/* Bestseller Carousel  */}
        <section>
          <div className="px-12 mt-16 md:px-16 mb-8 ml-4">
            <h2 className="text-3xl text-center font-bold text-foreground mb-2">
              Bestseller im Sortiment
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Diese Futtersorten kommen bei Vierbeinern am besten an !
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex gap-4 overflow-hidden px-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="min-w-[280px] animate-pulse">
                    <div className="bg-muted rounded-xl h-48 mb-4" />
                    <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                    <div className="bg-muted rounded h-3 w-1/2" />
                  </div>
                ))}
              </div>
            }
          >
            <BestsellerCarousel />
          </Suspense>
          <div className="w-full border-t border-muted-foreground/20 mt-16 mb-8" />
        </section>

        {/* Altersgruppen */}
        <section id="altersgruppen" className="mt-8 mb-16">
          {" "}
          <div className="mb-12 px-1 ">
            {" "}
            <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
              {" "}
              Wähle nach Alter{" "}
            </h2>{" "}
            <p className="text-muted-foreground text-sm text-center">
              {" "}
              Finde das richtige Futter für deinen Welpe, Adult oder Senior.{" "}
            </p>{" "}
          </div>{" "}
          <AgeCategories />{" "}
        </section>
        {/* Feature-Leiste */}
        <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/75 via-primary/60 to-primary/75 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 items-end justify-items-center">
            {/* Feature-Leiste als Streifen */}
            {[
              {
                icon: "/images/icons/mitliebe.svg",
                title: "110% Leidenschaft",
                desc: "Aus voller Liebe zum Hund!",
                type: "image",
                padding: "xlarge",
              },
              {
                icon: "/images/icons/shipping.svg",
                title: "Sofortversand",
                desc: "In 1-3 Werktagen bei dir",
                type: "image",
                padding: "xlarge",
              },
              {
                icon: "/images/icons/fleisch.svg",
                title: "90% Frischfleisch",
                desc: "Natürliche & hochwertige Zutaten",
                type: "image",
                padding: "xlarge",
              },
              {
                icon: "/images/icons/zufrieden.svg",
                title: "Zufriedenheitsgarantie",
                desc: "Dafür geben wir unser Bestes!",
                type: "image",
                padding: "xlarge",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center h-full justify-end"
              >
                {feature.type === "image" ? (
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={80}
                    height={80}
                    sizes="80px"
                    className={
                      feature.padding === "xlarge"
                        ? "w-20 h-20 object-contain mb-2"
                        : feature.padding === "small"
                        ? "w-12 h-12 object-contain mb-2"
                        : feature.padding === "large"
                        ? "w-16 h-16 object-contain mb-2"
                        : "w-full h-full object-cover mb-2"
                    }
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl mb-2"> {feature.icon}</span>
                )}
                <h3 className="text-base font-bold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-black/80 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        {/* ingredients Section */}
        <section className=" max-w-7xl mx-auto px-4 mt-16 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-4 font-bold">
              Gesunde Zutaten
            </h2>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto">
              Zu 100% hochwertige, natürliche Zutaten.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {[
              {
                image: "/images/ingredients/fleisch.webp",
                title: "90% Frischfleisch",
                description: "Unterstützt starke Muskulatur und Wachstum",
              },
              {
                image: "/images/ingredients/seelachs.webp",
                title: "Seelachs",
                description: "Omega-3 unterstützt Fell- und Hautgesundheit",
              },
              {
                image: "/images/ingredients/kuerbis.webp",
                title: "Kürbis",
                description: "Unterstützt eine gesunde Verdauung",
              },
              {
                image: "/images/ingredients/muschel.webp",
                title: "Grünlippmuschel",
                description: "Natürlicher Entzündungshemmer",
              },
              {
                image: "/images/ingredients/suesskartoffel.webp",
                title: "Süßkartoffel",
                description: "Hochwertiger Energielieferant",
              },
              {
                image: "/images/ingredients/blaubeere.webp",
                title: "Blaubeeren",
                description: "Unterstützt das Immunsystem",
              },
            ].map((ingredient, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center h-full"
              >
                <div className="relative w-full h-full">
                  <div className="w-32 h-32 rounded-full overflow-hidden absolute left-1/2 -translate-x-1/2 top-0 z-10 bg-white shadow-lg">
                    <Image
                      src={ingredient.image}
                      alt={ingredient.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="bg-accent/50 rounded-2xl pt-20 pb-6 px-4 hover:shadow-lg transition-shadow mt-16 flex flex-col h-[220px]">
                    <h3 className="font-bold text-sm text-primary mb-2">
                      {ingredient.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {ingredient.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/shop"
              className="inline-block px-6 py-3 underline hover:no-underline text-accent hover:text-primary font-semibold transition-colors"
            >
              Alle Produkte ansehen
            </a>
          </div>
        </section>
        <div className="w-full border-t border-muted-foreground/20 mt-16 " />
        <section id="sale">
          {/* Sale Carousel */}
          <div className="w-full border-muted-foreground/20 mb-16" />
          <div className=" md:px-16 mb-8 ml-4">
            <h2 className="text-3xl text-center font-bold text-foreground mb-2">
              Produkte im Sale
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Entdecke unsere reduzierte Produkte bis zu 20%!
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex gap-4 overflow-hidden px-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="min-w-[280px] animate-pulse">
                    <div className="bg-muted rounded-xl h-48 mb-4" />
                    <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                    <div className="bg-muted rounded h-3 w-1/2" />
                  </div>
                ))}
              </div>
            }
          >
            <NewProductsCarousel />
          </Suspense>
        </section>

        {/* Kundenbewertungen Section */}
        <section className="bg-muted pt-16  rounded-2xl mt-16">
          <Suspense
            fallback={
              <div className="max-w-7xl mx-auto px-4 ">
                <div className="text-center mb-8">
                  <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
                  <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-muted rounded-lg h-48" />
                  ))}
                </div>
              </div>
            }
          >
            <LandingPageReviews />
          </Suspense>
        </section>

        {/* Tipps & Beratung */}
        <section className="max-w-7xl mx-auto mb-8 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 mt-16 text-center">
            Tipps & Beratung
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Wissen rund um Ernährung und Training.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                title: "Über Uns",
                href: "/about",
              },
              {
                title: "Unsere Story",
                href: "/story",
              },
              {
                title: "Blog & News",
                href: "/blogs",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group rounded-xl border bg-primary/40 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="flex flex-row justify-between items-center w-full">
                  <h3 className="text-lg font-semibold group-brown brown-glow">
                    {item.title}
                  </h3>
                  <span
                    className="text-primary hover:text-black underline underline-offset-4 text-sm font-medium transition-colors cursor-pointer ml-4"
                    aria-label={`Weiter lesen über ${item.title}`}
                  >
                    Weiterlesen
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-primary text-sm my-8 max-w-3xl mx-auto">
              Nutze einfach unseren KI-Futterberater und lasse dich sofort ganz
              individuell beraten.
            </p>
            <a
              href="/beratung"
              className="inline-block px-6 py-2 bg-accent text-white rounded-(--app-radius) font-semibold hover:bg-accent/90 transition hover:scale-95"
              style={{ position: "relative", overflow: "hidden" }}
            >
              Zum Futterberater
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
