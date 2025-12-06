/**
 * Interface für die Datenstruktur eines einzelnen Slides.
 */
export interface SlideData {
  id: number;
  imageMobile: string;
  imageDesktop: string;
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
}

/**
 * Interface für die Props der HeroSlider Komponente.
 */
export interface HeroSliderProps {
  slides: SlideData[];
}

// ==============================================================================
// SLIDE DATEN
// ==============================================================================

/**
 * Die tatsächlichen Daten, die im Hero Slider angezeigt werden.
 */
export const SLIDES_DATA: SlideData[] = [
  {
    id: 1,
    imageMobile: "/images/slider/slide-1.svg",
    imageDesktop: "/images/slider/slide-1.svg",
    title: "Die Jagd ist eröffnet",
    description: "Qualität, die man riechen kann!",
    cta: "Jetzt Shoppen",
    ctaLink: "/shop",
  },
  {
    id: 2,
    imageMobile: "/images/slider/slide-2.svg",
    imageDesktop: "/images/slider/slide-2.svg",
    title: "100% Natur, 0% Kompromisse",
    description: "Entdecke unsere besten Rezepturen.",
    cta: "Zur Kollektion",
    ctaLink: "/collection",
  },
  {
    id: 3,
    imageMobile: "/images/slider/slide-3.svg",
    imageDesktop: "/images/slider/slide-3.svg",
    title: "Lass dich beraten",
    description: "Finde das perfekte Futter für deinen Liebling.",
    cta: "Futterberater",
    ctaLink: "/advisor",
  },
];
