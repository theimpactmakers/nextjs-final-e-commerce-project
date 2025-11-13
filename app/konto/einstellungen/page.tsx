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

export default function EinstellungenPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Passwort-Änderung Logik hier
    console.log("Passwort ändern:", formData);
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/konto"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zum Konto
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">Einstellungen</h1>

      <div className="space-y-6">
        {/* Passwort ändern */}
        <Card>
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
            <CardDescription>
              Aktualisiere dein Passwort für mehr Sicherheit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Neues Passwort</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit">Passwort ändern</Button>
            </form>
          </CardContent>
        </Card>

        {/* E-Mail-Benachrichtigungen */}
        <Card>
          <CardHeader>
            <CardTitle>E-Mail-Benachrichtigungen</CardTitle>
            <CardDescription>
              Verwalte deine E-Mail-Präferenzen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bestellbestätigungen</p>
                <p className="text-sm text-muted-foreground">
                  Erhalte E-Mails zu deinen Bestellungen
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">
                  Informationen über neue Produkte und Angebote
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Versandbenachrichtigungen</p>
                <p className="text-sm text-muted-foreground">
                  Updates zum Versandstatus
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <Button variant="outline">Einstellungen speichern</Button>
          </CardContent>
        </Card>

        {/* Konto löschen */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Konto löschen</CardTitle>
            <CardDescription>
              Lösche dein Konto und alle zugehörigen Daten dauerhaft
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine
              Daten, Bestellungen und Adressen werden dauerhaft gelöscht.
            </p>
            <Button variant="destructive">Konto löschen</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
