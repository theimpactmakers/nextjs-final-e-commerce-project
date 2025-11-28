# Promotions-Integration

## Übersicht
Die Promotions-Funktionalität wurde vollständig in das E-Commerce-Projekt integriert. Aktive Promotions werden automatisch auf Produkten angewendet und sind überall im Frontend sichtbar.

## Implementierte Funktionen

### 1. **Promotions-Backend** (`lib/supabase/products.ts`)

#### `getActivePromotions()`
- Lädt alle aktiven Promotions aus der Supabase-Datenbank
- Berücksichtigt Start- und Enddatum
- Client-seitig nutzbar

#### `calculatePromotionDiscount(productId, variantId, basePrice)`
- Berechnet den Rabatt für ein spezifisches Produkt/Variante
- Unterstützt prozentuale und feste Rabatte
- Gibt folgende Daten zurück:
  - `originalPrice`: Ursprünglicher Preis
  - `discountedPrice`: Rabattierter Preis
  - `promotion`: Promotion-Objekt mit Name, Beschreibung, etc.
  - `discountAmount`: Rabattbetrag
  - `discountType`: "percentage" oder "fixed_amount"

#### `getActivePromotionsServer()`
- Server-seitige Version für bessere Performance
- Nutzbar in Server Components

### 2. **UI-Integration**

#### ProductCard.tsx (Produktdetail-Seite)
- ✅ Animiertes rotes "AKTION"-Badge mit Rabatt-Prozentsatz oder -Betrag
- ✅ Durchgestrichener Original-Preis
- ✅ Rabattierter Preis wird angezeigt
- ✅ Promotion-Name wird als Label angezeigt
- ✅ Badge pulsiert (animate-pulse) für bessere Sichtbarkeit
- ✅ Promotions haben Vorrang vor Standard-Rabatten (compare_at_price)

#### ShopProductCard.tsx (Shop-Übersicht)
- ✅ Promotion-Badge oben rechts auf dem Produktbild
- ✅ Preis wird mit Rabatt angezeigt
- ✅ Durchgestrichener Original-Preis
- ✅ Promotion-Name wird angezeigt
- ✅ Dynamisches Laden der Promotions beim Komponenten-Mount

#### BestsellerCarousel.tsx (Startseite)
- ✅ Kompaktes rotes Promotion-Badge oben links
- ✅ Preis wird mit Rabatt angezeigt
- ✅ Durchgestrichener Original-Preis
- ✅ Alle Bestseller-Produkte werden auf Promotions überprüft
- ✅ Asynchrones Laden aller Promotions beim Mount

## Datenbank-Struktur

Die Promotions-Tabelle in Supabase hat folgende Struktur:

```typescript
type Promotion = {
  id: string;
  name: string;                    // z.B. "Black Friday Sale"
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;          // z.B. 20 (für 20%) oder 5 (für €5)
  applies_to: "all" | "specific_products" | "specific_variants";
  product_ids: string[] | null;    // Wenn specific_products
  variant_ids: string[] | null;    // Wenn specific_variants
  starts_at: string;               // ISO 8601 DateTime
  ends_at: string;                 // ISO 8601 DateTime
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Verwendungsbeispiele

### Promotion in Admin-Panel erstellen

```javascript
// Beispiel: 20% Rabatt auf bestimmte Produkte
const promotion = {
  name: "Sommersale 20%",
  discount_type: "percentage",
  discount_value: 20,
  applies_to: "specific_products",
  product_ids: ["product-id-1", "product-id-2"],
  starts_at: "2025-11-28T00:00:00Z",
  ends_at: "2025-12-05T23:59:59Z",
  is_active: true
};
```

### Promotion überall sichtbar

1. **Produktdetail-Seite** - Großes animiertes Badge
2. **Shop-Übersicht** - Kompaktes Badge auf Produktkarte
3. **Startseite (Bestseller)** - Kleines Badge im Carousel
4. **Warenkorb** - Mit rabattiertem Preis (automatisch über ProductCard)

## Visuelles Design

- **Badge-Farbe**: Rot (#dc2626) mit weißem Text
- **Animation**: Pulsierender Effekt (animate-pulse) für Aufmerksamkeit
- **Preis-Display**: 
  - Großer fetter Rabattpreis in Primary-Farbe
  - Durchgestrichener Original-Preis in grau
  - Promotion-Name als rotes Label

## Performance-Optimierung

- Promotions werden asynchron geladen
- Nicht blockierend für Seitenaufbau
- Promotions-Cache durch Supabase
- Effiziente Datenbankabfragen mit Datums-Filtern

## Zukünftige Erweiterungen

- [ ] Promotion-Gutscheincodes
- [ ] Staffelrabatte (z.B. 3+ Stück = 15% Rabatt)
- [ ] Kategoriebasierte Promotions
- [ ] Zeitgesteuerte Flash-Sales
- [ ] Automatische Promotion-Erneuerung

## Testing

Um Promotions zu testen:

1. Admin-Panel öffnen und eine neue Promotion erstellen
2. `is_active` auf `true` setzen
3. `starts_at` auf aktuelles Datum setzen
4. `ends_at` auf zukünftiges Datum setzen
5. Seite neuladen - Promotion sollte sichtbar sein
