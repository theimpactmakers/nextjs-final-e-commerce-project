"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: resetError } = await forgotPassword(email);

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <div className="bg-card text-card-foreground rounded-xl border shadow-xs">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Überprüfen Sie Ihre E-Mails
            </h3>
            <p className="text-sm text-muted-foreground">
              Anweisungen zum Zurücksetzen des Passworts gesendet
            </p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Falls Sie sich mit Ihrer E-Mail-Adresse und Passwort registriert
              haben, erhalten Sie eine E-Mail zum Zurücksetzen des Passworts.
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Keine E-Mail erhalten oder benötigen Sie einen neuen Link?
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full border border-input bg-background"
              >
                Erneut Link anfordern
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card text-card-foreground rounded-xl border shadow-xs">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Passwort zurücksetzen
            </h3>
            <p className="text-sm text-muted-foreground">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link
              zum Zurücksetzen Ihres Passworts
            </p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Wird gesendet..."
                    : "Link zum Zurücksetzen senden"}
                </button>
              </div>
              <div className="mt-4 text-center text-sm">
                Haben Sie bereits ein Konto?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Anmelden
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
