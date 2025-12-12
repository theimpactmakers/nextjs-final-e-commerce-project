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
    <div className="min-h-screen relative overflow-hidden py-8 pb-64">
      {/* Organischer Hintergrund */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#ede8df]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-[#e8dfd2] rounded-[40%_60%_70%_30%/30%_50%_50%_70%] opacity-60"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[80%] bg-[#d4c5b0] rounded-[60%_40%_30%_70%/70%_30%_70%_30%] opacity-40"></div>
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[50%] bg-[#d1c7b9] rounded-[50%_50%_50%_50%/60%_40%_60%_40%] opacity-50"></div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 min-[500px]:px-6 min-[600px]:px-8 relative z-10">
        <h1 className="text-4xl font-bold text-primary mb-2 text-center">
          Schnelle Antwort garantiert
        </h1>
        <p className="text-[hsl(var(--foreground))] mb-8 text-center">
          Wir bemühen uns, alle Anfragen innerhalb von 24h zu beantworten.
        </p>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-8 items-stretch">
            {/* Kontaktformular */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-4 min-[600px]:p-8 border border-white/30 h-full">
              <h2 className="text-xl font-bold text-[hsl(var(--muted-foreground))] mb-6">
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
                      className="w-full px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all"
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
                      className="w-full px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all"
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
                    className="w-full px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Telefonnummer <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-1 min-[400px]:gap-2">
                    <select
                      className="h-9.5 w-13 min-[400px]:w-14 min-[600px]:w-20 px-0.5 min-[400px]:px-1 min-[600px]:px-2 text-xs min-[400px]:text-sm bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[0.5rem] min-[600px]:bg-size-[0.625rem] bg-position-[center_right_0.125rem] min-[600px]:bg-position-[center_right_0.25rem] bg-no-repeat pr-3 min-[400px]:pr-4 min-[600px]:pr-6"
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
                      className="flex-1 min-w-0 px-2 min-[400px]:px-3 min-[600px]:px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all"
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
                    className="w-full px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all resize-y"
                    required
                  ></textarea>
                </div>
                {feedback && (
                  <div
                    className={`text-sm text-center py-2 px-4 rounded-(--app-radius) ${
                      status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-4 min-[600px]:p-8 border border-white/30 h-full">
                <div className="flex ml-5 mb-2">
                  <Link
                    href="/"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/images/Logo.webp"
                      alt="Elite Dog Treats"
                      width={220}
                      height={76}
                      className="h-auto w-auto"
                    />
                  </Link>
                </div>
                <h2 className="text-xl font-bold text-[hsl(var(--muted-foreground))] ml-8 mb-6">
                  Kontaktinformationen
                </h2>
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
                        <span className="font-bold text-primary w-16">Mo-Fr:</span>
                        <span>9:00 - 18:00 Uhr</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <span className="font-bold text-primary w-16">Sa:</span>
                        <span>10:00 - 16:00 Uhr</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-primary  w-16">So:</span>
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
