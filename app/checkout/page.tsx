"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier würde die Bestellung verarbeitet werden
    console.log("Bestellung aufgeben:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Mock Warenkorb-Daten
  const cartTotal = 64.97;
  const shipping = 0;
  const total = cartTotal + shipping;

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Kasse</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout-Formular */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kontaktinformationen */}
            <Card>
              <CardHeader>
                <CardTitle>Kontaktinformationen</CardTitle>
                <CardDescription>
                  Gib deine E-Mail-Adresse für Bestellbestätigungen ein
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="deine@email.de"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lieferadresse */}
            <Card>
              <CardHeader>
                <CardTitle>Lieferadresse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Straße und Hausnummer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">PLZ</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Zahlungsmethode */}
            <Card>
              <CardHeader>
                <CardTitle>Zahlungsmethode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                    <input type="radio" name="payment" defaultChecked />
                    <div>
                      <p className="font-medium">Kreditkarte</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                    <input type="radio" name="payment" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        Schnell und sicher mit PayPal bezahlen
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                    <input type="radio" name="payment" />
                    <div>
                      <p className="font-medium">Rechnung</p>
                      <p className="text-sm text-muted-foreground">
                        Zahlung innerhalb von 14 Tagen
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Jetzt kostenpflichtig bestellen
            </Button>
          </form>
        </div>

        {/* Bestellübersicht */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Bestellübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span className="font-medium">{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Versand</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Gesamt</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Inkl. MwSt.
                </p>
              </div>
              <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>SSL-verschlüsselte Zahlung</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>30 Tage Rückgaberecht</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Versand in 2-3 Werktagen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
