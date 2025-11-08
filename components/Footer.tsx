import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted mt-16 py-12 text-muted-foreground">
      <div className="container max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
        
        {/* Spalte 1: Über uns */}
        <div>
          <h4 className="font-bold text-foreground mb-3">Über Uns</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/story" className="hover:text-primary transition-colors">Unsere Story</Link></li>
            <li><Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link></li>
            <li><Link href="/presse" className="hover:text-primary transition-colors">Blogs</Link></li>
          </ul>
        </div>

        {/* Spalte 2: Service */}
        <div>
          <h4 className="font-bold text-foreground mb-3">Kundenservice</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/kontakt" className="hover:text-primary transition-colors">Kontakt</Link></li>
            <li><Link href="/versand" className="hover:text-primary transition-colors">Versand</Link></li>
          </ul>
        </div>

        {/* Spalte 3: Rechtliches */}
        <div>
          <h4 className="font-bold text-foreground mb-3">Rechtliches</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/impressum" className="hover:text-primary transition-colors">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link></li>
            <li><Link href="/agb" className="hover:text-primary transition-colors">AGB</Link></li>
          </ul>
        </div>

        {/* Spalte 4: Logo/Zahlung */}
        <div className="flex flex-col items-start">
            <h4 className="font-bold text-foreground mb-3">Zahlung</h4>
            <div className="text-sm">
                Wir akzeptieren Visa, PayPal, etc.
            </div>
            <p className="mt-4 text-xs">© {new Date().getFullYear()} Elite tail treats</p>
        </div>
      </div>
    </footer>
  );
}