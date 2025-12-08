import { HeroSlider } from "../components/HeroSlider";
import { SLIDES_DATA } from "./(data)/slideData";
import { BestsellerCarousel } from "../components/BestsellerCarouselWrapper";
import { NewProductsCarousel } from "../components/NewProductsCarouselWrapper";
import Button from "@/components/Button";
import Image from "next/image";
import { AgeCategories } from "@/components/AgeCategories";

export const revalidate = 60;

export default async function Home() {
  return (
    <div className="w-full">
      {" "}
      {/* Herosection */}
      <HeroSlider slides={SLIDES_DATA} />
      <main className="container max-w-7xl px-4 flex flex-col">
        {/* Kategorien Section */}
        <section className="grid md:grid-cols-3 gap-x-4 gap-y-4 mt-8 mb-16">
          {" "}
          {/* Linke Promo-Karte */}
          <a
            href="/promotions"
            className="relative rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "#e7a46d", zIndex: 0 }}
            />
            {/* SVG Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center hidden md:block"
              style={{
                backgroundImage: "url('/images/categories/sale.svg')",
                zIndex: 1,
              }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center md:hidden"
              style={{
                backgroundImage: "url('/images/categories/salemobile.svg')",
                zIndex: 1,
              }}
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
            {" "}
            {/* Altersgruppen - horizontal oben */}
            <a
              href="#altersgruppen"
              className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-101 transition-all duration-300"
            >
              {" "}
              <div
                className="aspect-21/6 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/categories/altersgruppen.svg')",
                }}
              />{" "}
              <div className="absolute inset-0 bg-black/30" />{" "}
              <div className="absolute inset-0 flex items-center justify-center">
                {" "}
                <span className="text-white text-xl font-bold tracking-wide text-center">
                  {" "}
                  ALLE <br /> ALTERSGRUPPEN{" "}
                </span>{" "}
              </div>{" "}
            </a>{" "}
            {/* Fleischsorten */}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <a
                href="/marketing/specials"
                className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {" "}
                <div
                  className="aspect-21/9 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/categories/sorten.svg')",
                  }}
                />{" "}
                <div className="absolute inset-0 bg-black/30" />{" "}
                <div className="absolute inset-0 flex items-center justify-center">
                  {" "}
                  <span className="text-white text-lg font-bold tracking-wide text-center">
                    {" "}
                    FLEISCHSORTEN{" "}
                  </span>{" "}
                </div>{" "}
              </a>{" "}
              <a
                href="/specials"
                className="relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {" "}
                <div
                  className="aspect-21/9 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/images/categories/spezialfutter.svg')",
                  }}
                />{" "}
                <div className="absolute inset-0 bg-black/30" />{" "}
                <div className="absolute inset-0 flex items-center justify-center">
                  {" "}
                  <span className="text-white text-lg font-bold tracking-wide">
                    {" "}
                    SPEZIALFUTTER{" "}
                  </span>{" "}
                </div>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </section>

        {/* Bestseller Carousel  */}
        <section>
          <div className="w-full border-t border-muted-foreground/20 pb-16" />
          <div className="px-12 md:px-16 mb-8 ml-4">
            <h2 className="text-3xl text-center font-bold text-foreground mb-2">
              Bestseller im Sortiment
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Diese Futtersorten kommen bei Vierbeinern am besten an !
            </p>
          </div>
          <BestsellerCarousel />
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
                desc: "Dafür geben wir immer unser Bestes!",
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
                    width={64}
                    height={64}
                    className={
                      feature.padding === "xlarge"
                        ? "w-20 h-20 object-contain mb-2"
                        : feature.padding === "small"
                        ? "w-12 h-12 object-contain mb-2"
                        : feature.padding === "large"
                        ? "w-16 h-16 object-contain mb-2"
                        : "w-full h-full object-cover mb-2"
                    }
                  />
                ) : (
                  <span className="text-3xl mb-2"> {feature.icon}</span>
                )}
                <h3 className="text-lg font-bold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-black/80 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section id="neueprodukte">
          {/* Neue Produkte Carousel */}
          <div className="w-full border-muted-foreground/20 mb-16" />
          <div className=" md:px-16 mb-8 ml-4">
            <h2 className="text-3xl text-center font-bold text-foreground mb-2">
              Neue Produkte
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Entdecke unsere neuesten Artikel im Sortiment!
            </p>
          </div>
          <NewProductsCarousel />
        </section>
        <div className="w-full border-t border-muted-foreground/20 mt-16" />

        {/* Tipps & Beratung */}
        <section className="max-w-7xl mx-auto mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 mt-16 text-center">
            Tipps & Beratung
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Wissen rund um Ernährung und Training.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                title: "Fütterungsratgeber",
                href: "/marketing/beratung",
              },
              {
                title: "Unsere Story",
                href: "/marketing/story",
              },
              {
                title: "Blog & News",
                href: "/marketing/blogs",
              },
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
      </main>
    </div>
  );
}
