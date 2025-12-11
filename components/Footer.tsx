"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

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
        className="w-full flex items-center justify-start text-foreground font-normal focus:outline-none hover:text-primary transition-colors cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`cat-dropdown-${label}`}
      >
        <span className="flex items-center">
          {label}
          <span
            className={`ml-2 h-5 w-5 flex items-center justify-center transition-transform ${
              open ? "rotate-180 text-primary" : "text-foreground"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
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

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "validation"
  >("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus("validation");
      setFeedback("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus("validation");
      setFeedback("Bitte überprüfe deine E-Mail-Adresse.");
      return;
    }

    try {
      setStatus("loading");
      setFeedback("");

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setFeedback(
          result?.error || "Leider hat das Speichern nicht funktioniert."
        );
        return;
      }

      setEmail("");
      setStatus("success");
      setFeedback("Danke! Wir haben dich erfolgreich eingetragen.");
    } catch (error) {
      console.error("Newsletter submission failed", error);
      setStatus("error");
      setFeedback(
        "Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut."
      );
    }
  };

  return (
    <section className="w-full relative overflow-visible mt-32 sm:mt-4 md:mt-24">
      {/* Brauner Hintergrund - volle Breite */}
      <div className="w-full bg-primary pt-6 sm:pt-8 md:pt-4 lg:pt-6 px-6 sm:px-8 lg:px-12 pb-0 overflow-visible">
        <div className="container max-w-7xl flex flex-col md:flex-row items-center md:items-center justify-between gap-6 sm:gap-8 md:gap-8 lg:gap-10 relative overflow-visible md:h-56 lg:h-60">
          {/* Bild - auf mobil unten, auf desktop links mit überstehenden Kopf */}
          <div className="order-2 md:order-1 shrink-0 relative w-[140px] sm:w-40 md:w-[300px] lg:w-[360px] h-[140px] sm:h-40 md:h-[360px] lg:h-[420px] mb-0 md:self-end overflow-visible">
            <Image
              src="/images/footer-dogs.webp"
              alt="Hunde"
              fill
              sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 300px, 360px"
              className="object-contain object-bottom"
              priority
            />
          </div>
          {/* Text und Formular - auf mobil oben, auf desktop rechts und vertikal zentriert */}
          <div className="order-1 md:order-2 flex-1 max-w-xl flex flex-col justify-center items-center w-full px-4 sm:px-0">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 mt-2 sm:mb-3 md:mb-4 text-white/90 text-center">
              Werde Teil unserer Community
            </h2>

            <div className="text-xs xs:text-sm sm:text-base md:text-sm lg:text-lg text-black/90 mb-3 sm:mb-4 md:mb-5 text-center">
              Abonniere unseren Newsletter und verpasse keine Neuigkeiten!
            </div>
            <form
              className="flex flex-col sm:flex-row w-full max-w-md gap-3 sm:gap-0 sm:relative"
              onSubmit={handleSubmit}
              noValidate
            >
              <input
                type="email"
                placeholder="Jetzt zum Newsletter anmelden..."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="flex-1 w-full px-4 py-2.5 sm:pr-32 text-xs sm:text-sm md:text-base border border-gray-300 rounded-(--app-radius) sm:rounded-full focus:outline-none bg-white"
                aria-label="Newsletter abonnieren"
                aria-invalid={status === "error" || status === "validation"}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={status === "loading"}
                className="w-32 mx-auto sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 sm:rounded-full sm:hover:translate-x-1 sm:hover:translate-y-[-50%] text-xs sm:text-sm md:text-base px-4 py-2.5 sm:py-1.5"
              >
                {status === "loading" ? "Wird gesendet..." : "Abonnieren"}
              </Button>
            </form>
            {!!feedback && (
              <p
                className={`mt-3 w-full text-xs xs:text-sm sm:text-base md:text-lg text-center ${
                  status === "success" ? "text-white" : "text-red-100"
                }`}
                role="status"
                aria-live="polite"
              >
                {feedback}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-white mt-6 mb-4">
              <Link
                href="https://www.facebook.com"
                aria-label="Facebook"
                className="text-white hover:text-black hover:animate-pulse hover:scale-110 transform transition-all duration-300 ease-in-out active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="currentColor"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6v-2.3c0-2.57 1.54-3.99 3.9-3.99 1.13 0 2.32.2 2.32.2v2.55h-1.31c-1.29 0-1.7.8-1.7 1.62V12h2.9l-.46 2.88h-2.44v6.99A10 10 0 0 0 22 12Z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com"
                aria-label="Instagram"
                className="text-white hover:text-black hover:animate-pulse hover:scale-110 transform transition-all duration-300 ease-in-out active:scale-95 -mb-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="currentColor"
                >
                  <path d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3Zm0 7.74A3.04 3.04 0 1 1 15.05 12 3.04 3.04 0 0 1 12 15.04Zm6.18-7.98a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1ZM20.9 7a5.05 5.05 0 0 0-1.35-3.6 5.05 5.05 0 0 0-3.6-1.35c-1.42-.08-5.68-.08-7.1 0a5.05 5.05 0 0 0-3.6 1.35A5.05 5.05 0 0 0 3.9 7c-.08 1.42-.08 5.68 0 7.1a5.05 5.05 0 0 0 1.35 3.6 5.05 5.05 0 0 0 3.6 1.35c1.42.08 5.68.08 7.1 0a5.05 5.05 0 0 0 3.6-1.35 5.05 5.05 0 0 0 1.35-3.6c.08-1.42.08-5.68 0-7.1Zm-2 8.65a3.23 3.23 0 0 1-1.82 1.82c-1.26.5-4.24.39-5.08.39s-3.82.11-5.08-.39a3.23 3.23 0 0 1-1.82-1.82c-.5-1.26-.39-4.24-.39-5.08s-.11-3.82.39-5.08a3.23 3.23 0 0 1 1.82-1.82c1.26-.5 4.24-.39 5.08-.39s3.82-.11 5.08.39a3.23 3.23 0 0 1 1.82 1.82c.5 1.26.39 4.24.39 5.08s.11 3.82-.39 5.08Z" />
                </svg>
              </Link>
              <Link
                href="https://www.x.com"
                aria-label="X"
                className="text-white hover:text-black hover:animate-pulse hover:scale-110 transform transition-all duration-300 ease-in-out active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="currentColor"
                >
                  <path d="M3 3h4.6l4.2 6.2L16.6 3H21l-7 8.6L21 21h-4.6l-4.4-6.4L7.4 21H3l7-8.4L3 3Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
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
      <NewsletterSection />
      {/* Footer-Bereich mit Navigation, Links und Copyright */}
      <footer className="w-full border-t bg-muted py-12 text-muted-foreground">
        <div className="container max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-56 justify-between">
            {/* Spalte 1: Shop */}
            <div className="text-left flex flex-col items-start w-full">
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
            <div className="text-left flex flex-col items-start w-full">
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
            <div className="text-left flex flex-col items-start w-full">
              <Link
                href="/shop"
                className="font-bold text-foreground mb-3 block hover:text-primary hover:underline transition-colors"
              >
                Alle Produkte
              </Link>
              <ul className="space-y-2 text-sm w-full">
                <li>
                  <CategoryDropdown label="Alter">
                    <Link
                      href="/junior"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Junior
                    </Link>
                    <Link
                      href="/adult"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Adult
                    </Link>
                    <Link
                      href="/senior"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Senior
                    </Link>
                  </CategoryDropdown>
                </li>
                <li>
                  <CategoryDropdown label="Fleischsorte">
                    <Link
                      href="/shop?meat=ente"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Ente
                    </Link>
                    <Link
                      href="/shop?meat=rind"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Rind
                    </Link>
                    <Link
                      href="/shop?meat=kaninchen"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Kaninchen
                    </Link>
                    <Link
                      href="/shop?meat=lamm"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Lamm
                    </Link>
                    <Link
                      href="/shop?meat=pferd"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Pferd
                    </Link>
                    <Link
                      href="/shop?meat=wild"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Wild
                    </Link>
                    <Link
                      href="/shop?meat=lachs"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Lachs
                    </Link>
                  </CategoryDropdown>
                </li>
                <li>
                  <CategoryDropdown label="Spezialfutter">
                    <Link
                      href="/specials"
                      className="block px-4 py-1 hover:text-primary hover:underline transition-colors text-left"
                    >
                      - Übersicht
                    </Link>
                  </CategoryDropdown>
                </li>
              </ul>
            </div>
            {/* Spalte 4: Beratung */}
            <div className="text-left flex flex-col items-start w-full">
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
          <div className="mt-20 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-2 gap-4">
              {/* Logo Links - zentriert auf mobil */}
              <Link href="/" className="cursor-pointer order-1 md:order-0">
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
              <div className="flex items-center gap-3 order-2 md:order-0">
                <div className="text-xs font-semibold text-foreground mr-2 block">
                  Sichere Zahlung mit:
                </div>
                <div className="flex items-center gap-2">
                  {/* Kreditkarte */}
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <Image
                      src="/images/payment/creditcard.png"
                      alt="Kreditkarte"
                      width={40}
                      height={25}
                      className="h-5 w-auto"
                    />
                  </div>
                  {/* PayPal */}
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <Image
                      src="/images/payment/paypal.png"
                      alt="PayPal"
                      width={40}
                      height={25}
                      className="h-5 w-auto"
                    />
                  </div>
                  {/* Klarna */}
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <Image
                      src="/images/payment/klarna.webp"
                      alt="Klarna"
                      width={40}
                      height={25}
                      className="h-5 w-auto"
                    />
                  </div>
                  {/* SEPA */}
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <Image
                      src="/images/payment/sepa.jpg"
                      alt="SEPA"
                      width={40}
                      height={25}
                      className="h-5 w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-muted-foreground/20"></div>
          </div>
          {/* Footer Bottom: Sprache links, Rechtliche Links rechts */}
          <div className="mb-10">
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
        </div>
      </footer>
    </>
  );
}
