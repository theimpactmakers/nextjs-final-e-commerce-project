"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { signUp } = useAuth();

  // User Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Personal Info (Required)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Personal Info (Optional)
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Address Info (Required)
  const [company, setCompany] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("DE");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (password !== repeatPassword) {
      setError("Passwörter stimmen nicht überein");
      setIsLoading(false);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Vor- und Nachname sind erforderlich");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user metadata
      const userMetadata: Record<string, string> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      };

      // Add optional personal data
      if (gender) userMetadata.gender = gender;
      if (dateOfBirth) userMetadata.date_of_birth = dateOfBirth;

      // Add address data (all required now)
      userMetadata.company = company;
      userMetadata.street = street;
      userMetadata.house_number = houseNumber;
      userMetadata.address_line2 = addressLine2;
      userMetadata.postal_code = postalCode;
      userMetadata.city = city;
      userMetadata.state = state;
      userMetadata.country = country;
      userMetadata.phone = phone;

      const { error } = await signUp(email, password, userMetadata);

      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="bg-card text-card-foreground rounded-xl border shadow-xs">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Registrierung
          </h3>
          <p className="text-sm text-muted-foreground">Erstelle dein Konto</p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Account-Daten</h4>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-Mail <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="max@beispiel.de"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Passwort <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Mindestens 6 Zeichen"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="repeat-password"
                    className="text-sm font-medium"
                  >
                    Passwort wiederholen{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="repeat-password"
                    type="password"
                    placeholder="Passwort bestätigen"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-sm">Persönliche Daten</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      Vorname <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      placeholder="Max"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Nachname <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      placeholder="Mustermann"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                      Geschlecht
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="M">Männlich</option>
                      <option value="F">Weiblich</option>
                      <option value="D">Divers</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="date-of-birth"
                      className="text-sm font-medium"
                    >
                      Geburtsdatum
                    </label>
                    <input
                      id="date-of-birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information (Required) */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-sm">Adresse</h4>
                <p className="text-xs text-muted-foreground">
                  Bitte gib deine vollständige Adresse an
                </p>

                <div className="grid gap-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Firma
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Firma (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 grid gap-2">
                    <label htmlFor="street" className="text-sm font-medium">
                      Straße <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="street"
                      type="text"
                      placeholder="Musterstraße"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="house-number"
                      className="text-sm font-medium"
                    >
                      Nr. <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="house-number"
                      type="text"
                      placeholder="123"
                      required
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="address-line2"
                    className="text-sm font-medium"
                  >
                    Adresszusatz
                  </label>
                  <input
                    id="address-line2"
                    type="text"
                    placeholder="Wohnung, Etage, etc. (optional)"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="postal-code"
                      className="text-sm font-medium"
                    >
                      PLZ <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="postal-code"
                      type="text"
                      placeholder="12345"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="col-span-2 grid gap-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      Stadt <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Musterstadt"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      Bundesland
                    </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Bayern (optional)"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="country" className="text-sm font-medium">
                      Land <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="DE">Deutschland</option>
                      <option value="AT">Österreich</option>
                      <option value="CH">Schweiz</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+49 123 456789 (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Konto wird erstellt..." : "Jetzt registrieren"}
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              Bereits ein Konto?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Anmelden
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
