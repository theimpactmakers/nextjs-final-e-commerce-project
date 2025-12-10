import { getCustomerDetails } from "../actions";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Star,
  User,
  Shield,
} from "lucide-react";
import { notFound } from "next/navigation";
import { CustomerRoleUpdate } from "./CustomerRoleUpdate";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerDetails(id);

  if (!customer) {
    notFound();
  }

  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    "Unbenannter Kunde";

  // Calculate customer stats
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const totalSpent =
    customer.orders
      ?.filter((o: any) => o.payment_status === "paid")
      .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0) || 0;

  const averageOrderValue =
    customer.orders && customer.orders.length > 0
      ? totalSpent / customer.orders.length
      : 0;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="cursor-pointer rounded-lg border border-border p-2 hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
          <p className="mt-1 text-muted-foreground">{customer.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {customer.role === "admin" && (
            <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
              <Shield className="h-4 w-4" />
              Admin
            </span>
          )}
          {customer.email_confirmed ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              E-Mail bestätigt
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
              E-Mail nicht bestätigt
            </span>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="rounded-lg bg-card p-6 shadow border border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Bestellungen</p>
              <p className="text-2xl font-bold text-foreground">
                {customer.orders?.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card p-6 shadow border border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-accent">€</span>
            <div>
              <p className="text-sm text-muted-foreground">Gesamtumsatz</p>
              <p className="text-2xl font-bold text-foreground">
                {totalSpent.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card p-6 shadow border border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Ø Bestellwert</p>
              <p className="text-2xl font-bold text-foreground">
                {averageOrderValue.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card p-6 shadow border border-border">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Bewertungen</p>
              <p className="text-2xl font-bold text-foreground">
                {customer.reviews?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Information */}
          <div className="rounded-lg bg-card p-6 shadow border border-border">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
              <User className="h-5 w-5" />
              Profil Informationen
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Vorname
                  </label>
                  <p className="mt-1 text-foreground">
                    {customer.first_name || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nachname
                  </label>
                  <p className="mt-1 text-foreground">
                    {customer.last_name || "—"}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Geschlecht
                  </label>
                  <p className="mt-1 text-foreground">
                    {customer.gender === "M"
                      ? "Männlich"
                      : customer.gender === "F"
                      ? "Weiblich"
                      : customer.gender === "D"
                      ? "Divers"
                      : "—"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Geburtsdatum
                  </label>
                  <p className="mt-1 text-foreground">
                    {customer.date_of_birth
                      ? new Date(customer.date_of_birth).toLocaleDateString(
                          "de-DE"
                        )
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Registriert am
                  </label>
                  <p className="mt-1 text-foreground">
                    {new Date(customer.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Letzter Login
                  </label>
                  <p className="mt-1 text-foreground">
                    {customer.last_sign_in
                      ? new Date(customer.last_sign_in).toLocaleDateString(
                          "de-DE",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="rounded-lg bg-card p-6 shadow border border-border">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
              <MapPin className="h-5 w-5" />
              Adressen ({customer.addresses?.length || 0})
            </h2>
            <div className="space-y-4">
              {customer.addresses && customer.addresses.length > 0 ? (
                /* eslint-disable @typescript-eslint/no-explicit-any */
                customer.addresses.map((address: any) => (
                  <div
                    key={address.id}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {address.address_type === "billing"
                          ? "Rechnungsadresse"
                          : "Lieferadresse"}
                      </span>
                      {address.is_default && (
                        <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                          Standard
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-foreground">
                      {address.company && (
                        <p className="font-medium">{address.company}</p>
                      )}
                      <p>
                        {address.first_name} {address.last_name}
                      </p>
                      <p>
                        {address.street} {address.house_number}
                      </p>
                      {address.address_line2 && <p>{address.address_line2}</p>}
                      <p>
                        {address.postal_code} {address.city}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && <p className="mt-1">{address.phone}</p>}
                    </div>
                  </div>
                ))
              ) : (
                /* eslint-enable @typescript-eslint/no-explicit-any */
                <p className="text-muted-foreground">
                  Keine Adressen hinterlegt
                </p>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="rounded-lg bg-card p-6 shadow border border-border">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
              <ShoppingBag className="h-5 w-5" />
              Bestellhistorie ({customer.orders?.length || 0})
            </h2>
            <div className="space-y-3">
              {customer.orders && customer.orders.length > 0 ? (
                /* eslint-disable @typescript-eslint/no-explicit-any */
                customer.orders.map((order: any) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block rounded-lg border border-border bg-muted/30 p-4 hover:border-accent hover:bg-accent/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            "de-DE"
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {order.total_amount.toFixed(2)}€
                        </p>
                        <div className="flex gap-2">
                          <span
                            className={`text-xs font-medium ${
                              order.status === "delivered"
                                ? "text-green-600"
                                : order.status === "cancelled"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              order.payment_status === "paid"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                /* eslint-enable @typescript-eslint/no-explicit-any */
                <p className="text-muted-foreground">
                  Keine Bestellungen vorhanden
                </p>
              )}
            </div>
          </div>

          {/* Reviews */}
          {customer.reviews && customer.reviews.length > 0 && (
            <div className="rounded-lg bg-card p-6 shadow border border-border">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Star className="h-5 w-5" />
                Bewertungen ({customer.reviews.length})
              </h2>
              <div className="space-y-3">
                {/* eslint-disable @typescript-eslint/no-explicit-any */}
                {customer.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString(
                          "de-DE"
                        )}
                      </span>
                    </div>
                    {review.title && (
                      <p className="font-medium text-foreground">
                        {review.title}
                      </p>
                    )}
                    {review.comment && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                    {review.products && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Produkt: {review.products.name}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      {review.is_verified_purchase && (
                        <span className="text-xs text-green-600">
                          Verifizierter Kauf
                        </span>
                      )}
                      {review.is_approved ? (
                        <span className="text-xs text-green-600">
                          Genehmigt
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-600">
                          Ausstehend
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {/* eslint-enable @typescript-eslint/no-explicit-any */}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Role Management */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Rollenverwaltung
            </h3>
            <CustomerRoleUpdate
              customerId={customer.id}
              currentRole={customer.role || "user"}
            />
          </div>

          {/* Account Info */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Account Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-700">Kunden-ID</label>
                <p className="mt-1 font-mono text-xs text-gray-600">
                  {customer.id}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  E-Mail Status
                </label>
                <p className="mt-1 text-gray-900">
                  {customer.email_confirmed
                    ? "✓ Bestätigt"
                    : "✗ Nicht bestätigt"}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Rolle</label>
                <p className="mt-1 text-gray-900">
                  {customer.role === "admin" ? "Administrator" : "Kunde"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
