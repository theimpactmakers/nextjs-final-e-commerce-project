"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { user } = useAuth();

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

      <div className="container max-w-7xl grid grid-cols-2 md:grid-cols-3 gap-8">
        {/* Spalte 1: Über uns */}
        <div className="text-center md:text-center">
          <h4 className="font-bold text-foreground mb-3">Über Uns</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/story"
                className="hover:text-primary transition-colors"
              >
                Unsere Story
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-primary transition-colors"
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 2: Service */}
        <div className="text-center md:text-center">
          <h4 className="font-bold text-foreground mb-3">Kundenservice</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className="hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 3: Zahlung */}
        <div className="flex flex-col items-center text-center">
          <h4 className="font-bold text-foreground mb-3">Zahlung</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/zahlung-versand"
                className="hover:text-primary transition-colors"
              >
                Zahlung & Versand
              </Link>
            </li>
            <li>
              <Link
                href="/retouren"
                className="hover:text-primary transition-colors"
              >
                Retouren & Rückgabe
              </Link>
            </li>
            <li>
              <Link
                href="/zahlungsarten"
                className="hover:text-primary transition-colors"
              >
                Zahlungsmethoden
              </Link>
            </li>
            <li>
              <Link
                href="/lieferzeiten"
                className="hover:text-primary transition-colors"
              >
                Lieferzeiten
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Trennlinie */}
      <div className="container max-w-7xl mt-8 mb-8">
        <div className="border-t border-muted-foreground/20"></div>
      </div>

      {/* Rechtliche Links horizontal über dem Logo */}
      <div className="flex justify-center items-center gap-4 md:gap-6 text-sm mb-8 flex-wrap">
        <Link
          href="/impressum"
          className="hover:text-primary transition-colors"
        >
          Impressum
        </Link>
        <span className="text-muted-foreground/40">|</span>
        <Link
          href="/datenschutz"
          className="hover:text-primary transition-colors"
        >
          Datenschutz
        </Link>
        <span className="text-muted-foreground/40">|</span>
        <Link href="/agb" className="hover:text-primary transition-colors">
          AGB`s
        </Link>
        <span className="text-muted-foreground/40">|</span>
        <Link
          href="/cookieeinstellungen"
          className="hover:text-primary transition-colors"
        >
          Cookie-Einstellungen
        </Link>
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
      <div className="mt-4 text-center text-xs text-foreground">
        Alle Rechte vorbehalten. &copy; {new Date().getFullYear()} Elite Dog
        Treats Shop.
      </div>
    </footer>
  );
}
