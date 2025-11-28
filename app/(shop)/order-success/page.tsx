"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="container max-w-2xl px-4 py-16 mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-600" />
        </div>

        <h1 className="mb-4 text-3xl font-bold">
          Vielen Dank für Ihre Bestellung!
        </h1>

        {orderNumber && (
          <div className="p-6 mb-6 border rounded-lg bg-muted/50">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Bestellnummer
            </p>
            <p className="text-2xl font-bold">{orderNumber}</p>
          </div>
        )}

        <div className="mb-8 space-y-3 text-muted-foreground">
          <p>
            Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich
            bearbeiten.
          </p>
          <p>
            Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details zu
            Ihrer Bestellung.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="px-6 py-3 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
          >
            Weiter einkaufen
          </Link>
          <Link
            href="/userProfile"
            className="px-6 py-3 transition-colors border rounded-lg hover:bg-muted"
          >
            Meine Bestellungen
          </Link>
        </div>

        <div className="pt-8 mt-8 border-t">
          <h2 className="mb-4 text-lg font-semibold">Wie geht es weiter?</h2>
          <div className="space-y-3 text-left text-muted-foreground">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>
                Sie erhalten eine Bestätigungs-E-Mail mit allen Bestelldetails
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>Wir bereiten Ihre Bestellung sorgfältig vor</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>
                Sie erhalten eine Versandbenachrichtigung mit Tracking-Nummer
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <p>Ihr Paket wird innerhalb von 2-5 Werktagen geliefert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-2xl px-4 py-16 mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">
            Lade Bestellbestätigung...
          </h1>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
