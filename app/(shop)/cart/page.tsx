"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Wallet,
  Truck,
} from "lucide-react";

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

  // Calculate promotion savings
  const promotionSavings = items.reduce((total, item) => {
    if (item.original_price && item.original_price > item.price) {
      return total + (item.original_price - item.price) * item.quantity;
    }
    return total;
  }, 0);

  // Calculate shipping savings (if free shipping applies)
  const shippingSavings = totalPrice >= 50 ? 4.99 : 0;

  // Total savings
  const totalSavings = promotionSavings + shippingSavings;

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
          <ShoppingCart className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">
            Ihr Warenkorb ist aktuell leer!
          </h2>
          <p className="text-muted-foreground">
            Füge Produkte hinzu, um mit dem Einkauf zu beginnen.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-(--app-radius) border-2 border-accent-foreground text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent-700 hover:scale-105 h-11 px-8 mt-4"
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dein Warenkorb</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 text-sm mr-16 mt-10 text-destructive hover:text-destructive/80 cursor-pointer"
          >
            <Trash2 className="w-6 h-6" />
            Gesamten Warenkorb leeren
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-8 p-4 bg-card rounded-lg border shadow-sm"
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
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground"></div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.variant_name}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-lg font-bold text-primary">
                    {item.price.toFixed(2)} €
                  </p>
                  {item.original_price && item.original_price > item.price && (
                    <p className="text-sm text-muted-foreground line-through">
                      {item.original_price.toFixed(2)} €
                    </p>
                  )}
                </div>

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
                <div className="flex items-center gap-10 w-full justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="group inline-flex items-center justify-center w-8 h-8 rounded-md border-2 border-accent bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Menge verringern"
                    >
                      <Minus
                        className="w-4 h-4 text-accent group-hover:text-white"
                        strokeWidth={2}
                      />
                    </button>

                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="group inline-flex items-center justify-center w-8 h-8 rounded-md border-2 border-accent bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Menge erhöhen"
                    >
                      <Plus
                        className="w-4 h-4 text-accent group-hover:text-white"
                        strokeWidth={3}
                      />
                    </button>
                  </div>
                  <span className="text-lg font-bold min-w-[60px] text-right">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-muted-foreground transition-colors cursor-pointer group"
                    aria-label="Artikel entfernen"
                  >
                    <Trash2 className="w-7 h-7 mr-4 text-accent group-hover:scale-85 group-hover:text-black transition-transform duration-150" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 p-6 bg-muted/80 rounded-lg border  shadow-md space-y-4 backdrop-blur-md">
            <h2 className="text-xl font-bold">Bestellübersicht</h2>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-bold">
                  Zwischensumme
                </span>
                <span className="font-medium">{totalPrice.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-bold">
                  Versandkosten
                </span>
                <span className="font-medium">
                  {totalPrice >= 50 ? "Kostenlos" : "4,99 €"}
                </span>
              </div>

              {totalPrice < 50 && (
                <p className="text-xs mt-4 text-primary">
                  Nur noch {(50 - totalPrice).toFixed(2)} € bis zum kostenlosen
                  Versand!
                </p>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>Gesamtbetrag</span>
              <span className="flex flex-col items-end text-accent leading-tight">
                <span className="text-lg font-bold">
                  {(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)} €
                </span>
                <span className="text-xs text-black mt-0 leading-none font-light">
                  inkl. MwSt.
                </span>
              </span>
            </div>

            {/* Total Savings Display */}
            {totalSavings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium text-center">
                  🎉 Sie sparen{" "}
                  <span className="font-bold">{totalSavings.toFixed(2)} €</span>
                  {promotionSavings > 0 && shippingSavings > 0 && (
                    <span className="text-xs block mt-1">
                      ({promotionSavings.toFixed(2)} € Rabatt +{" "}
                      {shippingSavings.toFixed(2)} € Versand)
                    </span>
                  )}
                  {promotionSavings > 0 && shippingSavings === 0 && (
                    <span className="text-xs block mt-1">(Rabatt)</span>
                  )}
                  {promotionSavings === 0 && shippingSavings > 0 && (
                    <span className="text-xs block mt-1">
                      (Kostenloser Versand)
                    </span>
                  )}
                </p>
              </div>
            )}

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-(--app-radius) border-2 border-accent-foreground text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent-700 hover:scale-105 h-11 px-8"
            >
              Zur Kasse
            </Link>

            <Link
              href="/shop"
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-(--app-radius) text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-black bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Weiter einkaufen
            </Link>

            {/* Trust Badges */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="w-4 h-4 text-green-600" />
                Sichere & schnelle Bezahlung
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
                <Truck className="w-4 h-4 text-green-600" />
                Schnelle Lieferung: 1-3 Werktage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
