"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn, LogOut } from "lucide-react";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Erstelle Login-URL mit aktuellem Pfad als redirect
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;

  // Handler für Hover mit Delay (nur für Desktop)
  const handleMouseEnter = () => {
    // Nur auf Desktop (Bildschirmbreite > 768px) Hover aktivieren
    if (window.innerWidth >= 768) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setProfileDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Nur auf Desktop (Bildschirmbreite > 768px) Hover aktivieren
    if (window.innerWidth >= 768) {
      hoverTimeoutRef.current = setTimeout(() => {
        setProfileDropdownOpen(false);
      }, 300);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileDropdownOpen]);

  useEffect(() => {
    const onScroll = () => {
      // Scroll handler can be used for future features
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
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
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 bg-muted/80 backdrop-blur-md`}
      >
        {/* very soft, minimal blurred gradient at bottom (single subtle band) */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-4 md:h-4 lg:h-6 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(81,52,49,0.06) 0%, rgba(122,77,63,0.04) 50%, rgba(56,31,28,0.06) 100%)",
            filter: "blur(12px)",
            opacity: 0.95,
          }}
        />

        {/* Hauptnavigation & Logo */}
        <div className="relative z-10 w-full mx-auto px-2 sm:px-3 md:px-6 lg:px-8 max-w-full grid grid-cols-[minmax(44px,auto)_1fr_minmax(44px,auto)] items-center h-16 md:h-20">
          {/* Mobile: search icon on the left */}
          <button
            aria-label="Suche"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="col-start-1 md:hidden p-1 rounded text-accent cursor-pointer group"
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
              className="lucide lucide-search transition-all duration-200 group-hover:scale-90 group-hover:stroke-black group-active:scale-85"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link
            href="/"
            className={`col-start-2 justify-center md:col-start-1 md:justify-start flex items-center gap-3 z-30 shrink-0 min-w-[72px] mt-1 md:mt-2 ${
              mobileOpen ? "min-w-12" : ""
            } logo-md-narrow`}
          >
            <Image
              src="/images/Logo_example_6.png"
              alt="Elite Tail Treats"
              width={120}
              height={48}
              priority
              className={`block w-24 sm:w-24 md:w-24 lg:w-28 transition-all duration-150 ${
                mobileOpen ? "w-12 sm:w-14" : ""
              }`}
              style={{
                height: "auto",
              }}
            />
          </Link>
          {/* 2. Hauptmenü Links (zentriert auf md+) */}
          <nav className="hidden md:flex md:gap-1 lg:gap-2 text-sm font-medium justify-center col-start-2 whitespace-nowrap overflow-visible">
            {/* Home Link */}
            <div className="relative group inline-block">
              <Link
                href="/"
                className="relative inline-flex items-center h-9 px-2 transition-colors text-foreground hover:text-[hsl(33,100%,37%)]!"
              >
                Home
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(33 100% 37%) 0%, hsl(38 100% 50%) 50%, hsl(33 100% 37%) 100%)",
                  }}
                ></span>
              </Link>
            </div>

            {/* Shop Link mit Dropdown */}
            <div className="relative group inline-block">
              <Link
                href="/shop"
                className="relative inline-flex items-center h-9 px-2 transition-colors text-foreground hover:text-[hsl(33,100%,37%)]!"
              >
                Shop
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(33 100% 37%) 0%, hsl(38 100% 50%) 50%, hsl(33 100% 37%) 100%)",
                  }}
                ></span>
              </Link>

              <div
                role="menu"
                aria-label="Shop Menü"
                className="absolute left-0 top-full mt-0 w-72 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/98 backdrop-blur-sm text-foreground border border-gray-200/30 rounded-md shadow-sm p-4 z-50"
              >
                {/* Alle Produkte Link */}
                <div className="mb-3">
                  <Link
                    href="/shop"
                    className="block rounded-md px-3 pt-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors text-sm font-medium"
                  >
                    Alle Produkte
                  </Link>
                </div>

                {/* Trennlinie */}
                <div className="border-t border-gray-300 mb-3"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold mb-2 px-3">Alter</h4>
                    <div className="border-t border-gray-300 mb-2"></div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/junior"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Junior
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/adult"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Adult
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/senior"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Senior
                        </Link>
                      </li>
                    </ul>

                    <div className="border-t border-gray-300 my-3"></div>
                    <h4 className="text-xs font-semibold mb-2 px-3">
                      Specials
                    </h4>
                    <div className="border-t border-gray-300 mb-2"></div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/shop?specials=diat"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Diätfutter
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?specials=hypoallergen"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Hypoallergen
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?specials=darm"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Darmgesundheit
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?specials=gelenk"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Gelenkfit
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold mb-2 px-3">
                      Fleischsorten
                    </h4>
                    <div className="border-t border-gray-300 mb-2"></div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/shop?meat=ente"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Ente
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?meat=rind"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Rind
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?meat=kaninchen"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Kaninchen
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?meat=lamm"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Lamm
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?meat=pferd"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Pferd
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?meat=wild"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Wild
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?meat=lachs"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
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
                className="relative inline-flex items-center h-9 px-2 transition-colors text-foreground hover:text-[hsl(33,100%,37%)]!"
              >
                Spezialfutter
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(33 100% 37%) 0%, hsl(38 100% 50%) 50%, hsl(33 100% 37%) 100%)",
                  }}
                ></span>
              </Link>

              <div
                role="menu"
                aria-label="Specials Menü"
                className="absolute left-0 top-full mt-0 w-48 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/98 backdrop-blur-sm text-foreground border border-gray-200/30 rounded-md shadow-sm p-3 z-50"
              >
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      href="/specials/darm"
                      className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                    >
                      Diätfutter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/specials/hypoallergen"
                      className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                    >
                      Hypoallergen
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/specials/darmgesundheit"
                      className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                    >
                      Darmgesundheit
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/specials/gelenk"
                      className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                    >
                      Gelenkfit
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Beratung mit Dropdown */}
            <div className="relative group inline-block">
              <Link
                href="/beratung"
                className="relative inline-flex items-center h-9 px-2 transition-colors text-foreground hover:text-[hsl(33,100%,37%)]!"
              >
                Beratung
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(33 100% 37%) 0%, hsl(38 100% 50%) 50%, hsl(33 100% 37%) 100%)",
                  }}
                ></span>
              </Link>

              <div
                role="menu"
                aria-label="Beratung Menü"
                className="absolute left-0 top-full mt-0 w-48 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/98 backdrop-blur-sm text-foreground border border-gray-200/30 rounded-md shadow-sm p-3 z-50"
              >
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      href="/faq"
                      className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blogs"
                      className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group inline-block">
              <button className="relative inline-flex items-center h-9 gap-2 transition-colors px-2 py-2 align-middle text-foreground hover:text-[hsl(33,100%,37%)]!">
                <span>Mehr</span>
                <svg
                  className="w-3 h-3 transition-transform duration-150 group-hover:rotate-90 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M8 5l8 7-8 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(33 100% 37%) 0%, hsl(38 100% 50%) 50%, hsl(33 100% 37%) 100%)",
                  }}
                ></span>
              </button>

              <div className="absolute left-0 top-full mt-0 w-80 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/98 backdrop-blur-sm text-foreground border border-gray-200/30 rounded-md shadow-sm p-4 z-50">
                <div className="grid grid-cols-2 gap-4">
                  {/* Linke Spalte: Kundenservice */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 px-3">
                      Kundenservice
                    </h4>
                    <div className="border-t border-gray-300 mb-2"></div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/contact"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Kontakt
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/lieferzeiten"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Lieferzeiten
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/retouren"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Retouren
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/zahlung-versand"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Zahlung & Versand
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Rechte Spalte: Über Uns & Rechtliches */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 px-3">
                      Über Uns
                    </h4>
                    <div className="border-t border-gray-300 mb-2"></div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/about"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Über Uns
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/story"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Unsere Story
                        </Link>
                      </li>
                    </ul>

                    <div className="border-t border-gray-300 my-3"></div>
                    <h4 className="text-xs font-semibold mb-2 px-3">
                      Rechtliches
                    </h4>
                    <div className="border-t border-gray-300 mb-2"></div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/impressum"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Impressum
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/datenschutz"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Datenschutz
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/agb"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          AGB
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/widerruf"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Widerruf
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/cookieeinstellungen"
                          className="block rounded-md px-3 py-2 text-primary hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 transition-colors"
                        >
                          Cookies
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {/* 3. Aktionen */}
          {/* Desktop: Suche + Anmeldung + Warenkorb */}
          <div className="hidden md:flex items-center space-x-2 text-sm font-medium justify-end col-start-3">
            {/* Search (desktop) */}
            <SearchBar />
            {/* Profile Dropdown (Desktop) */}
            <div
              className="relative hide-md-narrow"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-1 rounded hover:bg-accent/10 text-accent transition-colors cursor-pointer"
                aria-label="Benutzerprofil"
              >
                <User className="w-5 h-5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white/98 backdrop-blur-sm border border-gray-200/30 rounded-md shadow-sm p-2 z-50">
                  {user && (
                    <Link
                      href="/userProfile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 text-foreground transition-colors"
                    >
                      <User className="w-4 h-4 text-accent" />
                      <span>User Profile</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-200/30 my-1"></div>

                  {user ? (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 text-foreground transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-accent" />
                      <span>Abmelden</span>
                    </button>
                  ) : (
                    <>
                      <Link
                        href={loginUrl}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md hover:bg-[hsl(var(--secondary))] hover:text-foreground decoration-accent decoration-2 hover:underline underline-offset-2 text-foreground transition-colors"
                      >
                        <LogIn className="w-4 h-4 text-accent" />
                        <span>Anmelden</span>
                      </Link>

                      <div className="border-t border-gray-300 my-2"></div>

                      <div className="px-4 py-2 text-xs text-center">
                        <span className="text-muted-foreground">
                          Noch kein Konto?{" "}
                        </span>
                        <Link
                          href="/auth/sign-up"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="text-accent hover:underline font-medium"
                        >
                          Registrieren
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Profile Icon - Narrow Screens */}
            {user ? (
              <button
                onClick={signOut}
                aria-label="Abmelden"
                className="show-md-narrow p-1 rounded hover:bg-accent/10 text-accent"
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
                  aria-hidden
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            ) : (
              <Link
                href={loginUrl}
                aria-label="Anmelden"
                className="show-md-narrow p-1 rounded hover:bg-accent/10 text-accent active:text-foreground transition-colors"
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
                  aria-hidden
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
            {/* Wishlist Icon */}
            <Link
              href="/userProfile?tab=wishlist"
              className="relative p-1 rounded hover:bg-accent/10 group"
              aria-label="Wunschliste"
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
                className="text-accent group-hover:text-red-500 transition-colors"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {/* Warenkorb */}
            <Link
              href="/cart"
              className="relative p-1 rounded hover:bg-accent/10 group"
              aria-label="Warenkorb"
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
                className="lucide lucide-shopping-cart text-accent group-hover:text-primary transition-colors"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          <div className="flex md:hidden items-center space-x-2 justify-end col-start-3">
            {/* Wishlist icon with badge */}
            <Link
              href="/userProfile?tab=wishlist"
              className="relative p-1 rounded hover:bg-accent/10 group"
              aria-label="Wunschliste"
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
                className="text-accent group-active:text-red-500 transition-colors"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-0.5 inline-flex items-center justify-center text-foreground text-[9px] rounded-full px-1 bg-transparent transition-colors">
                  ({wishlistCount})
                </span>
              )}
            </Link>
            {/* Cart icon with badge */}
            <Link
              href="/cart"
              className="relative p-1 rounded hover:bg-accent/10 group"
              aria-label="Warenkorb"
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
                className="lucide lucide-shopping-cart text-accent group-active:text-primary transition-colors"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-0.5 inline-flex items-center justify-center text-foreground text-[9px] rounded-full px-1 bg-transparent transition-colors">
                  ({itemCount})
                </span>
              )}
            </Link>
            {/* Login icon */}
            <Link
              href={loginUrl}
              className="p-1 rounded hover:bg-accent/10 text-accent active:text-foreground transition-colors"
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
              className="p-1 rounded hover:bg-accent/10 cursor-pointer text-foreground active:text-accent transition-colors relative w-[34px] h-[34px] flex items-center justify-center"
            >
              <div className="relative w-5 h-4 flex flex-col justify-center">
                <span
                  className={`absolute h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out ${
                    mobileOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out ${
                    mobileOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out ${
                    mobileOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Slide Down with Overlay */}
        {mobileSearchOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setMobileSearchOpen(false)}
            />
            {/* Search Bar */}
            <div className="relative md:hidden bg-muted/95 backdrop-blur-sm border-t border-gray-200/30 px-4 py-3 animate-in slide-in-from-top duration-200 z-50">
              <div className="relative max-w-full">
                <SearchBar
                  isMobile
                  onClose={() => setMobileSearchOpen(false)}
                />
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 z-100"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-muted p-6 overflow-auto shadow-2xl z-101">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center"
              >
                <Image
                  src="/images/Logo_example_6.png"
                  alt="Elite"
                  width={60}
                  height={18}
                  className="h-auto w-14 transition-all duration-150"
                  style={{
                    height: "auto",
                  }}
                />
              </Link>
              <button
                aria-label="Schließe Menü"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded hover:bg-accent/10 text-accent active:text-foreground transition-all duration-300 hover:rotate-90 active:rotate-180 cursor-pointer"
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
                  className="transition-transform duration-300"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-[hsl(var(--accent))]"
              >
                Hundefutter
              </Link>
              <div className="pl-3">
                <Link
                  href="/junior"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Junior
                </Link>
                <Link
                  href="/adult"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Adult
                </Link>
                <Link
                  href="/senior"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Senior
                </Link>
              </div>
              <Link
                href="/specials"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-[hsl(var(--accent))]"
              >
                Spezialfutter
              </Link>
              <div className="pl-3 space-y-1">
                <Link
                  href="/specials/diat"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Diätfutter
                </Link>
                <Link
                  href="/specials/hypoallergen"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Hypoallergen
                </Link>
                <Link
                  href="/specials/darmgesundheit"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Darmgesundheit
                </Link>
                <Link
                  href="/specials/gelenkfit"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  Gelenkfit
                </Link>
              </div>
              <div>
                <Link
                  href="/beratung"
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium hover:text-[hsl(var(--accent))]"
                >
                  Beratung
                </Link>
              </div>
              <Link
                href="/impressum"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                Datenschutz
              </Link>
              <Link
                href="/agb"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                AGB
              </Link>
              <Link
                href="/zahlung-versand"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                Zahlung & Versand
              </Link>
              <Link
                href="/widerruf"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                Widerruf
              </Link>
              <div className="pt-4 border-t mt-4">
                {/* Mobile Login/Logout Link - MIT REDIRECT */}
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="block text-sm font-medium hover:text-[hsl(var(--accent))] w-full text-left"
                  >
                    Abmelden
                  </button>
                ) : (
                  <Link
                    href={loginUrl}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium hover:text-[hsl(var(--accent))]"
                  >
                    Anmelden
                  </Link>
                )}
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm mt-2 hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Warenkorb ({itemCount}){" "}
                </Link>{" "}
              </div>{" "}
            </nav>{" "}
          </div>{" "}
        </div>
      )}
    </>
  );
}
