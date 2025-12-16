export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata = {
  title: "Über uns | Elite Dog TREATS - Unsere Mission & Werte",
  description:
    "Erfahren Sie mehr über Elite Dog TREATS: Unsere Mission, Werte und Leidenschaft für hochwertige Hundeleckerlis seit 2018.",
};

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mt-4 mb-8 text-center">
          Über EliteDogTREATS
        </h1>

        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/images/Logo.webp"
              alt="Elite Dog TREATS Logo"
              width={160}
              height={96}
              className="h-24 w-auto"
              priority={false}
            />
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className=" pb-8 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Unsere Mission
            </h2>
            <p className="text-[hsl(var(--foreground))] mb-6">
              Bei Elite Dog TREATS sind wir leidenschaftlich darum bemüht, die
              besten Nahrungsmittel für Ihren Vierbeiner zu kreieren. Wir
              glauben, dass jeder Hund hochwertiges, gesundes und schmackhaftes
              Futter verdient.
            </p>
            <p className="text-[hsl(var(--foreground))] ">
              Seit unserer Gründung im Jahr 2018 haben wir uns darauf
              konzentriert, innovative und natürliche Produkte zu entwickeln,
              die nicht nur Ihren Hund glücklich machen, sondern auch seine
              Gesundheit fördern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border text-center">
              <div className="flex justify-center  mb-4">
                <Image
                  src="/images/icons/natural.webp"
                  alt="Zufriedener Hund Icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                100% Natürlich
              </h3>
              <p className="text-primary">
                Alle unsere Zutaten stammen aus natürlichen Quellen ohne
                künstliche Zusätze.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/icons/zufrieden.svg"
                  alt="Zufriedener Hund Icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Premium Qualität
              </h3>
              <p className="text-primary">
                Wir verwenden nur die besten Zutaten und höchste
                Qualitätsstandards.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border text-center">
              <div className="text-4xl mb-2 flex justify-center">
                <Image
                  src="/images/icons/mitliebe.svg"
                  alt="Zufriedener Hund Icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Tierliebe
              </h3>
              <p className="text-primary">
                Jedes Produkt wird mit Liebe zum Tier entwickelt und
                hergestellt.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Unser Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  Dr. Sarah Müller - Tierernährungsexpertin
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Mit über 15 Jahren Erfahrung in der Tierernährung leitet Sarah
                  unsere Produktentwicklung und stellt sicher, dass jedes
                  Leckerli optimal für die Gesundheit Ihres Hundes ist.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  Michael Schmidt - Qualitätsmanager
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Michael überwacht jeden Schritt unserer Produktionskette, um
                  die höchsten Qualitätsstandards zu gewährleisten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
