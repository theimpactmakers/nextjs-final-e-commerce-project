"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const {
    items,
    itemCount,
    totalPrice,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (isLoading) {
    return (
      <div className="container max-w-6xl px-4 py-16 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">
            Warenkorb wird geladen...
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-6xl px-4 py-16 mx-auto">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Ihr Warenkorb ist leer</h2>
          <p className="text-muted-foreground">
            Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Weiter einkaufen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Warenkorb</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 text-sm text-destructive hover:text-destructive/80"
          >
            <Trash2 className="w-4 h-4" />
            Warenkorb leeren
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-card rounded-lg border shadow-sm"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 shrink-0 bg-muted rounded-md overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.variant_name}
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  {item.price.toFixed(2)} €
                </p>

                {/* Stock Warning */}
                {item.stock_quantity < 5 && item.stock_quantity > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Nur noch {item.stock_quantity} auf Lager!
                  </p>
                )}
                {item.stock_quantity === 0 && (
                  <p className="text-xs text-destructive mt-1">
                    Nicht auf Lager
                  </p>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Artikel entfernen"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Menge verringern"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock_quantity}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Menge erhöhen"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-semibold">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 p-6 bg-card rounded-lg border shadow-md space-y-4">
            <h2 className="text-xl font-bold">Bestellübersicht</h2>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span className="font-medium">{totalPrice.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Versand</span>
                <span className="font-medium">
                  {totalPrice >= 50 ? "Kostenlos" : "4,99 €"}
                </span>
              </div>

              {totalPrice < 50 && (
                <p className="text-xs text-muted-foreground">
                  Noch {(50 - totalPrice).toFixed(2)} € bis zum kostenlosen
                  Versand
                </p>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>Gesamt</span>
              <span className="text-primary">
                {(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)} €
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Zur Kasse
            </Link>

            <Link
              href="/shop"
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Weiter einkaufen
            </Link>

            {/* Trust Badges */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Sichere Zahlung
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Kostenlose Rücksendung
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Schnelle Lieferung
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
