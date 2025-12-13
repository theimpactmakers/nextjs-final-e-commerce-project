# KI-Chatbot Integration

## Übersicht
Der KI-gestützte Chatbot wurde erfolgreich in die Next.js-Anwendung integriert. Er erscheint auf allen Seiten unten rechts und bietet intelligente Produktempfehlungen basierend auf Nutzerfragen.

## Features

### ✅ Implementierte Funktionen
- **Globale Verfügbarkeit**: Chatbot erscheint auf allen Seiten unten rechts
- **KI-gestützte Beratung**: Nutzt OpenAI GPT-4o-mini für intelligente Antworten
- **Produktempfehlungen**: Dynamische Suche in der Supabase-Datenbank
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Benutzerfreundlich**: Begrüßungsnachricht, Auto-Scroll, Tastatur-Shortcuts
- **Performance-optimiert**: KI-Anfragen nur bei Bedarf

### 🎨 Design
- Modernes Gradient-Design
- Floating Chat-Button mit Animations-Effekten
- Chat-Fenster mit 600px Höhe und 384px Breite
- Produktkarten mit Bildern und Preisen
- Lade-Animationen

## Komponenten-Struktur

### 1. **AIChatbot.tsx** (`/components/AIChatbot.tsx`)
Die Hauptkomponente für den Chatbot:
- Chat-Toggle-Button (unten rechts)
- Chat-Fenster mit Nachrichten-Historie
- Eingabefeld mit Enter-Taste-Support
- Produktanzeige in Chat-Messages

### 2. **API Route** (`/app/api/chatbot/route.ts`)
Backend-Logik für:
- OpenAI GPT-4o-mini Integration
- Supabase-Produktsuche
- Intent-Erkennung (erkennt Produktanfragen)
- Keyword-Extraktion
- Error-Handling

### 3. **Layout Integration** (`/app/layout.tsx`)
Der Chatbot wurde in das Root-Layout eingebunden und ist somit auf allen Seiten verfügbar.

## Verwendete Technologien

### Pakete
- ✅ `openai` (v4.x) - OpenAI API Client
- ✅ `lucide-react` - Icon-Bibliothek
- ✅ `@supabase/ssr` - Bereits vorhanden (Supabase Integration)

### Umgebungsvariablen
```env
OPEN_API_KEY=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
```

## Funktionsweise

### 1. **Chatbot-Öffnung**
- Nutzer klickt auf den Chat-Button unten rechts
- Begrüßungsnachricht wird angezeigt
- Input-Feld erhält automatisch Focus

### 2. **Nachricht senden**
- Nutzer gibt Nachricht ein und drückt Enter oder klickt auf Send
- Nachricht wird an API-Route `/api/chatbot` gesendet
- Loading-Animation wird angezeigt

### 3. **KI-Verarbeitung**
```typescript
// Intent-Erkennung
const { isProductQuery, keywords } = detectProductIntent(userMessage);

// Bei Produktanfrage: Supabase-Abfrage
if (isProductQuery) {
  products = await fetchProductsFromSupabase(searchTerm);
}

// OpenAI-Anfrage mit Kontext
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [systemMessage, ...conversationHistory],
  temperature: 0.7,
  max_tokens: 300,
});
```

### 4. **Produktsuche**
Die Supabase-Abfrage sucht in folgenden Feldern:
- `name` (Produktname)
- `description` (Produktbeschreibung)
- `category` (Kategorie)

Beispiel:
```typescript
.or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
.limit(5)
```

### 5. **Antwort-Anzeige**
- KI-Antwort wird im Chat angezeigt
- Wenn Produkte gefunden wurden, werden sie als klickbare Karten angezeigt
- Produktkarten enthalten: Bild, Name, Preis, Link zur Produktseite

## Performance-Optimierungen

### ✅ Implementiert
1. **Lazy Loading**: Chat-Komponente wird erst gerendert wenn geöffnet
2. **Bedarfsgesteuerte KI-Anfragen**: OpenAI wird nur aufgerufen wenn nötig
3. **Intent-Erkennung**: Produkte werden nur bei relevanten Fragen abgerufen
4. **Limit auf Produkte**: Max. 5 Produkte aus DB, max. 3 im Chat angezeigt
5. **Token-Limit**: Max. 300 Tokens pro Antwort
6. **Effiziente Supabase-Queries**: Optimierte OR-Abfragen mit ILIKE

