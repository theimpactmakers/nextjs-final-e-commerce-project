"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie, Settings } from "lucide-react";

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] p-4 md:p-6 animate-slide-up">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl border-2 border-primary/20">
          {!showSettings ? (
            // Hauptansicht
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <Cookie className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    🍪 Wir respektieren Ihre Privatsphäre
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Wir verwenden Cookies und ähnliche Technologien, um die
                    Funktionalität unserer Website zu gewährleisten und Ihr
                    Einkaufserlebnis zu verbessern. Einige Cookies sind
                    notwendig, andere helfen uns, die Website zu optimieren und
                    Ihnen relevante Angebote zu zeigen.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Weitere Informationen finden Sie in unserer{" "}
                    <Link
                      href="/datenschutz"
                      className="text-primary hover:underline font-medium"
                    >
                      Datenschutzerklärung
                    </Link>{" "}
                    und den{" "}
                    <Link
                      href="/cookieeinstellungen"
                      className="text-primary hover:underline font-medium"
                    >
                      Cookie-Einstellungen
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Einstellungen
                </button>
                <button
                  onClick={acceptNecessaryOnly}
                  className="px-6 py-3 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          ) : (
            // Einstellungen
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Settings className="w-7 h-7 text-primary" />
                  Cookie-Einstellungen
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Notwendige Cookies */}
                <div className="p-4 border-2 border-primary/20 rounded-lg bg-secondary/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                        Notwendige Cookies
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Erforderlich
                        </span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">
                        Funktionale Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
                      className="shrink-0"
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
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">
                        Analyse-Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
                      className="shrink-0"
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
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">
                        Marketing-Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
                      className="shrink-0"
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

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Abbrechen
                </button>
                <button
                  onClick={saveCustomPreferences}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
                >
                  Auswahl speichern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
