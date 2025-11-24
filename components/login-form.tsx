"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/auth/actions";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  
  const [state, formAction] = useFormState(login, {
    message: "",
    errors: {},
    redirectTo: null,
  });

  // Weiterleitung zur ursprünglichen Seite nach erfolgreichem Login
  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.redirectTo, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="bg-card text-card-foreground rounded-xl border shadow-xs">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Anmelden
          </h3>
          <p className="text-sm text-muted-foreground">
            Melde dich hier bei deinem Profil an!
          </p>
        </div>
        <div className="p-6 pt-0">
          <form action={formAction}>
            {/* Hidden redirect field */}
            <input type="hidden" name="redirect" value={redirectTo} />
            
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email-Adresse
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  aria-invalid={state?.errors?.email ? "true" : "false"}
                  aria-describedby={state?.errors?.email ? "email-error" : undefined}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {state?.errors?.email && (
                  <p id="email-error" className="text-sm text-red-500" role="alert">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Passwort
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-invalid={state?.errors?.password ? "true" : "false"}
                  aria-describedby={state?.errors?.password ? "password-error" : undefined}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {state?.errors?.password && (
                  <p id="password-error" className="text-sm text-red-500" role="alert">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              {state?.message && (
                <p className="text-sm text-red-500" role="alert">
                  {state.message}
                </p>
              )}
              <SubmitButton />
            </div>
            <div className="mt-4 text-center text-sm">
              Hast Du noch keinen Account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4 text-muted-foreground"
              >
                Registrieren
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}