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
    imageMobile: "https://placehold.co/720x400/1e293b/ffffff?text=Jagd+Mobile",
    imageDesktop: "https://placehold.co/1600x600/1e293b/ffffff?text=Jagd+Desktop",
    title: "Die Jagd ist eröffnet",
    description: "Qualität, die man riechen kann!",
    cta: "Jetzt Shoppen",
    ctaLink: "/shop"
  },
  {
    id: 2,
    imageMobile: "https://placehold.co/720x400/0f172a/ffffff?text=Natur+Mobile",
    imageDesktop: "https://placehold.co/1600x600/0f172a/ffffff?text=Natur+Desktop",
    title: "100% Natur, 0% Kompromisse",
    description: "Entdecke unsere besten Rezepturen.",
    cta: "Zur Kollektion",
    ctaLink: "/collection"
  },
  {
    id: 3,
    imageMobile: "https://placehold.co/720x400/334155/ffffff?text=Abenteuer+Mobile",
    imageDesktop: "https://placehold.co/1600x600/334155/ffffff?text=Abenteuer+Desktop",
    title: "Für jedes Abenteuer bereit",
    description: "Finde das perfekte Futter für deinen Liebling.",
    cta: "Futterberater",
    ctaLink: "/advisor"
  },
];