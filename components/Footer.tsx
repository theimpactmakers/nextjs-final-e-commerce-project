"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Footer() {
  const { user } = useAuth();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  return (
    <footer className="w-full border-t bg-muted mt-16 py-12 text-muted-foreground px-6 sm:px-8 lg:px-12">
      {/* Debug User Info - nur zum Testen */}
      {user && (
        <div className="container max-w-7xl mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-semibold text-primary mb-1">
            🟢 Angemeldet als:
          </p>
          <p className="text-xs text-foreground">
            <strong>Email:</strong> {user.email}
          </p>
          {user.user_metadata?.first_name && (
            <p className="text-xs text-foreground">
              <strong>Name:</strong> {user.user_metadata.first_name}{" "}
              {user.user_metadata.last_name}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            User ID: {user.id}
          </p>
        </div>
      )}

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
                href="/shop"
                className="hover:text-primary hover:underline transition-colors"
              >
                Alle Produkte
              </Link>
            </li>
            <li>
              <Link
                href="/specials"
                className="hover:text-primary hover:underline transition-colors"
              >
                Spezialfutter
              </Link>
            </li>
            <li>
              <Link
                href="/junior"
                className="hover:text-primary hover:underline transition-colors"
              >
                Junior
              </Link>
            </li>
            <li>
              <Link
                href="/adult"
                className="hover:text-primary hover:underline transition-colors"
              >
                Adult
              </Link>
            </li>
            <li>
              <Link
                href="/senior"
                className="hover:text-primary hover:underline transition-colors"
              >
                Senior
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 2: Beratung */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-foreground mb-3">Futterberatung</h4>
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
                Beratung
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-primary hover:underline transition-colors"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 3: Kundenservice */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-foreground mb-3">Kundenservice</h4>
          <ul className="space-y-2 text-sm">
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

        {/* Spalte 4: Über Uns & Rechtliches */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-foreground mb-3">Über Uns</h4>
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
                href="/story"
                className="hover:text-primary hover:underline transition-colors"
              >
                Unsere Story
              </Link>
            </li>
          </ul>

          <h4 className="font-bold text-foreground mb-3 mt-6">Rechtliches</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/impressum"
                className="hover:text-primary hover:underline transition-colors"
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="hover:text-primary hover:underline transition-colors"
              >
                Datenschutz
              </Link>
            </li>
            <li>
              <Link
                href="/agb"
                className="hover:text-primary hover:underline transition-colors"
              >
                AGB
              </Link>
            </li>
            <li>
              <Link
                href="/widerruf"
                className="hover:text-primary hover:underline transition-colors"
              >
                Widerruf
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Trennlinie */}
      <div className="container max-w-7xl mt-12 mb-4">
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
              Cookies
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Image
          src="/images/Logo_example_6.png"
          alt="Elite Dog Treats"
          width={120}
          height={24}
          className="h-auto w-auto"
          priority={false}
        />
      </div>
      <div className="mt-4 text-center text-xs text-foreground font-light">
        &copy; {new Date().getFullYear()} EliteDogTreats-Shop. Alle Rechte
        vorbehalten.
      </div>
    </footer>
  );
}
