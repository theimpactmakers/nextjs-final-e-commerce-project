"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300  ${
        isScrolled
          ? "backdrop-blur bg-[hsl(var(--muted)/0.6)] shadow-md"
          : "bg-transparent"
      }`}
    >
      {/* Hauptnavigation & Logo - HÖHE IST H:20 */}
      <div className="container mx-auto px-2 sm:px-6 md:px-8 lg:px-16 grid grid-cols-[auto_1fr_auto] items-center h-20">
        <Link href="/" className="flex items-center gap-3 col-start-1">
          <Image
            src="/images/Logo_example_6.png"
            alt="Elite Tail Treats"
            width={72}
            height={30}
            priority
            className="block w-20 sm:w-20 md:w-24"
            style={{ height: "auto" }}
          />
        </Link>

        {/* 2. Hauptmenü Links (zentriert auf md+) */}
        <nav className="hidden md:flex md:gap-6 lg:gap-8 font-medium justify-center col-start-2 whitespace-nowrap overflow-visible">
          {/* Hundefutter mit Dropdown */}
          <div className="relative group inline-block">
            <Link
              href="/shop"
              className="relative inline-flex items-center h-10 px-2 hover:text-primary transition-colors"
            >
              Hundefutter
              {/* animated underline */}
              <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 rounded"></span>
            </Link>

            <div
              role="menu"
              aria-label="Hundefutter Menü"
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 pointer-events-auto bg-white/95 dark:bg-slate-900/95 text-foreground border border-[hsl(var(--border))] rounded-xl shadow-xl p-4 z-50"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold mb-2">Alter</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <Link
                        href="/shop?age=junior"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Junior
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?age=adult"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Adult
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?age=senior"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Senior
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold mb-2">Fleischsorten</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <Link
                        href="/shop?meat=ente"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Ente
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?meat=rind"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Rind
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?meat=kaninchen"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Kaninchen
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?meat=lamm"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Lamm
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?meat=pferd"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Pferd
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?meat=wild"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Wild
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?meat=lachs"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        Lachs
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Specials mit Dropdown */}
          <div className="relative group inline-block">
            <Link
              href="/specials"
              className="relative inline-flex items-center h-10 px-2 hover:text-primary transition-colors"
            >
              Specials
              <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 rounded"></span>
            </Link>

            <div
              role="menu"
              aria-label="Specials Menü"
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 pointer-events-auto bg-white/95 dark:bg-slate-900/95 text-foreground border border-[hsl(var(--border))] rounded-xl shadow-xl p-3 z-50"
            >
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/specials/diat"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    Diätfutter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/specials/hypoallergen"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    Hypoallergen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/specials/darmgesundheit"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    Darmgesundheit
                  </Link>
                </li>
                <li>
                  <Link
                    href="/specials/gelenkfit"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    Gelenkfit
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/beratung"
            className="relative inline-flex items-center h-10 px-2 hover:text-primary transition-colors"
          >
            Beratung
            <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-accent origin-left scale-x-0 hover:scale-x-100 transform transition-transform duration-300 rounded"></span>
          </Link>

          <div className="relative group inline-block">
            <button className="relative inline-flex items-center h-10 gap-2 hover:text-primary transition-colors px-2 py-2 align-middle">
              <span>Mehr</span>
              <svg
                className="w-3 h-3 transition-transform duration-150 group-hover:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M8 5l8 7-8 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 rounded"></span>
            </button>

            <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 pointer-events-auto bg-white/95 dark:bg-slate-900/95 text-foreground border border-[hsl(var(--border))] rounded-xl shadow-xl p-3 z-50">
              <li className="py-1">
                <Link
                  href="/contact"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/about"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  Über Uns
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/impressum"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/datenschutz"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/agb"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  AGB
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/zahlung-versand"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  Zahlung & Versand
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/widerruf"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  Widerruf
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* 3. Aktionen */}
        {/* Desktop: Anmeldung + Warenkorb */}
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium justify-end col-start-3">
          {/* Anmelden / Login */}
          <Link
            href="/auth/login"
            className="hover:text-primary transition-colors"
          >
            Anmelden
          </Link>

          {/* Warenkorb */}
          <Link
            href="/cart"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            {/* Platzhalter für Warenkorb-Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-cart"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
            </svg>
            (0)
          </Link>
        </div>

        {/* Mobile: nur Icon-Warenkorb mit Anzahl, Login-Icon und Hamburger */}
        <div className="flex md:hidden items-center space-x-3 justify-end col-start-3">
          {/* Cart icon with badge */}
          <Link
            href="/cart"
            className="relative p-1 rounded hover:bg-accent/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-cart"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
            </svg>
            <span className="ml-2 sr-only">Warenkorb</span>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center bg-accent text-accent-foreground text-xs rounded-full px-2">
              0
            </span>
          </Link>

          {/* Login icon */}
          <Link href="/auth/login" className="p-1 rounded hover:bg-accent/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="sr-only">Anmelden</span>
          </Link>

          {/* Hamburger menu */}
          <button
            aria-label={mobileOpen ? "Schließe Menü" : "Öffne Menü"}
            onClick={() => setMobileOpen((s) => !s)}
            className="p-1 rounded hover:bg-accent/10"
          >
            {mobileOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center"
              >
                <Image
                  src="/images/Logo_example_6.png"
                  alt="Elite"
                  width={120}
                  height={36}
                  className="h-auto w-auto"
                />
              </Link>
              <button
                aria-label="Schließe Menü"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded hover:bg-accent/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <nav className="space-y-4">
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-primary"
              >
                Hundefutter
              </Link>
              <div className="pl-3">
                <Link
                  href="/shop?age=junior"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Junior
                </Link>
                <Link
                  href="/shop?age=adult"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Adult
                </Link>
                <Link
                  href="/shop?age=senior"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Senior
                </Link>
              </div>

              <Link
                href="/specials"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-primary"
              >
                Specials
              </Link>
              <div className="pl-3">
                <Link
                  href="/specials/diat"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Diätfutter
                </Link>
                <Link
                  href="/specials/hypoallergen"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Hypoallergen
                </Link>
                <Link
                  href="/specials/darmgesundheit"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Darmgesundheit
                </Link>
                <Link
                  href="/specials/gelenkfit"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-primary"
                >
                  Gelenkfit
                </Link>
              </div>

              <Link
                href="/beratung"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-primary"
              >
                Beratung
              </Link>

              <Link
                href="/impressum"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-primary"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-primary"
              >
                Datenschutz
              </Link>
              <Link
                href="/agb"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-primary"
              >
                AGB
              </Link>
              <Link
                href="/zahlung-versand"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-primary"
              >
                Zahlung & Versand
              </Link>
              <Link
                href="/widerruf"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-primary"
              >
                Widerruf
              </Link>

              <div className="pt-4 border-t mt-4">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium hover:text-primary"
                >
                  Anmelden
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm mt-2 hover:text-primary"
                >
                  Warenkorb (0)
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
