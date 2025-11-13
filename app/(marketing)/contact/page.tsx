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
import { useState } from "react";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset status when user starts typing again
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simuliere API-Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Kontaktformular gesendet:", formData);
      
      setSubmitStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Fehler beim Senden:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Kontakt</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Kontaktformular */}
        <Card>
          <CardHeader>
            <CardTitle>Schreib uns eine Nachricht</CardTitle>
            <CardDescription>
              Wir melden uns innerhalb von 24 Stunden bei dir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitStatus === "success" && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Deine Nachricht wurde erfolgreich gesendet!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Wir melden uns so schnell wie möglich bei dir.
                </p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ✗ Es ist ein Fehler aufgetreten.
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Bitte versuche es später erneut oder kontaktiere uns direkt per E-Mail.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dein Name"
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="subject">Betreff</Label>
                <Input
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Worum geht es?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Nachricht</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Deine Nachricht..."
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Kontaktinformationen */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium">E-Mail</p>
                  <p className="text-muted-foreground">info@elite-dog-treats.de</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium">Telefon</p>
                  <p className="text-muted-foreground">+49 123 456 7890</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-muted-foreground">
                    Musterstraße 123
                    <br />
                    12345 Musterstadt
                    <br />
                    Deutschland
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Öffnungszeiten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montag - Freitag</span>
                <span className="font-medium">9:00 - 18:00 Uhr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Samstag</span>
                <span className="font-medium">10:00 - 16:00 Uhr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sonntag</span>
                <span className="font-medium">Geschlossen</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soziale Medien</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="icon">
                FB
              </Button>
              <Button variant="outline" size="icon">
                IG
              </Button>
              <Button variant="outline" size="icon">
                TW
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
