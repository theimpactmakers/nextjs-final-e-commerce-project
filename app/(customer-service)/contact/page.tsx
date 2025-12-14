"use client";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+49",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(result.error || "Ein Fehler ist aufgetreten.");
        return;
      }

      setStatus("success");
      setFeedback(
        result.message || "Ihre Nachricht wurde erfolgreich gesendet!"
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+49",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
      setFeedback(
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      );
    }
  };
  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 min-[500px]:px-6 min-[600px]:px-8">
        <h1 className="text-4xl font-bold text-primary mb-2 text-center">
          Schnelle Antwort garantiert
        </h1>
        <p className="text-[hsl(var(--foreground))] mb-8 text-center">
          Wir bemühen uns, alle Anfragen innerhalb von 24h zu beantworten.
        </p>
        <div className="max-w-4xl mx-auto relative">
          {/* Dekorativer Hintergrund hinter den Formularen - von links nach rechts */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute top-[-15%] left-[-10%] w-[65%] h-[90%] bg-linear-to-r from-[#e8dfd2]/50 to-transparent rounded-[50%_60%_40%_50%] opacity-70"></div>
            <div className="absolute top-[20%] left-[-5%] w-[55%] h-[70%] bg-linear-to-r from-[#d4c5b0]/40 to-transparent rounded-[60%_40%_60%_40%] opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[5%] w-[50%] h-[60%] bg-linear-to-r from-[#c9b89a]/35 to-transparent rounded-[40%_50%_50%_40%] opacity-50"></div>
          </div>
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-8 items-stretch">
            {/* Kontaktformular */}
            <div className="bg-muted/80 backdrop-blur-md rounded-2xl shadow-xl p-4 min-[600px]:p-8 border border-primary/20 hover:border-primary/40 h-full transition-all duration-300">
              <h2 className="text-2xl font-bold text-[hsl(var(--muted-foreground))] mb-6">
                Nutzen Sie unser Formular
              </h2>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      placeholder="Max"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-1.5 bg-white border border-gray-300 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                      Nachname <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Mustermann"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-1.5 bg-white border border-gray-300 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    E-Mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="max.mustermann@beispiel.de"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-1.5 bg-white border border-gray-300 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Telefonnummer <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-1 min-[400px]:gap-2">
                    <select
                      className="h-9.5 w-13 min-[400px]:w-14 min-[600px]:w-20 px-0.5 min-[400px]:px-1 min-[600px]:px-2 text-xs min-[400px]:text-sm bg-white border border-gray-300 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[0.5rem] min-[600px]:bg-size-[0.625rem] bg-position-[center_right_0.125rem] min-[600px]:bg-position-[center_right_0.25rem] bg-no-repeat pr-3 min-[400px]:pr-4 min-[600px]:pr-6"
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryCode: e.target.value,
                        })
                      }
                    >
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="123 456 7890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="flex-1 min-w-0 px-2 min-[400px]:px-3 min-[600px]:px-4 py-1.5 bg-white border border-gray-300 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Verfasse eine Nachricht{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ihre Nachricht an uns..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-1.5 bg-white border border-gray-300 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 transition-all resize-y"
                    required
                  ></textarea>
                </div>
                {feedback && (
                  <div
                    className={`text-sm text-center py-2 px-4 ${
                      status === "success"
                        ? "text-accent font-medium"
                        : "text-red-600"
                    }`}
                  >
                    {feedback}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-accent text-white font-medium rounded-(--app-radius) py-3 transition-all duration-300 ease-in-out hover:bg-[hsl(33_100%_40%)] hover:-translate-y-1.25 active:bg-accent/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading"
                    ? "Wird gesendet..."
                    : "Nachricht senden"}
                </button>
              </form>
            </div>
            {/* Kontaktinformationen */}
            <div className="h-full">
              <div className="bg-muted/80 backdrop-blur-md rounded-2xl shadow-xl p-4 min-[600px]:p-8 border border--primary/20 hover:border-primary/40 h-full transition-all duration-300">
                <h2 className="text-2xl font-bold text-[hsl(var(--muted-foreground))] ml-8 mb-4">
                  Kontaktinformationen
                </h2>
                <div className="flex ml-5 mb-2">
                  <Link
                    href="/"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/images/Logo.webp"
                      alt="Elite Dog Treats"
                      width={120}
                      height={26}
                      className="h-auto w-auto"
                    />
                  </Link>
                </div>
                {/* Social Media Icons */}
                <div className="mb-8 mt-4 ml-9 ">
                  <div className="flex gap-6">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-black hover:scale-110 transition-all duration-300 animate-[popIn_0.5s_ease-out_0.2s_both]"
                      aria-label="Facebook"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-black hover:scale-110 transition-all duration-300 animate-[popIn_0.5s_ease-out_0.4s_both]"
                      aria-label="Instagram"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-black hover:scale-110 transition-all duration-300 animate-[popIn_0.5s_ease-out_0.6s_both]"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start mb-6">
                    <div className="text-2xl mr-4 text-primary">
                      <MdLocationOn />
                    </div>
                    <div>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        <strong>EliteDogTREATS GmbH</strong> <br /> Hunde Straße
                        11 <br /> 12345 Wuff <br /> Deutschland
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-6">
                    <div className="text-2xl mr-4 text-primary">
                      <MdPhone />
                    </div>
                    <div>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        <a
                          href="tel:+49123456789"
                          className="text-accent hover:underline transition-colors text-lg"
                        >
                          +49 123 456789
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-6">
                    <div className="text-2xl mr-4 text-primary">
                      <MdEmail />
                    </div>
                    <div>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        <a
                          href="mailto:abschlussprojekt321@gmail.com"
                          className="text-accent hover:underline transition-colors text-lg"
                        >
                          info@elitedogtreats.de
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-6">
                    <div className="text-2xl mr-4 text-primary">
                      <MdAccessTime />
                    </div>
                    <div className="text-[hsl(var(--muted-foreground))]">
                      <div className="flex gap-2 mb-2">
                        <span className="font-bold text-primary w-16">
                          Mo-Fr:
                        </span>
                        <span>9:00 - 18:00 Uhr</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <span className="font-bold text-primary w-16">Sa:</span>
                        <span>10:00 - 16:00 Uhr</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-primary  w-16">
                          So:
                        </span>
                        <span>Geschlossen</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
