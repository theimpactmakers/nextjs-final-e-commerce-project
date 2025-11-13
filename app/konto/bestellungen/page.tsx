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

// Mock Bestelldaten - später aus Datenbank
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-11-10",
    status: "Versandt",
    total: 64.97,
    items: 3,
  },
  {
    id: "ORD-2024-002",
    date: "2024-10-28",
    status: "Zugestellt",
    total: 39.99,
    items: 1,
  },
];

export default async function BestellungenPage() {
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

      <h1 className="text-4xl font-bold mb-8">Meine Bestellungen</h1>

      <div className="space-y-4">
        {mockOrders.length > 0 ? (
          mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Bestellung {order.id}</CardTitle>
                    <CardDescription>
                      Aufgegeben am{" "}
                      {new Date(order.date).toLocaleDateString("de-DE")}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Versandt"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Zugestellt"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {order.items} Artikel
                    </p>
                    <p className="text-xl font-bold">{order.total.toFixed(2)} €</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Rechnung
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Du hast noch keine Bestellungen aufgegeben.
              </p>
              <Button asChild>
                <Link href="/shop">Jetzt einkaufen</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
