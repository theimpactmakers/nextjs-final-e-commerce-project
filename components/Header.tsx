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
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        isScrolled
          ? "backdrop-blur bg-[hsl(var(--muted)/0.6)] shadow-md"
          : "bg-transparent"
      }`}
    >
      {/* decorative gradient band (matches requested brown gradient) */}
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
      />{" "}
      {/* Hauptnavigation & Logo - erhöhte Höhe, weniger horizontales Padding auf großen Bildschirmen */}
      <div className="relative z-10 w-full mx-auto px-2 sm:px-3 md:px-4 lg:px-2 max-w-full grid grid-cols-[minmax(44px,auto)_1fr_minmax(44px,auto)] items-center h-20">
        {" "}
        {/* Mobile: search icon on the left */}
        <button
          aria-label="Suche"
          className="col-start-1 md:hidden p-1 rounded hover:bg-accent/10"
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
            className="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <Link
          href="/"
          className="col-start-2 justify-center md:col-start-1 md:justify-start flex items-center gap-3 z-30 flex-shrink-0 min-w-[72px] logo-md-narrow"
        >
          {" "}
          <Image
            src="/images/Logo_example_6.png"
            alt="Elite Tail Treats"
            width={120}
            height={48}
            priority
            className="block w-20 sm:w-24 md:w-28 lg:w-32"
            style={{
              height: "auto",
            }}
          />{" "}
        </Link>{" "}
        {/* 2. Hauptmenü Links (zentriert auf md+) */}
        <nav className="hidden md:flex md:gap-2 lg:gap-4 font-medium justify-center col-start-2 whitespace-nowrap overflow-visible">
          {" "}
          {/* Hundefutter mit Dropdown */}
          <div className="relative group inline-block">
            {" "}
            <Link
              href="/shop"
              className="relative inline-flex items-center h-9 px-2 hover:text-[hsl(var(--accent))] transition-colors"
            >
              {" "}
              Hundefutter {/* animated underline */}
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #513431 0%, #7a4d3f 50%, #381f1c 100%)",
                }}
              ></span>{" "}
            </Link>{" "}
            <div
              role="menu"
              aria-label="Hundefutter Menü"
              className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-72 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/95 dark:bg-slate-900/95 text-foreground border border-[hsl(var(--border))] rounded-xl shadow-xl p-4 z-50"
            >
              {" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div>
                  {" "}
                  <h4 className="text-xs font-semibold mb-2">Alter</h4>{" "}
                  <ul className="space-y-1 text-sm">
                    {" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?age=junior"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Junior{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?age=adult"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Adult{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?age=senior"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Senior{" "}
                      </Link>{" "}
                    </li>{" "}
                  </ul>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h4 className="text-xs font-semibold mb-2">
                    {" "}
                    Fleischsorten{" "}
                  </h4>{" "}
                  <ul className="space-y-1 text-sm">
                    {" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=ente"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Ente{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=rind"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Rind{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=kaninchen"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Kaninchen{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=lamm"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Lamm{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=pferd"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Pferd{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=wild"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Wild{" "}
                      </Link>{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <Link
                        href="/shop?meat=lachs"
                        className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                      >
                        {" "}
                        Lachs{" "}
                      </Link>{" "}
                    </li>{" "}
                  </ul>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Specials mit Dropdown */}
          <div className="relative group inline-block">
            {" "}
            <Link
              href="/specials"
              className="relative inline-flex items-center h-9 px-2 hover:text-[hsl(var(--accent))] transition-colors"
            >
              {" "}
              Specials{" "}
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #513431 0%, #7a4d3f 50%, #381f1c 100%)",
                }}
              ></span>{" "}
            </Link>{" "}
            <div
              role="menu"
              aria-label="Specials Menü"
              className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-48 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/95 dark:bg-slate-900/95 text-foreground border border-[hsl(var(--border))] rounded-xl shadow-xl p-3 z-50"
            >
              {" "}
              <ul className="space-y-1 text-sm">
                {" "}
                <li>
                  {" "}
                  <Link
                    href="/specials/diat"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    {" "}
                    Diätfutter{" "}
                  </Link>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <Link
                    href="/specials/hypoallergen"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    {" "}
                    Hypoallergen{" "}
                  </Link>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <Link
                    href="/specials/darmgesundheit"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    {" "}
                    Darmgesundheit{" "}
                  </Link>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <Link
                    href="/specials/gelenkfit"
                    className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                  >
                    {" "}
                    Gelenkfit{" "}
                  </Link>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
          <Link
            href="/beratung"
            className="relative inline-flex items-center h-9 px-2 hover:text-[hsl(var(--accent))] transition-colors"
          >
            {" "}
            Beratung{" "}
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #513431 0%, #7a4d3f 50%, #381f1c 100%)",
              }}
            ></span>{" "}
          </Link>{" "}
          <div className="relative group inline-block">
            {" "}
            <button className="relative inline-flex items-center h-9 gap-2 group-hover:text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors px-2 py-2 align-middle">
              {" "}
              <span>Mehr</span>{" "}
              <svg
                className="w-3 h-3 transition-transform duration-150 group-hover:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                {" "}
                <path
                  d="M8 5l8 7-8 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
              </svg>{" "}
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-left scale-x-0 group-hover:scale-x-100 -translate-y-1 transform transition-transform duration-300 rounded"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #513431 0%, #7a4d3f 50%, #381f1c 100%)",
                }}
              ></span>{" "}
            </button>{" "}
            <ul className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-56 transform transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto bg-white/95 dark:bg-slate-900/95 text-foreground border border-[hsl(var(--border))] rounded-xl shadow-xl p-3 z-50">
              {" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/contact"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  Kontakt{" "}
                </Link>{" "}
              </li>{" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/about"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  Über Uns{" "}
                </Link>{" "}
              </li>{" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/impressum"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  Impressum{" "}
                </Link>{" "}
              </li>{" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/datenschutz"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  Datenschutz{" "}
                </Link>{" "}
              </li>{" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/agb"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  AGB{" "}
                </Link>{" "}
              </li>{" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/zahlung-versand"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  Zahlung & Versand{" "}
                </Link>{" "}
              </li>{" "}
              <li className="py-1">
                {" "}
                <Link
                  href="/widerruf"
                  className="block rounded-md px-3 py-2 hover:bg-[hsl(var(--secondary))] hover:text-foreground transition-colors"
                >
                  {" "}
                  Widerruf{" "}
                </Link>{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
        </nav>{" "}
        {/* 3. Aktionen */}
        {/* Desktop: Suche + Anmeldung + Warenkorb */}
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium justify-end col-start-3">
          {" "}
          {/* Search (desktop) */}
          <form
            action="/search"
            method="get"
            className="hidden md:flex items-center mr-2 self-end"
          >
            {" "}
            <label htmlFor="header-search" className="sr-only">
              {" "}
              Suche{" "}
            </label>{" "}
            <div className="relative">
              {" "}
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary-foreground))] w-4 h-4"
                aria-hidden
              >
                {" "}
                <circle cx="11" cy="11" r="7" />{" "}
                <line x1="21" y1="21" x2="16.65" y2="16.65" />{" "}
              </svg>{" "}
              <input
                id="header-search"
                name="q"
                type="search"
                placeholder="Suche..."
                className="w-56 bg-white/95 dark:bg-slate-800/95 border border-[hsl(var(--border))] text-sm rounded-full py-1.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
              />{" "}
            </div>{" "}
          </form>{" "}
          {/* Anmelden / Login */}
          {/* Desktop: show text normally, but swap to icon between 768px-915px */}
          <Link
            href="/auth/login"
            className="text-[hsl(var(--accent))] hover:opacity-90 transition-colors brown-color-hover hide-md-narrow"
          >
            {" "}
            Anmelden{" "}
          </Link>{" "}
          <Link
            href="/auth/login"
            aria-label="Anmelden"
            className="show-md-narrow p-1 rounded hover:bg-accent/10 text-[hsl(var(--accent))]"
          >
            {" "}
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
              {" "}
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{" "}
              <circle cx="12" cy="7" r="4" />{" "}
            </svg>{" "}
          </Link>{" "}
          {/* Warenkorb */}
          <Link
            href="/cart"
            className="hover:text-[hsl(var(--accent))] transition-colors flex items-center gap-1 group group-brown"
          >
            {" "}
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
              {" "}
              <circle cx="8" cy="21" r="1" /> <circle cx="19" cy="21" r="1" />{" "}
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />{" "}
            </svg>{" "}
            <span className="text-[hsl(var(--accent))] transition-colors group-hover:text-[hsl(var(--primary))]">
              {" "}
              (0){" "}
            </span>{" "}
          </Link>{" "}
        </div>{" "}
        {/* Mobile: nur Icon-Warenkorb mit Anzahl, Login-Icon und Hamburger */}
        <div className="flex md:hidden items-center space-x-3 justify-end col-start-3">
          {" "}
          {/* Cart icon with badge */}
          <Link
            href="/cart"
            className="relative p-1 rounded hover:bg-accent/10 group"
          >
            {" "}
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
              {" "}
              <circle cx="8" cy="21" r="1" /> <circle cx="19" cy="21" r="1" />{" "}
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />{" "}
            </svg>{" "}
            <span className="ml-2 sr-only">Warenkorb</span>{" "}
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[hsl(var(--accent))] text-xs rounded-full px-2 bg-transparent transition-colors group-hover:text-[hsl(var(--primary))]">
              {" "}
              0{" "}
            </span>{" "}
          </Link>{" "}
          {/* Login icon */}
          <Link
            href="/auth/login"
            className="p-1 rounded hover:bg-accent/10 text-[hsl(var(--accent))]"
          >
            {" "}
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
              {" "}
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{" "}
              <circle cx="12" cy="7" r="4" />{" "}
            </svg>{" "}
            <span className="sr-only">Anmelden</span>{" "}
          </Link>{" "}
          {/* Hamburger menu */}
          <button
            aria-label={mobileOpen ? "Schließe Menü" : "Öffne Menü"}
            onClick={() => setMobileOpen((s) => !s)}
            className="p-1 rounded hover:bg-accent/10"
          >
            {" "}
            {mobileOpen ? ( // X icon
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
                {" "}
                <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
                <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
              </svg> // Hamburger icon
            ) : (
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
                {" "}
                <line x1="3" y1="12" x2="21" y2="12"></line>{" "}
                <line x1="3" y1="6" x2="21" y2="6"></line>{" "}
                <line x1="3" y1="18" x2="21" y2="18"></line>{" "}
              </svg>
            )}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {" "}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />{" "}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 p-6 overflow-auto">
            {" "}
            <div className="flex items-center justify-between mb-6">
              {" "}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center"
              >
                {" "}
                <Image
                  src="/images/Logo_example_6.png"
                  alt="Elite"
                  width={120}
                  height={36}
                  className="h-auto w-auto"
                />{" "}
              </Link>{" "}
              <button
                aria-label="Schließe Menü"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded hover:bg-accent/10"
              >
                {" "}
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
                  {" "}
                  <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
                  <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
                </svg>{" "}
              </button>{" "}
            </div>{" "}
            <nav className="space-y-4">
              {" "}
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Hundefutter{" "}
              </Link>{" "}
              <div className="pl-3">
                {" "}
                <Link
                  href="/shop?age=junior"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Junior{" "}
                </Link>{" "}
                <Link
                  href="/shop?age=adult"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Adult{" "}
                </Link>{" "}
                <Link
                  href="/shop?age=senior"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Senior{" "}
                </Link>{" "}
              </div>{" "}
              <Link
                href="/specials"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Specials{" "}
              </Link>{" "}
              <div className="pl-3">
                {" "}
                <Link
                  href="/specials/diat"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Diätfutter{" "}
                </Link>{" "}
                <Link
                  href="/specials/hypoallergen"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Hypoallergen{" "}
                </Link>{" "}
                <Link
                  href="/specials/darmgesundheit"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Darmgesundheit{" "}
                </Link>{" "}
                <Link
                  href="/specials/gelenkfit"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Gelenkfit{" "}
                </Link>{" "}
              </div>{" "}
              <Link
                href="/beratung"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-medium hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Beratung{" "}
              </Link>{" "}
              <Link
                href="/impressum"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Impressum{" "}
              </Link>{" "}
              <Link
                href="/datenschutz"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Datenschutz{" "}
              </Link>{" "}
              <Link
                href="/agb"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                {" "}
                AGB{" "}
              </Link>{" "}
              <Link
                href="/zahlung-versand"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Zahlung & Versand{" "}
              </Link>{" "}
              <Link
                href="/widerruf"
                onClick={() => setMobileOpen(false)}
                className="block text-sm hover:text-[hsl(var(--accent))]"
              >
                {" "}
                Widerruf{" "}
              </Link>{" "}
              <div className="pt-4 border-t mt-4">
                {" "}
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Anmelden{" "}
                </Link>{" "}
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm mt-2 hover:text-[hsl(var(--accent))]"
                >
                  {" "}
                  Warenkorb (0){" "}
                </Link>{" "}
              </div>{" "}
            </nav>{" "}
          </div>{" "}
        </div>
      )}
    </header>
  );
}
