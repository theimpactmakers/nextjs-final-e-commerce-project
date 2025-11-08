"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <nav className="hidden md:flex md:gap-4 font-medium justify-center col-start-2 whitespace-nowrap overflow-hidden">
          <Link href="/shop" className="hover:text-primary transition-colors">
            Hundefutter
          </Link>
          <Link
            href="/beratung"
            className="hover:text-primary transition-colors"
          >
            Specials
          </Link>
          <Link
            href="/beratung"
            className="hover:text-primary transition-colors"
          >
            Beratung
          </Link>

          <Link href="/blog" className="hover:text-primary transition-colors">
            Mehr 
          </Link>

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

          {/* Hamburger menu (no functionality yet) */}
          <button
            aria-label="Öffne Menü"
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
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
