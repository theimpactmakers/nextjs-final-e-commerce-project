import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdressenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/konto"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zum Konto
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Meine Adressen</h1>
        <Button>Neue Adresse hinzufügen</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Standard-Lieferadresse */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Standard-Lieferadresse</CardTitle>
                <CardDescription>Hauptadresse für Lieferungen</CardDescription>
              </div>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Standard
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium">Max Mustermann</p>
            <p className="text-sm">Musterstraße 123</p>
            <p className="text-sm">12345 Musterstadt</p>
            <p className="text-sm">Deutschland</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                Bearbeiten
              </Button>
              <Button variant="outline" size="sm">
                Löschen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rechnungsadresse */}
        <Card>
          <CardHeader>
            <CardTitle>Rechnungsadresse</CardTitle>
            <CardDescription>Adresse für Rechnungen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium">Max Mustermann</p>
            <p className="text-sm">Musterstraße 123</p>
            <p className="text-sm">12345 Musterstadt</p>
            <p className="text-sm">Deutschland</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                Bearbeiten
              </Button>
              <Button variant="outline" size="sm">
                Löschen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Weitere Adressen können hinzugefügt werden.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
