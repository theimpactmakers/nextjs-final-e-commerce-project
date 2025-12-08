"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Settings } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Zawsze true, nie można wyłączyć
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Sprawdź czy użytkownik już zaakceptował/odrzucił cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Pokaż banner po małym opóźnieniu
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Załaduj zapisane preferencje
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (e) {
        console.error("Error parsing cookie preferences:", e);
      }
    }
  }, []);

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    setShowBanner(false);
    setShowSettings(false);

    // Tutaj możesz zainicjalizować odpowiednie skrypty na podstawie preferencji
    if (prefs.analytics) {
      // Inicjalizuj Google Analytics lub inny analytics
      console.log("Analytics enabled");
    }
    if (prefs.marketing) {
      // Inicjalizuj marketing pixels
      console.log("Marketing enabled");
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-[999]" />

      {/* Banner */}
      <div className="cookie-banner-wrapper fixed bottom-0 left-0 right-0 z-[1000] px-2 py-2 sm:p-4 md:p-6 animate-slide-up">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl border-2 border-primary/20">
          {!showSettings ? (
            // Hauptansicht
            <div className="px-3 py-3 sm:p-6 md:p-8">
              <div className="mb-3 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3 mb-2">
                  <Image
                    src="/treat.webp"
                    alt="Dog treat"
                    width={20}
                    height={20}
                    className="cookie-banner-icon shrink-0 w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 mt-0.5"
                  />
                  <h2 className="cookie-banner-heading text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-snug">
                    Wir respektieren Ihre Privatsphäre
                  </h2>
                </div>
                <p className="cookie-banner-container text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-2 sm:mb-4">
                  Wir verwenden Cookies und ähnliche Technologien, um die
                  Funktionalität unserer Website zu gewährleisten und Ihr
                  Einkaufserlebnis zu verbessern. Einige Cookies sind notwendig,
                  andere helfen uns, die Website zu optimieren und Ihnen
                  relevante Angebote zu zeigen.
                </p>
                <p className="cookie-banner-small-text text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Weitere Informationen finden Sie in unserer{" "}
                  <Link
                    href="/datenschutz"
                    className="text-primary hover:underline font-medium underline"
                  >
                    Datenschutzerklärung
                  </Link>{" "}
                  und den{" "}
                  <Link
                    href="/cookieeinstellungen"
                    className="text-primary hover:underline font-medium underline"
                  >
                    Cookie-Einstellungen
                  </Link>
                  .
                </p>
              </div>

              {/* Mobile: stacked layout, Desktop: 3 buttons in a row (reversed order) */}
              <div className="flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
                <button
                  onClick={acceptAll}
                  className="cookie-banner-button w-full sm:flex-1 px-4 py-2.5 sm:px-6 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md cursor-pointer text-sm sm:text-base"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={acceptNecessaryOnly}
                  className="cookie-banner-button w-full sm:flex-1 px-2 py-2.5 sm:px-6 sm:py-3 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium cursor-pointer text-[11px] sm:text-sm md:text-base leading-tight"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="cookie-banner-button w-full sm:flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 py-2.5 sm:px-6 sm:py-3 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium cursor-pointer text-[11px] sm:text-sm md:text-base leading-tight"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="whitespace-nowrap">Einstellungen</span>
                </button>
              </div>
            </div>
          ) : (
            // Einstellungen
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-primary shrink-0" />
                  <span className="leading-tight">Cookie-Einstellungen</span>
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6">
                {/* Notwendige Cookies */}
                <div className="p-3 sm:p-4 border-2 border-primary/20 rounded-lg bg-secondary/30">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground mb-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        Notwendige Cookies
                        <span className="text-[10px] sm:text-xs bg-primary/20 text-primary px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                          Erforderlich
                        </span>
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-snug">
                        Diese Cookies sind für die grundlegende Funktionalität
                        der Website erforderlich und können nicht deaktiviert
                        werden. Sie speichern z.B. Ihren Warenkorb und Ihre
                        Anmeldeinformationen.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-12 h-6 bg-primary rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Funktionale Cookies */}
                <div className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground mb-1">
                        Funktionale Cookies
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-snug">
                        Ermöglichen erweiterte Funktionen wie Wunschliste,
                        Produktvergleich und personalisierte Empfehlungen.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          functional: !preferences.functional,
                        })
                      }
                      className="shrink-0 cursor-pointer"
                    >
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.functional ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences.functional ? "ml-auto" : ""
                          }`}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground mb-1">
                        Analyse-Cookies
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-snug">
                        Helfen uns zu verstehen, wie Besucher mit der Website
                        interagieren. Alle Informationen werden anonymisiert.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          analytics: !preferences.analytics,
                        })
                      }
                      className="shrink-0 cursor-pointer"
                    >
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.analytics ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences.analytics ? "ml-auto" : ""
                          }`}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground mb-1">
                        Marketing-Cookies
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-snug">
                        Werden verwendet, um Ihnen relevante Werbung anzuzeigen
                        und die Effektivität von Werbekampagnen zu messen.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          marketing: !preferences.marketing,
                        })
                      }
                      className="shrink-0 cursor-pointer"
                    >
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.marketing ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences.marketing ? "ml-auto" : ""
                          }`}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t-2 border-gray-200 sm:justify-center">
                <button
                  onClick={saveCustomPreferences}
                  className="w-full sm:w-auto sm:min-w-[200px] sm:max-w-[250px] px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md cursor-pointer text-sm"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full sm:w-auto sm:min-w-[200px] sm:max-w-[250px] px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium cursor-pointer text-sm"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
