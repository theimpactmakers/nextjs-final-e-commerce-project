"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      // Redirect after successful login
      router.push(redirectTo);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="bg-linear-to-r from-primary to-accent text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Bei deinem Profil anmelden
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Melden Sie sich an, um auf Ihr Kundenkonto zuzugreifen
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-1 w-12 bg-linear-to-r from-primary to-accent rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-4">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="E-Mail-Adresse*"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Passwort*"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />

              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
                >
                  Passwort vergessen?
                </Link>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Wird angemeldet..." : "JETZT ANMELDEN"}
            </button>

            <div className="text-center">
              <Link
                href="/auth/sign-up"
                className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
              >
                Noch kein Konto? Jetzt registrieren
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
