# Bestseller Produkte - Verwendungsbeispiele

## 1. Client Component (z.B. für Slider)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { getBestsellers } from '@/lib/supabase/products'
import ProductCard from '@/components/ProductCard'

export default function BestsellerSlider() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBestsellers() {
      const data = await getBestsellers(8) // Holt 8 Bestseller
      setProducts(data)
      setLoading(false)
    }
    
    loadBestsellers()
  }, [])

  if (loading) return <div>Lädt...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## 2. Server Component (Bessere Performance)

```tsx
import { getBestsellersServer } from '@/lib/supabase/products'
import ProductCard from '@/components/ProductCard'

export default async function BestsellerSection() {
  const products = await getBestsellersServer(8)

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6">Unsere Bestseller</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
```

## 3. Mit Filtern (z.B. nur Trockenfutter-Bestseller)

```tsx
import { getBestsellersWithFilters } from '@/lib/supabase/products'

// Holt nur Trockenfutter-Bestseller die auf Lager sind
const products = await getBestsellersWithFilters({
  limit: 6,
  category: 'Trockenfutter',
  inStock: true,
  minPrice: 10,
  maxPrice: 50
})
```

## 4. Produkt als Bestseller markieren (Admin-Funktion)

```tsx
'use client'

import { setProductBestseller } from '@/lib/supabase/products'

async function handleToggleBestseller(productId: string, currentStatus: boolean) {
  const result = await setProductBestseller(productId, !currentStatus)
  
  if (result.success) {
    alert('Bestseller-Status erfolgreich geändert!')
  } else {
    alert('Fehler beim Ändern des Status')
  }
}

// In deinem Admin-Panel
<button onClick={() => handleToggleBestseller(product.id, product.bestseller)}>
  {product.bestseller ? 'Von Bestseller entfernen' : 'Als Bestseller markieren'}
</button>
```

## 5. Mehrere Produkte auf einmal als Bestseller setzen

```tsx
import { setBulkBestsellers } from '@/lib/supabase/products'

// Markiere mehrere Produkte als Bestseller
const productIds = ['id1', 'id2', 'id3', 'id4']
await setBulkBestsellers(productIds, true)

// Entferne Bestseller-Status von mehreren Produkten
await setBulkBestsellers(productIds, false)
```

## 6. Anzahl der Bestseller anzeigen

```tsx
import { countBestsellers } from '@/lib/supabase/products'

const bestsellerCount = await countBestsellers()
console.log(`Es gibt ${bestsellerCount} Bestseller`)
```

## 7. Auf Homepage verwenden

```tsx
// app/page.tsx
import { getBestsellersServer } from '@/lib/supabase/products'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
  const bestsellers = await getBestsellersServer(4) // Nur 4 für Homepage

  return (
    <main>
      {/* Hero Section */}
      <section>{/* ... */}</section>

      {/* Bestseller Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🔥 Unsere Bestseller</h2>
          <Link href="/shop?bestseller=true" className="text-accent hover:underline">
            Alle anzeigen →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
```

## 8. SQL Query (zum manuellen Setzen in Supabase)

```sql
-- Setze spezifische Produkte als Bestseller (über Produkt-Namen)
UPDATE products 
SET bestseller = true 
WHERE name IN (
  'Premium Trockenfutter Huhn',
  'Bio Nassfutter Rind',
  'Welpen Starter Pack'
);

-- Setze Top 10 meistverkaufte als Bestseller (wenn du eine sales_count Spalte hast)
UPDATE products 
SET bestseller = true 
WHERE id IN (
  SELECT id FROM products 
  ORDER BY sales_count DESC 
  LIMIT 10
);

-- Alle Bestseller anzeigen
SELECT name, price, bestseller 
FROM products 
WHERE bestseller = true;
```

## TypeScript Type (schon in der Funktion enthalten)

Die Funktionen nutzen automatisch die korrekten Types aus deiner `Database` Type-Definition.
