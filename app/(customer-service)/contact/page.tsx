export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata = {
  title: "Kontakt | Elite Dog TREATS - Wir helfen Ihnen gerne",
  description:
    "Haben Sie Fragen? Kontaktieren Sie uns per E-Mail, Telefon oder Kontaktformular. Unser Team hilft Ihnen gerne weiter!",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Organischer Hintergrund */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#ede8df]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-[#e8dfd2] rounded-[40%_60%_70%_30%/30%_50%_50%_70%] opacity-60"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[80%] bg-[#d4c5b0] rounded-[60%_40%_30%_70%/70%_30%_70%_30%] opacity-40"></div>
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[50%] bg-[#d1c7b9] rounded-[50%_50%_50%_50%/60%_40%_60%_40%] opacity-50"></div>
        </div>
        -center
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-2 text-center">
          Schnelle Antwort garantiert 
        </h1>
        <p className="text-[hsl(var(--foreground))] mb-8 text-center">Wir bemühen uns, alle Anfragen innerhalb von 24h zu beantworten.</p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kontaktformular */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Nutzen Sie unser Formular
              </h2>

              <form className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      placeholder="Max"
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
                    className="w-full px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Telefonnummer <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="h-[38px] px-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[center_right_0.75rem] bg-no-repeat pr-10"
                      defaultValue="+49"
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
                      className="flex-1 px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all"
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
                    className="w-full px-4 py-1.5 bg-white/30 backdrop-blur-sm border border-white/40 rounded-(--app-radius) focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/50 focus:bg-white/50 transition-all resize-y"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-white font-medium rounded-(--app-radius) py-3 transition-all duration-300 ease-in-out hover:bg-[hsl(33_100%_40%)] hover:-translate-y-1.25 active:bg-accent/80 cursor-pointer"
                >
                  Nachricht senden
                </button>
              </form>
            </div>

            {/* Kontaktinformationen */}
            <div className="space-y-6">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
                <h2 className="text-2xl font-bold  text-primary mb-6">
                  Kontaktinformationen
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📍</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Adresse
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        EliteDogTREATS GmbH
                        <br />
                        Hunde Straße 11
                        <br />
                        12345 Wuff
                        <br />
                        Deutschland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📞</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Telefon
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        +49 123 456789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📧</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        E-Mail
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        info@elitedogtreats.de
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">🕒</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Öffnungszeiten
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Mo-Fr: 9:00 - 18:00 Uhr
                        <br />
                        Sa: 10:00 - 16:00 Uhr
                        <br />
                        So: Geschlossen
                      </p>
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
