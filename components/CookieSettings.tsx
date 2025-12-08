"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Cookie, RefreshCw } from "lucide-react";

export default function CookieSettings() {
  const { preferences, hasConsent, resetConsent } = useCookieConsent();

  const handleResetConsent = () => {
    if (
      confirm(
        "Möchten Sie Ihre Cookie-Einstellungen wirklich zurücksetzen? Der Cookie-Banner wird erneut angezeigt."
      )
    ) {
      resetConsent();
      window.location.reload();
    }
  };

  if (!hasConsent) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">
              Keine Cookie-Einstellungen gefunden
            </h3>
            <p className="text-yellow-800 text-sm">
              Sie haben noch keine Cookie-Einstellungen vorgenommen. Beim
              nächsten Besuch der Startseite wird der Cookie-Banner angezeigt.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Cookie className="w-7 h-7 text-primary" />
          Ihre Cookie-Einstellungen
        </h2>
        <button
          onClick={handleResetConsent}
          className="flex items-center gap-2 px-4 py-2 border-2 border-primary/30 text-foreground rounded-lg hover:bg-secondary transition-colors font-medium text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Zurücksetzen
        </button>
      </div>

      <div className="space-y-4">
        {/* Notwendige Cookies */}
        <div className="flex items-start justify-between p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
              Notwendige Cookies
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Immer aktiv
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Erforderlich für die grundlegende Funktionalität
            </p>
          </div>
          <div className="ml-4">
            <div className="w-12 h-6 bg-primary rounded-full flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Funktionale Cookies */}
        <div
          className={`flex items-start justify-between p-4 border-2 rounded-lg ${
            preferences?.functional
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">
              Funktionale Cookies
            </h3>
            <p className="text-sm text-muted-foreground">
              Erweiterte Funktionen und Personalisierung
            </p>
          </div>
          <div className="ml-4">
            <div
              className={`w-12 h-6 rounded-full flex items-center px-1 ${
                preferences?.functional ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full ${
                  preferences?.functional ? "ml-auto" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div
          className={`flex items-start justify-between p-4 border-2 rounded-lg ${
            preferences?.analytics
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">Analyse-Cookies</h3>
            <p className="text-sm text-muted-foreground">
              Helfen uns die Website zu verbessern
            </p>
          </div>
          <div className="ml-4">
            <div
              className={`w-12 h-6 rounded-full flex items-center px-1 ${
                preferences?.analytics ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full ${
                  preferences?.analytics ? "ml-auto" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Marketing Cookies */}
        <div
          className={`flex items-start justify-between p-4 border-2 rounded-lg ${
            preferences?.marketing
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">
              Marketing-Cookies
            </h3>
            <p className="text-sm text-muted-foreground">
              Personalisierte Werbung und Kampagnen
            </p>
          </div>
          <div className="ml-4">
            <div
              className={`w-12 h-6 rounded-full flex items-center px-1 ${
                preferences?.marketing ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full ${
                  preferences?.marketing ? "ml-auto" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Hinweis:</strong> Um Ihre Cookie-Einstellungen zu ändern,
          klicken Sie auf &quot;Zurücksetzen&quot;. Der Cookie-Banner wird dann
          erneut angezeigt, und Sie können neue Einstellungen vornehmen.
        </p>
      </div>
    </div>
  );
}
