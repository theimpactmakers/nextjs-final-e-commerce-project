"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SlideData, HeroSliderProps } from "../app/(data)/slideData"; // Importiere Typen

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
 * Ein vollständig responsiver, automatisch laufender Hero-Slider.
 * Die Daten werden über die 'slides' Prop übergeben.
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
        {slides.map((slide: SlideData) => (
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
            <div className="absolute inset-0 flex flex-col items-center justify-center px-16 sm:px-20 md:px-24 py-4 sm:py-8 text-center text-white drop-shadow-lg">
              {/* Titel: Größer auf Desktop (md:text-5xl) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2">
                {slide.title}
              </h1>
              {/* Beschreibung: Größe passt sich an */}
              <p className="text-md sm:text-lg md:text-xl lg:text-2xl mb-4">
                {slide.description}
              </p>
              {/* CTA Button */}
              <a
                href={slide.ctaLink}
                className="inline-flex items-center justify-center gap-2 rounded-lg text-sm md:text-base font-medium 
                           bg-accent text-accent-foreground hover:opacity-90 
                           shadow-xl transition-all duration-300 ease-in-out 
                           h-10 px-6 sm:h-11 sm:px-8 mt-2"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigationspfeile (Außerhalb der Slides, überlagert) - Sichtbar auf allen Geräten */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-1 md:left-4 transform -translate-y-1/2 p-3 hover:bg-black/50 hover:backdrop-blur-sm text-white rounded-full transition-all shadow-md cursor-pointer"
      >
        <ChevronLeft className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-1 md:right-4 transform -translate-y-1/2 p-3 hover:bg-black/50 hover:backdrop-blur-sm text-white rounded-full transition-all shadow-md cursor-pointer"
      >
        <ChevronRight className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10" />
      </button>

      {/* Navigationspunkte (Dots) - Sichtbar auf allen Geräten */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 md:w-2.5 md:h-2.5 lg:w-2 lg:h-2 rounded-full transition-colors duration-300 ${
              index === currentSlide
                ? "bg-accent shadow-md"
                : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