### Weitere Optimierungsmöglichkeiten
- Caching von häufigen Produktanfragen
- Debouncing für Eingaben
- Streaming-Antworten von OpenAI
- Komprimierung von Chat-Historie

## Erkannte Keywords für Produktsuche

Der Chatbot erkennt automatisch folgende Intents:
- **Produktsuche**: produkt, empfehlung, kaufen, suchen, finden, zeigen
- **Bedarf**: brauche, möchte, interessiere
- **Anlässe**: geschenk, schenken
- **Kategorien**: spielzeug, spiel, holz, lernspielzeug, puzzle
- **Zielgruppen**: kinder, baby, erwachsene, junior, senior
- **Eigenschaften**: nachhaltig, pädagogisch, kreativ
- **Preis**: preis, günstig, teuer, budget, euro

## Beispiel-Konversationen

### Beispiel 1: Produktempfehlung
```
Nutzer: "Ich suche ein Geschenk für ein 5-jähriges Kind"
Bot: "Gerne helfe ich Ihnen! Für ein 5-jähriges Kind empfehle ich 
      besonders Lernspielzeug, das die Kreativität fördert..."
      [Zeigt 3 passende Produkte]
```

### Beispiel 2: Kategorie-Suche
```
Nutzer: "Habt ihr Holzspielzeug?"
Bot: "Ja, wir haben eine große Auswahl an hochwertigem Holzspielzeug!..."
      [Zeigt Holzspielzeug-Produkte]
```

### Beispiel 3: Beratung
```
Nutzer: "Was ist das beste für ein Baby?"
Bot: "Für Babys (0-2 Jahre) empfehle ich besonders sichere und 
      altersgerechte Produkte..."
      [Zeigt Baby-Produkte]
```

## Troubleshooting

### Problem: OpenAI API Error
**Lösung**: Überprüfen Sie den `OPEN_API_KEY` in der `.env`-Datei

### Problem: Keine Produkte werden angezeigt
**Lösung**: 
1. Überprüfen Sie Supabase-Verbindung
2. Stellen Sie sicher, dass die `products`-Tabelle existiert
3. Prüfen Sie, ob Produkte die gesuchten Keywords enthalten

### Problem: Chatbot wird nicht angezeigt
**Lösung**: 
1. Browser-Cache leeren
2. Server neu starten: `npm run dev`
3. Prüfen Sie Console auf Fehler

## Anpassungsmöglichkeiten

### Chatbot-Position ändern
In `AIChatbot.tsx`:
```typescript
// Von unten rechts zu unten links ändern:
className="fixed bottom-6 left-6 z-50..."
```

### System-Prompt anpassen
In `/app/api/chatbot/route.ts`:
```typescript
let systemMessage = `Dein eigener Text hier...`;
```

### Produkt-Limit ändern
In `/app/api/chatbot/route.ts`:
```typescript
.limit(10) // Statt 5 Produkte
```

### Design anpassen
Farben in `AIChatbot.tsx` ändern:
```typescript
// Aktuell: Blau zu Lila Gradient
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Beispiel: Grün zu Türkis
className="bg-gradient-to-r from-green-600 to-teal-600"
```

## Nächste Schritte (Optional)

### Mögliche Erweiterungen:
1. **Chat-Historie speichern**: LocalStorage oder Supabase
2. **Multi-Language Support**: Deutsch, Englisch, etc.
3. **Voice Input**: Speech-to-Text Integration
4. **Sentiment Analysis**: Emotionen erkennen
5. **Feedback-System**: Daumen hoch/runter für Antworten
6. **Admin-Dashboard**: Chat-Logs einsehen und analysieren
7. **A/B Testing**: Verschiedene Prompts testen
8. **Personalisierung**: Basierend auf User-Profil

## Lizenz & Kosten

### OpenAI Kosten (GPT-4o-mini)
- **Input**: $0.150 / 1M tokens
- **Output**: $0.600 / 1M tokens
- Durchschnittliche Chat-Message: ~500 tokens
- **Geschätzte Kosten**: < $0.001 pro Chat-Nachricht

### Rate Limits
- OpenAI: 500 Anfragen/Minute (Tier 1)
- Supabase: Abhängig von Ihrem Plan

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Browser-Console auf Fehler
2. Schauen Sie in die Server-Logs
3. Überprüfen Sie die API-Keys

---

**Status**: ✅ Vollständig implementiert und einsatzbereit
**Version**: 1.0.0
**Letzte Aktualisierung**: 13. Dezember 2025
