# Elite Dog Treats - E-Commerce Platform

Ein modernes E-Commerce-Projekt für Premium-Hundefutter mit intelligenter KI-Beratung, gebaut mit Next.js 19, Supabase und Stripe.

**[Features](#features)** · **[AI Chatbot](#ai-chatbot)** · **[Tech Stack](#tech-stack)** · **[Getting Started](#getting-started)** · **[Projektstruktur](#project-structure)**

---

## Features

### 🛒 E-Commerce Funktionalität

- **Produktkatalog** mit Filterung nach Altersgruppe (Junior/Adult/Senior)
- **Erweiterte Filteroptionen**: Fleischsorte, spezielle Bedürfnisse
- **Warenkorb & Checkout** mit Stripe Payment Integration
- **Bestellverwaltung** mit automatischen Bestätigungs-E-Mails
- **Produktbewertungen & Reviews** mit Sternesystem
- **Wishlist-Funktion** für registrierte Benutzer
- **Promotions & Bestseller** Bereiche

### 🤖 AI-Powered Chatbot

- **Intelligente Produktberatung** mit OpenAI GPT-4o-mini
- **Dynamische Fragenabfolge** basierend auf verfügbaren Produkten
- **Glasmorphismus-Design** mit modernem UI/UX
- **Minimieren-Funktion** für bessere Benutzererfahrung
- **Personalisierte Empfehlungen** basierend auf:
  - Alter des Hundes (Welpe/Erwachsen/Senior)
  - Besondere Bedürfnisse (Hypoallergen, Diät, Darm, Gelenke)
  - Bevorzugte Fleischsorte (8 Optionen)
- **Navigation-Features**:
  - Zurück-Button zur vorherigen Auswahl
  - "Weitere Produkte" zeigt alle altersgerechten Produkte
  - Beratung jederzeit beenden oder neu starten

### 👤 Benutzer-Features

- **Authentifizierung** mit Supabase Auth (Sign-up, Login, Password Reset)
- **Benutzerprofil** mit:
  - Persönliche Informationen
  - Lieferadressen
  - Bestellhistorie
  - Wishlist-Verwaltung
- **Admin-Dashboard** für Produktverwaltung

### 🎨 UI/UX

- **Responsive Design** für alle Geräte
- **Tailwind CSS** für modernes Styling
- **Glasmorphismus-Effekte** im Chatbot
- **Cookie-Banner** mit DSGVO-Konformität
- **SEO-optimiert** mit Next.js Metadata API

### 💳 Payment & Orders

- **Stripe Integration** für sichere Zahlungen
- **Webhook-basierte Bestellverarbeitung**
- **Automatische E-Mail-Benachrichtigungen**
- **Bestellstatus-Tracking**

---

## AI Chatbot

Der AI-Chatbot ist das Herzstück der Produktberatung und bietet eine intelligente, personalisierte Einkaufserfahrung:

### Design Features

- 🎨 **Glasmorphismus-Effekt**: Modernes, transparentes Design mit Backdrop-Blur
- 📏 **Minimieren-Funktion**: Nutzer können den Chat auf Titelleiste reduzieren
- 🎯 **Dynamische Buttons**: Nur verfügbare Optionen werden angezeigt
- 🔙 **Navigation**: Zurück-Button ermöglicht Korrektur von Auswahlen
- ⚫ **Klares UI**: Schwarzes X zum Schließen, durchdachte Farbgestaltung

### Produktfilterung Workflow

Der Chatbot nutzt eine mehrstufige Filterung:

1. **Altersgruppen-Auswahl**: Zeigt nur Optionen mit verfügbaren Produkten
2. **Bedürfnis-Auswahl**: Gefiltert nach Altersgruppe
3. **Fleischsorten-Auswahl**: Gefiltert nach Altersgruppe + Bedürfnisse
4. **Produktempfehlungen**: Passende Produkte mit Links
5. **Weitere Produkte**: Zeigt ALLE Produkte der Altersgruppe für mehr Auswahl

### Technische Details

- **OpenAI GPT-4o-mini** für natürliche Konversation
- **Supabase Queries** für Echtzeit-Produktverfügbarkeit
- **Rückwärts-Suche** in Message-History für aktuellste Auswahl
- **Automatisches Überspringen** bei nur einer verfügbaren Option
- **Fallback-Handling** für bessere User Experience

---

## Tech Stack

### Frontend

- **Next.js 19.2.3** mit App Router
- **React 19** mit Server Components
- **TypeScript** für Type Safety
- **Tailwind CSS** für Styling
- **Lucide React** für Icons

### Backend & Database

- **Supabase** (PostgreSQL)
  - Authentication & Authorization
  - Database (Products, Orders, Reviews, Wishlists)
  - Storage für Produktbilder
- **Supabase Auth** mit Cookie-based Sessions

### Payment & APIs

- **Stripe** für Zahlungsabwicklung
- **OpenAI API** (GPT-4o-mini) für AI Chatbot
- **Resend** für E-Mail-Versand

### Development Tools

- **ESLint** & **Prettier** für Code-Qualität
- **Git** für Versionskontrolle

---

## Getting Started

### Voraussetzungen

- Node.js 18+ installiert
- Supabase Account ([erstellen](https://database.new))
- Stripe Account ([erstellen](https://stripe.com))
- OpenAI API Key ([erstellen](https://platform.openai.com))

### Installation

1. **Repository klonen**

   ```bash
   git clone <repository-url>
   cd nextjs-final-e-commerce-project
   ```

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   
   Erstelle eine `.env.local` Datei:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=your_email@domain.com
   
   # App
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Supabase Datenbank Setup**
   
   Führe die SQL-Schemas aus `database/` aus:
   - `products.sql` - Produkttabellen
   - `orders.sql` - Bestellverwaltung
   - `reviews.sql` - Bewertungssystem
   - `wishlists.sql` - Wishlist-Funktionalität

5. **Stripe Webhooks konfigurieren**
   
   Siehe [WEBHOOK_SETUP_GUIDE.md](WEBHOOK_SETUP_GUIDE.md) für Details.

6. **Development Server starten**

   ```bash
   npm run dev
   ```

   Die App läuft jetzt auf [http://localhost:3000](http://localhost:3000)

---

## Projektstruktur

```text
nextjs-final-e-commerce-project/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin-Bereich
│   ├── (customer-service)/      # Kundenservice-Seiten
│   ├── (legal)/                 # Rechtliche Seiten (AGB, Datenschutz)
│   ├── (marketing)/             # Marketing-Seiten (About, Blog)
│   ├── (shop)/                  # Shop-Funktionalität
│   │   ├── cart/               # Warenkorb
│   │   ├── checkout/           # Checkout-Prozess
│   │   ├── products/           # Produktseiten
│   │   └── [category]/         # Kategorieseiten
│   ├── (user)/                  # Benutzerprofil
│   ├── api/                     # API Routes
│   │   ├── chatbot/            # AI Chatbot Endpoint
│   │   ├── webhooks/           # Stripe Webhooks
│   │   └── ...
│   └── auth/                    # Authentifizierung
├── components/                   # React Components
│   ├── AIChatbot.tsx           # AI Chatbot mit Glaseffekt
│   ├── Header.tsx              # Navigation
│   ├── Footer.tsx              # Footer
│   ├── ProductCard.tsx         # Produktkarte
│   └── ...
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx         # Auth-State
│   ├── CartContext.tsx         # Warenkorb-State
│   └── WishlistContext.tsx     # Wishlist-State
├── lib/                         # Utilities
│   ├── supabase/               # Supabase Client
│   └── stripe/                 # Stripe Utilities
└── types/                       # TypeScript Types
```

---

## Wichtige Dokumentationen

- [CART_IMPLEMENTATION.md](CART_IMPLEMENTATION.md) - Warenkorb-Implementierung
- [CHECKOUT_SUPABASE_INTEGRATION.md](CHECKOUT_SUPABASE_INTEGRATION.md) - Checkout-Prozess
- [WEBHOOK_SETUP_GUIDE.md](WEBHOOK_SETUP_GUIDE.md) - Stripe Webhooks Setup
- [BESTSELLER_USAGE.md](BESTSELLER_USAGE.md) - Bestseller-Feature
- [PROMOTIONS_IMPLEMENTATION.md](PROMOTIONS_IMPLEMENTATION.md) - Promotions-System
- [COOKIE_BANNER.md](COOKIE_BANNER.md) - Cookie-Banner Implementierung

---

## AI Chatbot Features im Detail

### Glasmorphismus-Design

```tsx
// Transparenter Hintergrund mit Blur-Effekt
backdrop-blur-xl bg-white/80
border border-white/20
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)
```

### Minimieren-Funktion

- Nutzer können Chat auf Headerzeile minimieren
- State-Management mit React useState
- Smooth Transitions für besseres UX
- Inhalte werden ausgeblendet, nur Header sichtbar

### Produktfilterung Details

1. **Nur verfügbare Optionen anzeigen**
   - Dynamische Supabase-Queries
   - Filtert nach Altersgruppe → Bedürfnisse → Fleischsorten

2. **Rückwärts-Suche in Message History**

   ```typescript
   // Findet die LETZTE Auswahl des Users
   for (let i = userMessages.length - 1; i >= 0; i--) {
     if (userMessages[i]?.content.includes("Junior")) {
       ageCategory = "JUNIOR";
       break;
     }
   }
   ```

3. **Auto-Skip bei einzelner Option**


   - Überspringt Fleischsorten-Frage wenn nur eine verfügbar
   - Verbessert User Flow

### Navigation Features
- **BACK Button**: Zurück zur Bedürfnis-Auswahl
- **Weitere Produkte**: Zeigt alle Produkte der Altersgruppe
- **Neu starten**: Kompletter Reset der Konversation
- **Beenden**: Freundliche Verabschiedung

---

## Deployment

### Vercel Deployment

1. **Repository mit Vercel verbinden**

   ```bash
   vercel
   ```

2. **Umgebungsvariablen in Vercel hinzufügen**


   - Alle `.env.local` Variablen in Vercel Dashboard eintragen

3. **Domain konfigurieren**
   - Custom Domain in Vercel Settings hinzufügen
   - `NEXT_PUBLIC_SITE_URL` aktualisieren

4. **Stripe Webhooks aktualisieren**
   - Production Webhook URL in Stripe Dashboard eintragen
   - `https://your-domain.com/api/webhooks/stripe`

---

## Support & Feedback

Bei Fragen oder Problemen, bitte ein Issue erstellen oder Kontakt aufnehmen.

## Lizenz

Dieses Projekt ist lizenziert unter der MIT License - siehe [LICENSE](LICENSE) Datei für Details.

---

## Entwickelt mit ❤️

Elite Dog Treats - Premium Hundefutter mit intelligenter Beratung
