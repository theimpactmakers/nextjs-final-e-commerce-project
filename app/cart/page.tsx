"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

// Temporäre Mock-Daten - später durch echten Warenkorb-State ersetzen
const initialCartItems = [
  {
    id: 1,
    name: "Premium Welpenfutter",
    price: 24.99,
    quantity: 2,
    image: "https://placehold.co/100x100",
    weight: "3kg",
  },
  {
    id: 2,
    name: "Adult Trockenfutter",
    price: 34.99,
    quantity: 1,
    image: "https://placehold.co/100x100",
    weight: "5kg",
  },
];

export default function WarenkorbPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
    // Hier könnte man den Warenkorb aus localStorage laden
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Fehler beim Laden des Warenkorbs:", e);
      }
    }
  }, []);

  // Warenkorb in localStorage speichern
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (confirm("Möchtest du den Warenkorb wirklich leeren?")) {
      setCartItems([]);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  // Verhindere Hydration-Fehler
  if (!mounted) {
    return null;
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Warenkorb</h1>
        {cartItems.length > 0 && (
          <Button variant="outline" onClick={clearCart} size="sm">
            Warenkorb leeren
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Dein Warenkorb ist leer
            </p>
            <Button asChild>
              <Link href="/shop">Jetzt einkaufen</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Warenkorb-Artikel */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md bg-muted"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.weight || ""}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {item.price.toFixed(2)} €
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          Entfernen
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Zusammenfassung */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Bestellübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zwischensumme</span>
                  <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versand</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `${shipping.toFixed(2)} €`
                    )}
                  </span>
                </div>
                {subtotal < 50 && subtotal > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 Noch {(50 - subtotal).toFixed(2)} € bis kostenloser Versand!
                    </p>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamt</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Zur Kasse</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/shop">Weiter einkaufen</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
