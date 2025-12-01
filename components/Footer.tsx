"use client";
import { useState } from "react";
function CategoryDropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="w-full flex items-center justify-between text-foreground font-normal focus:outline-none hover:text-primary transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`cat-dropdown-${label}`}
      >
        <span className="flex items-center">
          {label}
          <span
            className={`ml-2 h-5 w-5 flex items-center justify-center text-lg font-normal transition-transform ${
              open ? "rotate-45 text-primary" : "text-foreground"
            }`}
          >
            +
          </span>
        </span>
      </button>
      <ul
        id={`cat-dropdown-${label}`}
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {children}
      </ul>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

function ProtectDogSection() {
  return (
    <section className="w-full px-16 flex items-end justify-between gap-0 relative overflow-visible min-h-20">
      {/* Haupt-Section mit Bild und braunem Hintergrund */}
      {/* Brauner Hintergrund im unteren Bereich */}
      <div
        className="absolute left-0 bottom-0 w-full h-[70%] bg-primary"
        style={{ zIndex: 1 }}
      ></div>
      {/* Bild links, überstehend */}
      <div
        className="shrink-0 relative w-[400px] h-80 flex items-end"
        style={{ zIndex: 3 }}
      >
        <Image
          src="/images/footer-dogs.png"
          alt="Hunde"
          fill
          sizes="500px"
          className="object-contain absolute left-0 bottom-0 -top-48 pointer-events-none select-none"
          priority
        />
      </div>
      {/* Text und Formular rechts im braunen Bereich */}
      <div
        className="flex-1 max-w-xl flex flex-col justify-end items-start h-full pl-8 pb-8"
        style={{ zIndex: 2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Werde Teil unserer Community
        </h2>
        <div className="text-base text-white mb-4">
          Abonniere unseren Newsletter und verpasse keine Neuigkeiten!
        </div>
        <form className="flex w-full max-w-lg gap-2 mt-2">
          <input
            type="email"
            placeholder="Newsletter abonnieren..."
            className="max-w-xs w-full px-4 py-2 border border-gray-300 rounded-l-full rounded-r-[0.3125rem] focus:outline-none bg-white"
          />
          <Button
            type="submit"
            variant="primary"
            className="rounded-r-full hover:translate-x-2 hover:translate-y-0"
          >
            Anmelden
          </Button>
        </form>
      </div>
    </section>
  );
}
export default function Footer() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"de" | "en">("de");
  const langOptions = [
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "en", label: "Englisch", flag: "🇬🇧" },
  ];
  return (
    <>
      <ProtectDogSection />
      {/* Footer-Bereich mit Navigation, Links und Copyright */}
      <footer className="w-full border-t bg-muted py-12 text-muted-foreground px-6 sm:px-8 lg:px-12">
        <div className="container max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Spalte 1: Shop */}
          <div className="text-center md:text-left">
            <Link
              href="/shop"
              className="hover:text-primary hover:underline transition-colors"
            >
              <h4 className="font-bold text-foreground mb-3">Shop</h4>
            </Link>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/lieferzeiten"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Lieferzeiten
                </Link>
              </li>
              <li>
                <Link
                  href="/retouren"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Retouren
                </Link>
              </li>
              <li>
                <Link
                  href="/zahlung-versand"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Zahlung & Versand
                </Link>
              </li>
            </ul>
          </div>
          {/* Spalte 2: Home */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="hover:text-primary hover:underline transition-colors"
            >
              <h4 className="font-bold text-foreground mb-3">Home</h4>
            </Link>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Über Uns
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/story"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Unsere Story
                </Link>
              </li>
            </ul>
          </div>
          {/* Spalte 3: Kategorien wie im Header, mit 'Alle Produkte' Link oben */}
          <div className="text-center md:text-left">
            <Link
              href="/shop"
              className="font-bold text-foreground mb-3 block hover:text-primary hover:underline transition-colors"
            >
              Alle Produkte
            </Link>
            <ul className="space-y-2 text-sm">
              <li>
                <CategoryDropdown label="Alter">
                  <Link
                    href="/junior"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Junior
                  </Link>
                  <Link
                    href="/adult"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Adult
                  </Link>
                  <Link
                    href="/senior"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Senior
                  </Link>
                </CategoryDropdown>
              </li>
              <li>
                <CategoryDropdown label="Fleischsorte">
                  <Link
                    href="/shop?meat=ente"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Ente
                  </Link>
                  <Link
                    href="/shop?meat=rind"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Rind
                  </Link>
                  <Link
                    href="/shop?meat=kaninchen"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Kaninchen
                  </Link>
                  <Link
                    href="/shop?meat=lamm"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Lamm
                  </Link>
                  <Link
                    href="/shop?meat=pferd"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Pferd
                  </Link>
                  <Link
                    href="/shop?meat=wild"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Wild
                  </Link>
                  <Link
                    href="/shop?meat=lachs"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Lachs
                  </Link>
                </CategoryDropdown>
              </li>
              <li>
                <CategoryDropdown label="Spezialfutter">
                  <Link
                    href="/shop?specials=diat"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Diätfutter
                  </Link>
                  <Link
                    href="/shop?specials=hypoallergen"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Hypoallergen
                  </Link>
                  <Link
                    href="/shop?specials=darm"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Darmgesundheit
                  </Link>
                  <Link
                    href="/shop?specials=gelenk"
                    className="block px-4 py-1 hover:text-primary hover:underline transition-colors"
                  >
                    Gelenkfit
                  </Link>
                </CategoryDropdown>
              </li>
            </ul>
          </div>
          {/* Spalte 4: Beratung */}
          <div className="text-center md:text-left">
            <Link
              href="/beratung"
              className="hover:text-primary hover:underline transition-colors"
            >
              <h4 className="font-bold text-foreground mb-3">Beratung</h4>
            </Link>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/beratung"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  KI-Futterberater
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Logo und Trennlinie */}
        <div className="container max-w-7xl mt-20 mb-4">
          <div className="flex justify-between items-center mb-2">
            {/* Logo Links */}
            <Link href="/" className="cursor-pointer">
              <Image
                src="/images/Logo_example_6.png"
                alt="Elite Dog Treats"
                width={180}
                height={36}
                className="h-auto w-auto"
                priority={false}
              />
            </Link>
            {/* Zahlungsmethoden Rechts */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-foreground mr-2">
                Sichere Zahlung mit:
              </div>
              <div className="flex items-center gap-2">
                {/* Visa */}
                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                  <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="4" fill="white" />
                    <path
                      d="M20.5 11h-3.2L14 21h2l.6-2h2.8l.3 2h2.3l-1.5-10zm-2.8 6l1-5 .5 5h-1.5zm6.8-6h-2l-2 10h2l2-10zm5 0h-1.8l-2.5 10h2l.5-2h2.4l.4 2h2l-3-10zm-.3 6h-1.5l.8-4 .7 4zm7.3-6h-2.2l-1 10h2l.4-4 1.5 4h2l-2-5.5 1.5-4.5h-2l-1 4-.2-4z"
                      fill="#1434CB"
                    />
                  </svg>
                </div>
                {/* Mastercard */}
                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                  <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="4" fill="white" />
                    <circle cx="18" cy="16" r="7" fill="#EB001B" />
                    <circle cx="30" cy="16" r="7" fill="#F79E1B" />
                    <path
                      d="M24 11.5a7 7 0 000 9 7 7 0 000-9z"
                      fill="#FF5F00"
                    />
                  </svg>
                </div>
                {/* PayPal */}
                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                  <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="4" fill="white" />
                    <path
                      d="M19 10h-3l-2 12h2l.5-3h2c2 0 3.5-1.5 3.5-3.5 0-2.5-1.5-5.5-3-5.5zm-.5 6h-1.5l.5-3h1c1 0 1.5 1 1.5 1.5s-.5 1.5-1.5 1.5zm8.5-6h-3l-2 12h2l.5-3h2c2 0 3.5-1.5 3.5-3.5 0-2.5-1.5-5.5-3-5.5zm-.5 6h-1.5l.5-3h1c1 0 1.5 1 1.5 1.5s-.5 1.5-1.5 1.5z"
                      fill="#003087"
                    />
                    <path
                      d="M35 10h-2l-2 12h2l2-12zm-5 4l1-4h-2l-3 12h2l1-5c.5-1 1.5-2 2.5-2l.5-1z"
                      fill="#009CDE"
                    />
                  </svg>
                </div>
                {/* Klarna */}
                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                  <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="4" fill="white" />
                    <path
                      d="M14 10h2v12h-2V10zm5 0h2v5l3-5h2.5l-3.5 5.5 4 6.5h-2.5l-3-5v5h-2V10zm9 0v12h2v-4h1c2 0 3-1.5 3-4s-1-4-3-4h-3zm2 2h1c1 0 1.5.5 1.5 2s-.5 2-1.5 2h-1v-4z"
                      fill="#FFB3C7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20"></div>
        </div>
        {/* Footer Bottom: Sprache links, Rechtliche Links rechts */}
        <div className="container max-w-7xl mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Sprachwahl Links */}
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                aria-label="Sprache ändern"
              >
                <span className="text-xl">
                  {langOptions.find((l) => l.code === selectedLang)?.flag}
                </span>
                <span className="text-sm">
                  {langOptions.find((l) => l.code === selectedLang)?.label}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform cursor-pointer text-accent ${
                    langOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow-lg z-10 min-w-[120px]">
                  {langOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.code as "de" | "en");
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        selectedLang === lang.code
                          ? "font-bold text-primary"
                          : "text-foreground"
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Rechtliche Links Rechts */}
            <div className="flex items-center gap-2 md:gap-3 text-sm flex-wrap justify-center md:justify-end">
              <Link
                href="/impressum"
                className="hover:text-primary hover:underline transition-colors"
              >
                Impressum
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link
                href="/datenschutz"
                className="hover:text-primary hover:underline transition-colors"
              >
                Datenschutz
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link
                href="/agb"
                className="hover:text-primary hover:underline transition-colors"
              >
                AGB
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link
                href="/widerruf"
                className="hover:text-primary hover:underline transition-colors"
              >
                Widerruf
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link
                href="/cookieeinstellungen"
                className="hover:text-primary hover:underline transition-colors"
              >
                Cookie-Einstellungen
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-foreground font-light">
          &copy; {new Date().getFullYear()} EliteDogTreats-Shop. Alle Rechte
          vorbehalten.
        </div>
      </footer>
    </>
  );
}
