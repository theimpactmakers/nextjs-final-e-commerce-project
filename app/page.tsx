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
      <main className="container max-w-7xl px-4 flex flex-col gap-20">
        {/* Kategorien Section */}
        <section className="grid md:grid-cols-3 gap-4">
          {" "}
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
            />{" "}
            {/* Mobile Hintergrund */}
            <div
              className="absolute inset-0 bg-cover bg-center md:hidden"
              style={{
                backgroundImage: "url('/images/categories/salemobile.svg')",
              }}
            />{" "}
            <div className="absolute inset-0 bg-black/20" />{" "}
            <div className="absolute top-3 left-3 rounded-full bg-white/80 text-black text-xs font-semibold mt-8 ml-2 px-2.5 py-1 z-20">
              {" "}
              SALE{" "}
            </div>{" "}
            <div className="relative z-10 flex flex-col gap-2 text-black p-3 md:p-4">
              {" "}
              <h3 className="text-xl font-bold mt-20">
                {" "}
                Feiere Angebote mit deinem Vierbeiner{" "}
              </h3>{" "}
              <p className="text-black/90 text-xs">
                {" "}
                Bis zu 20% Rabatt – nur für kurze Zeit !{" "}
              </p>{" "}
              <div className="mt-2">
                {" "}
                <span className="inline-block hover:brightness-110 hover:scale-95 transition-all pointer-events-auto">
                  {" "}
                  <Button variant="secondary" className="text-sm py-2">
                    {" "}
                    Zu den Angeboten{" "}
                  </Button>{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </a>{" "}
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
          <div className="w-full border-t border-muted-foreground/20 my-8" />
          <div className="px-12 md:px-16 mb-4  ml-4">
            <h2 className="text-3xl text-center font-bold text-foreground mb-2">
              Bestseller im Sortiment
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Diese Futtersorten kommen bei Vierbeinern am besten an !
            </p>
          </div>
          <BestsellerCarousel />
          <div className="w-full border-t border-muted-foreground/20 my-8" />
        </section>
        {/* Altersgruppen */}
        <section id="altersgruppen">
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
        <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/90 via-primary/80 to-primary/90 p-8 md:p-24 max-w-4xl mx-auto">
          {" "}
          <div className="text-center mb-12">
            {" "}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {" "}
              Aus Liebe zu deinem Hund{" "}
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-16 items-center justify-items-center">
            {" "}
            {[
              {
                icon: "/images/icons/mitliebe.svg",
                title: "110% Leidenschaft",
                desc: "Aus voller Liebe zum Hund!",
                type: "image",
                padding: false,
              },

              {
                icon: "/images/icons/shipping.svg",
                title: "Sofortversand",
                desc: "In 1-3 Werktagen bei dir",
                type: "image",
                padding: "small",
              },

              {
                icon: "/images/icons/fleisch.svg",
                title: "90% Frischfleisch",
                desc: "Natürliche & hochwertige Zutaten",
                type: "image",
                padding: "large",
              },

              {
                icon: "/images/icons/zufrieden.svg",
                title: "Zufriedenheitsgarantie",
                desc: "Dafür geben wir immer unser Bestes!",
                type: "image",
                padding: "large",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`flex gap-8 items-center $ {
              index % 2===1 ? "justify-end" : ""
            }

            `}
              >
                {" "}
                <div className="shrink-0 w-24 h-24 flex items-center justify-center rounded-full overflow-hidden">
                  {" "}
                  {feature.type === "image" ? (
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={96}
                      height={96}
                      className={`$ {
                  feature.padding==="small"
                  ? "w-16 h-16 object-contain"
                  : feature.padding==="large"
                  ? "w-20 h-20 object-contain"
                  : "w-full h-full object-cover"
                }

                `}
                    />
                  ) : (
                    <span className="text-3xl"> {feature.icon}</span>
                  )}
                </div>{" "}
                <div className="flex-1">
                  {" "}
                  <h3 className="text-lg font-bold text-muted mb-1">
                    {" "}
                    {feature.title}
                  </h3>{" "}
                  <p className="text-sm text-muted/70 leading-relaxed">
                    {" "}
                    {feature.desc}
                  </p>{" "}
                </div>{" "}
              </div>
            ))}
          </div>{" "}
        </section>
        {/* Neueste Produkte Bereich mit Carousel */}
        <section>
          {" "}
          <div className="px-12 md:px-16 mb-4 ml-4">
            {" "}
            <h2 className=" text-center text-3xl font-bold text-foreground mb-2">
              {" "}
              Neueste Produkte{" "}
            </h2>{" "}
            <p className="text-center text-muted-foreground text-sm">
              {" "}
              Entdecke die neuesten Produkte in unserem Sortiment !{" "}
            </p>{" "}
          </div>{" "}
          <NewProductsCarousel />{" "}
        </section>
        {/* Promotion Banner */}
        <section className="relative overflow-hidden rounded-2xl border bg-muted text-black p-8 md:p-12">
          {" "}
          <div className="max-w-2xl">
            {" "}
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {" "}
              Winter Spezial – 15% auf ausgewählte Snacks{" "}
            </h3>{" "}
            <p className="text-sm md:text-base opacity-95 mb-5">
              {" "}
              Nur für kurze Zeit. Perfekt für Geschenkboxen und Trainingssnacks.{" "}
            </p>{" "}
            <div className="flex gap-3">
              {" "}
              <Button variant="secondary">Zur Aktion</Button>{" "}
              <Button variant="outline">Mehr erfahren</Button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="absolute -right-10 -bottom-10 md:-right-16 md:-bottom-16 h-40 w-40 md:h-56 md:w-56 rounded-full blur-2xl" />{" "}
        </section>{" "}
        {/* Beratung/Content Teaser */}
        <section>
          {" "}
          <div className="mb-6 px-1">
            {" "}
            <h2 className=" text-center text-3xl font-bold">
              Tipps & Beratung
            </h2>{" "}
            <p className=" text-center text-muted-foreground text-sm">
              {" "}
              Wissen rund um Ernährung und Training.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid md:grid-cols-3 gap-4">
            {" "}
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
                {" "}
                <h3 className="text-lg font-semibold group-brown brown-glow">
                  {" "}
                  {item.title}
                </h3>{" "}
                <p className="text-muted-foreground text-sm">Weiter lesen</p>{" "}
              </a>
            ))}
          </div>{" "}
        </section>
      </main>{" "}
    </div>
  );
}
