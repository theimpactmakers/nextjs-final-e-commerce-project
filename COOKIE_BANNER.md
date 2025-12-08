# Cookie Banner - DSGVO/GDPR Konform

## Übersicht

Der Cookie Banner ist vollständig DSGVO-konform für den deutschen Markt und bietet:

✅ **Opt-in Mechanismus** - Nutzer muss aktiv zustimmen
✅ **Granulare Kontrolle** - 4 Kategorien von Cookies
✅ **Transparenz** - Klare Beschreibungen und Links zur Datenschutzerklärung
✅ **Speicherung der Präferenzen** - localStorage
✅ **Responsive Design** - Mobile-optimiert
✅ **Accessibility** - ARIA-Labels und Keyboard-Navigation

## Cookie-Kategorien

### 1. Notwendige Cookies (Immer aktiv)
- Session-Cookies für Anmeldung
- Warenkorb-Funktionalität  
- Sicherheits-Cookies
- CSRF-Token

**Rechtliche Grundlage**: Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)

### 2. Funktionale Cookies (Optional)
- Wunschliste
- Produktvergleich
- Personalisierte Empfehlungen
- Spracheinstellungen

**Rechtliche Grundlage**: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)

### 3. Analyse-Cookies (Optional)
- Google Analytics (anonymisiert)
- Heatmaps
- Conversion-Tracking
- Performance-Monitoring

**Rechtliche Grundlage**: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)

### 4. Marketing-Cookies (Optional)
- Remarketing-Pixel
- Social Media Plugins
- Werbeanzeigen
- Affiliate-Tracking

**Rechtliche Grundlage**: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)

## Verwendung

### Automatische Anzeige
Der Banner erscheint automatisch beim ersten Besuch nach 1 Sekunde.

### Manuelle Steuerung
```tsx
import { useCookieConsent } from "@/hooks/useCookieConsent";

function MyComponent() {
  const { preferences, hasConsent, updatePreferences, resetConsent } = useCookieConsent();

  // Prüfen ob Analytics erlaubt ist
  if (preferences?.analytics) {
    // Google Analytics initialisieren
  }

  // Präferenzen zurücksetzen (zeigt Banner erneut)
  const handleReset = () => {
    resetConsent();
  };
}
```

### Integration mit Analytics

Beispiel für Google Analytics:

```tsx
// In _app.tsx oder layout.tsx
import { useCookieConsent } from "@/hooks/useCookieConsent";

function MyApp() {
  const { preferences } = useCookieConsent();

  useEffect(() => {
    if (preferences?.analytics) {
      // Google Analytics laden
      window.gtag('config', 'GA_MEASUREMENT_ID');
    }
  }, [preferences]);
}
```

## Komponenten

### CookieBanner.tsx
Hauptkomponente mit zwei Ansichten:
1. **Hauptansicht**: Kurze Info mit 3 Buttons (Alle akzeptieren, Nur notwendige, Einstellungen)
2. **Einstellungen**: Detaillierte Kontrolle über alle Cookie-Kategorien

### useCookieConsent.ts
Hook für den Zugriff auf Cookie-Präferenzen:
- `preferences` - Aktuelle Einstellungen
- `hasConsent` - Boolean ob Nutzer bereits entschieden hat
- `updatePreferences()` - Präferenzen aktualisieren
- `resetConsent()` - Zustimmung zurücksetzen

## DSGVO-Compliance Checkliste

✅ **Transparenz**
- Klare Beschreibung jeder Cookie-Kategorie
- Links zur Datenschutzerklärung und Cookie-Richtlinie
- Keine versteckten Cookies

✅ **Einwilligung**
- Opt-in (kein Pre-Check)
- Granulare Kontrolle
- Widerrufbar (über Einstellungen-Seite)
- Freiwillig (kein Cookie-Wall)

✅ **Datenminimierung**
- Nur notwendige Cookies ohne Zustimmung
- Klare Trennung der Kategorien
- localStorage statt Cookies für Präferenzen

✅ **Information**
- Zweck jeder Kategorie erklärt
- Verlinkung zu ausführlichen Datenschutzinformationen
- Anbieter und Laufzeit in Datenschutzerklärung

## Anpassungen

### Farben
Die Komponente nutzt CSS-Variablen:
- `--primary` - Hauptfarbe (Buttons)
- `--foreground` - Textfarbe
- `--muted-foreground` - Sekundärer Text
- `--secondary` - Hover-Hintergrund
- `--border` - Rahmenfarbe

### Texte
Alle Texte sind direkt in der Komponente und können leicht angepasst werden.

### Verzögerung
Standard: 1 Sekunde nach Seitenload
```tsx
// In CookieBanner.tsx, Zeile 23
setTimeout(() => {
  setShowBanner(true);
}, 1000); // Hier anpassen
```

## Rechtliche Hinweise

⚠️ **Wichtig**: 
- Dieser Banner erfüllt die technischen Anforderungen der DSGVO
- Juristische Prüfung durch einen Fachanwalt für IT-Recht wird empfohlen
- Datenschutzerklärung muss aktuell und vollständig sein
- Cookie-Richtlinie muss alle verwendeten Cookies auflisten
- Tracking-Skripte dürfen erst NACH Einwilligung geladen werden

## Support

Für Fragen zum Cookie-Banner:
1. Prüfe die Datenschutzerklärung unter `/datenschutz`
2. Siehe Cookie-Einstellungen unter `/cookieeinstellungen`
3. Kontaktiere den Support

## Changelog

### Version 1.0 (Dezember 2024)
- Initiale Implementierung
- DSGVO-konforme Einwilligung
- 4 Cookie-Kategorien
- Responsive Design
- localStorage-Integration
