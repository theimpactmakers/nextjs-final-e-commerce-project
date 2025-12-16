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
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
        {success ? (
          <>
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <div className="bg-linear-to-r from-green-500 to-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                E-Mail versendet
              </h1>
              <p className="text-gray-600 text-base max-w-2xl mx-auto">
                Überprüfen Sie Ihr Postfach für weitere Anweisungen
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 bg-linear-to-r from-primary to-accent rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-center">
                Falls Sie sich mit Ihrer E-Mail-Adresse und Passwort registriert
                haben, erhalten Sie eine E-Mail zum Zurücksetzen des Passworts.
              </p>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Keine E-Mail erhalten oder benötigen Sie einen neuen Link?
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold rounded-full transition-colors"
                >
                  Erneut Link anfordern
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <div className="bg-linear-to-r from-primary to-accent text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                Passwort zurücksetzen
              </h1>
              <p className="text-gray-600 text-base max-w-2xl mx-auto">
                Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 bg-linear-to-r from-primary to-accent rounded-full"></div>
              </div>
            </div>

            <form onSubmit={handleForgotPassword}>
              <div className="space-y-4">
                <input
                  id="email"
                  type="email"
                  placeholder="E-Mail-Adresse*"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                />

                {error && (
                  <div className="p-4 rounded-full bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Wird gesendet..." : "LINK ZUM ZURÜCKSETZEN SENDEN"}
                </button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
                  >
                    Zurück zur Anmeldung
                  </Link>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
