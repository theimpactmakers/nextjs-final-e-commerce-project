"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
          Werde Teil unserer Community
        </h2>
        <form className="flex w-full max-w-lg gap-2 mt-2">
          <input
            type="email"
            placeholder="Deine E-Mail-Adresse eingeben"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          <Button type="submit" variant="primary">
            Rückruf-Alarm senden
          </Button>
        </form>
      </div>
    </section>
  );
}
export default function Footer() {
  return <ProtectDogSection />;
}
