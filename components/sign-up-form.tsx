"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  const [countryCode, setCountryCode] = useState("+49");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Auto-suggest country code when country changes
  useEffect(() => {
    const getCountryCodeFromCountry = (country: string) => {
      switch (country) {
        case "DE":
          return "+49";
        case "AT":
          return "+43";
        case "CH":
          return "+41";
        default:
          return "+49";
      }
    };
    setCountryCode(getCountryCodeFromCountry(country));
  }, [country]);

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
      // Combine country code with phone number
      userMetadata.phone = phone ? `${countryCode} ${phone}` : "";

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
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          
          <div className="inline-block mb-4">
            <div className="bg-linear-to-r from-primary to-accent text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Willkommen bei ELITE DOG TREATS
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Werden Sie Teil unserer Community und genießen Sie exklusive Vorteile für die beste Pflege Ihres Vierbeiners
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-1 w-12 bg-linear-to-r from-primary to-accent rounded-full"></div>

          </div>
          
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
            >
              Bereits ein Konto? Jetzt anmelden
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSignUp}>
          <div className="space-y-4">
            {/* Account Information */}
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

              <input
                id="password"
                type="password"
                placeholder="Passwort*"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />

              <input
                id="repeatPassword"
                type="password"
                placeholder="Passwort wiederholen*"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />
            </div>

            {/* Gender Selection with Radio Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                * Pflichtfelder
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={gender === "F"}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Frau</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={gender === "M"}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Herr</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="D"
                    checked={gender === "D"}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Divers</span>
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <input
                id="first-name"
                type="text"
                placeholder="Vorname*"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />

              <input
                id="lastName"
                type="text"
                placeholder="Nachname*"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />
            </div>

            {/* Company Field (Optional) */}
            <div>
              <input
                id="company"
                type="text"
                placeholder="Firma"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <input
                id="street-house"
                type="text"
                placeholder="Straße und Hausnummer*"
                required
                value={`${street}${houseNumber ? " " + houseNumber : ""}`}
                onChange={(e) => {
                  const value = e.target.value;
                  const parts = value.split(" ");
                  const lastPart = parts[parts.length - 1];
                  if (/^\d/.test(lastPart)) {
                    setHouseNumber(lastPart);
                    setStreet(parts.slice(0, -1).join(" "));
                  } else {
                    setStreet(value);
                    setHouseNumber("");
                  }
                }}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />

              <input
                id="address-line2"
                type="text"
                placeholder="Adresszusatz"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  id="postal-code"
                  type="text"
                  placeholder="PLZ*"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                />
              

                <div className="col-span-2">
                  <input
                    id="city"
                    type="text"
                    placeholder="Ort*"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 text-gray-700 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="">Land*</option>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
              </select>

              <input
                id="dateOfBirth"
                type="date"
                placeholder="Geburtsdatum"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400 text-gray-700"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  id="countryCode"
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  placeholder="Vorwahl"
                  className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400 text-center"
                />

                <div className="col-span-2">
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Telefonnummer"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 text-sm bg-slate-100 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isLoading ? "Wird registriert..." : "JETZT REGISTRIEREN"}
            </button>

            {/* Login Link */}
            <div className="text-center">
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
