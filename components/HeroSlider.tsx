"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SlideData, HeroSliderProps } from "../app/(data)/slideData"; // Importiere Typen
import Button from "@/components/Button";

// ==============================================================================
// HILFS-KOMPONENTEN (Icons)
// ==============================================================================

// Hilfs-Icons (simuliert)
const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ==============================================================================
// HeroSlider Komponente
// ==============================================================================

/**
 * Vollständig responsiver, autom. laufender Hero-Slider.
 * Die Daten werden via 'slides' Prop übergeben.
 */
export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides: number = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  // Auto-Advance Logik mit useEffect (5 Sekunden)
  useEffect(() => {
    // Stellen Sie sicher, dass slides vorhanden sind, bevor der Timer gestartet wird.
    if (totalSlides === 0) return;
    const intervalId: NodeJS.Timeout = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, [nextSlide, totalSlides]);

  // Error-Handling für das Bild
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src =
      "https://placehold.co/720x400/CCCCCC/333333?text=Bild+nicht+gefunden";
  };

  return (
    // Responsive Höhe: Mobile (h-80), Tablet/Small Desktop (md:h-96), Large Desktop (lg:h-[70vh])
    <section className="relative w-full overflow-hidden h-80 md:h-96 lg:h-[70vh] mb-12 shadow-xl">
      {/* Container für die Slides (mit Flexbox für horizontale Anordnung) */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide: SlideData, index: number) => (
          <div key={slide.id} className="w-full shrink-0 relative h-full">
            {/* Bild-Element mit Mobile-First-Optimierung */}
            <picture>
              <source media="(min-width: 768px)" srcSet={slide.imageDesktop} />
              <img
                src={slide.imageMobile}
                alt={slide.title}
                // Deckt den gesamten Container ab und zentriert das Bild
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleImageError}
              />
            </picture>

            {/* Overlay-Maske (leicht dunkler) für besseren Textkontrast */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content Overlay (Text direkt auf dem Bild) - Mobile First */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center px-16 sm:px-20 md:px-24 py-4 sm:py-8 text-center text-white drop-shadow-lg animated-slide"
              style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
              {/* Titel: Größer auf Desktop (md:text-5xl) */}
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 ${
                  index === currentSlide
                    ? "animate-[slideInUp_0.8s_ease-out_0.2s_both]"
                    : "opacity-0"
                } animated-slide`}
                style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              >
                {slide.title}
              </h1>
              {/* Beschreibung: Größe passt sich an */}
              <p
                className={`text-md sm:text-lg md:text-xl lg:text-2xl mb-4 ${
                  index === currentSlide
                    ? "animate-[slideInUp_0.8s_ease-out_0.4s_both]"
                    : "opacity-0"
                } animated-slide`}
                style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              >
                {slide.description}
              </p>
              {/* CTA Button */}
              <div
                className={
                  index === currentSlide
                    ? "animate-[popIn_0.6s_ease-out_0.8s_both] animated-slide"
                    : "opacity-0 animated-slide"
                }
                style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              >
                <Button
                  href={slide.ctaLink}
                  className="shadow-xl mt-2 text-sm md:text-base"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ...existing code... */}
    </section>
  );
};
