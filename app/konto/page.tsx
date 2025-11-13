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

export default async function KontoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Mein Konto</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Benutzerprofil */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profil-Informationen</CardTitle>
            <CardDescription>
              Verwalte deine persönlichen Daten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">E-Mail</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mitglied seit</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString("de-DE")}
              </p>
            </div>
            <Button variant="outline">Profil bearbeiten</Button>
          </CardContent>
        </Card>

        {/* Schnelllinks */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bestellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/konto/bestellungen">Alle Bestellungen anzeigen</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adressbuch</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/konto/adressen">Adressen verwalten</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Einstellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/konto/einstellungen">Einstellungen ändern</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Letzte Bestellungen */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Letzte Bestellungen</CardTitle>
            <CardDescription>
              Deine zuletzt aufgegebenen Bestellungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Du hast noch keine Bestellungen aufgegeben.</p>
              <Button asChild className="mt-4">
                <Link href="/shop">Jetzt einkaufen</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
