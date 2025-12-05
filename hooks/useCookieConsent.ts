"use client";

import { useState, useEffect } from "react";

export type CookiePreferences = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(
    null
  );
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      try {
        const prefs = JSON.parse(consent);
        setPreferences(prefs);
        setHasConsent(true);
      } catch (e) {
        console.error("Error parsing cookie preferences:", e);
      }
    }
  }, []);

  const updatePreferences = (newPrefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    setHasConsent(true);
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    setPreferences(null);
    setHasConsent(false);
  };

  return {
    preferences,
    hasConsent,
    updatePreferences,
    resetConsent,
  };
}
