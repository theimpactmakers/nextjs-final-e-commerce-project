import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted mt-16 py-12 text-muted-foreground px-6 sm:px-8 lg:px-12">
      <div className="container max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Spalte 1: Über uns */}
        <div className="text-center md:text-center">
          <h4 className="font-bold text-foreground mb-3">Über Uns</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/story"
                className="hover:text-primary transition-colors"
              >
                Unsere Story
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-primary transition-colors"
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 2: Service */}
        <div className="text-center md:text-center">
          <h4 className="font-bold text-foreground mb-3">Kundenservice</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className="hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 3: Rechtliches */}
        <div className="text-center md:text-center">
          <h4 className="font-bold text-foreground mb-3">Rechtliches</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/impressum"
                className="hover:text-primary transition-colors"
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="hover:text-primary transition-colors"
              >
                Datenschutz
              </Link>
            </li>
            <li>
              <Link
                href="/agb"
                className="hover:text-primary transition-colors"
              >
                AGB
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 4: Logo/Zahlung */}
        <div className="flex flex-col items-center text-center">
          <h4 className="font-bold text-foreground mb-3">Zahlung</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/zahlung-versand"
                className="hover:text-primary transition-colors"
              >
                Zahlung & Versand
              </Link>
            </li>
            <li>
              <Link
                href="/retouren"
                className="hover:text-primary transition-colors"
              >
                Retouren & Rückgabe
              </Link>
            </li>
            <li>
              <Link
                href="/zahlungsarten"
                className="hover:text-primary transition-colors"
              >
                Zahlungsmethoden
              </Link>
            </li>
            <li>
              <Link
                href="/lieferzeiten"
                className="hover:text-primary transition-colors"
              >
                Lieferzeiten
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Image
          src="/images/Logo_example_6.png"
          alt="Elite Dog Treats"
          width={140}
          height={44}
          className="h-auto w-auto"
          priority={false}
        />
      </div>
      <div className="mt-4 text-center text-xs text-gray-500">
        Alle Rechte vorbehalten. &copy; {new Date().getFullYear()} Elite Dog
        Treats Shop.
      </div>
    </footer>
  );
}
