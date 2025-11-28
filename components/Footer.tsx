"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [fleischsortenOpen, setFleischsortenOpen] = useState(false);
  const [spezialfutterOpen, setSpezialfutterOpen] = useState(false);
  const [alterOpen, setAlterOpen] = useState(false);

  return (
    <footer className="w-full border-t bg-muted mt-16 py-12 text-muted-foreground px-6 sm:px-8 lg:px-12">
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

        {/* Spalte 3: Alle Produkte */}
        <div className="text-center md:text-left">
          <Link
            href="/shop"
            className="hover:text-primary hover:underline transition-colors"
          >
            <h4 className="font-bold text-foreground mb-3">Alle Produkte</h4>
          </Link>
          <ul className="space-y-0 text-sm">
            <li>
              <button
                onClick={() => setSpezialfutterOpen(!spezialfutterOpen)}
                className="inline-flex items-center hover:text-primary transition-colors cursor-pointer"
              >
                <span>Spezialfutter</span>
                <span className="text-lg ml-2">
                  {spezialfutterOpen ? "−" : "+"}
                </span>
              </button>
              {spezialfutterOpen && (
                <ul className="mt-2 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/shop?specials=diat"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Diät</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?specials=hypoallergen"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Hypoallergen</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?specials=darm"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Darm</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?specials=gelenk"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Gelenk</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setAlterOpen(!alterOpen)}
                className="inline-flex items-center hover:text-primary transition-colors cursor-pointer"
              >
                <span>Alter</span>
                <span className="text-lg ml-2">{alterOpen ? "−" : "+"}</span>
              </button>
              {alterOpen && (
                <ul className="mt-2 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/junior"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Junior</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/adult"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Adult</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/senior"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Senior</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setFleischsortenOpen(!fleischsortenOpen)}
                className="inline-flex items-center hover:text-primary transition-colors cursor-pointer"
              >
                <span>Fleischsorten</span>
                <span className="text-lg ml-2">
                  {fleischsortenOpen ? "−" : "+"}
                </span>
              </button>
              {fleischsortenOpen && (
                <ul className="mt-2 ml-6 space-y-1">
                  <li>
                    <Link
                      href="/shop?meat=ente"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Ente</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=rind"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Rind</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=kaninchen"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Kaninchen</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=lamm"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Lamm</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=pferd"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Pferd</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=wild"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Wild</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=lachs"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Lachs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?meat=huhn"
                      className="hover:text-primary hover:underline transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>−</span>
                      <span>Huhn</span>
                    </Link>
                  </li>
                </ul>
              )}
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
                  <path d="M24 11.5a7 7 0 000 9 7 7 0 000-9z" fill="#FF5F00" />
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
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
              aria-label="Sprache ändern"
            >
              <span className="text-xl">🇩🇪</span>
              <span className="text-sm">Deutsch</span>
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
                  languageDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Language Dropdown */}
            {languageDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white/98 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-lg p-2 z-50">
                <button
                  onClick={() => setLanguageDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm cursor-pointer"
                >
                  🇩🇪 Deutsch
                </button>
                <button
                  onClick={() => setLanguageDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm cursor-pointer"
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          {/* Rechtliche Links Rechts */}
          <div className="flex items-center gap-4 md:gap-6 text-sm flex-wrap justify-center md:justify-end">
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
  );
}
