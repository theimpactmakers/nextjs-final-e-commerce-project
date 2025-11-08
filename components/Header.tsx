import Link from 'next/link';

export default function Header() {
  return (
    // 'sticky top-0 z-50' macht den Header permanent sichtbar
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      
      {/* Hauptnavigation und Logo - HÖHE IST H:20 */}
      <div className="container flex h-20 items-center justify-between px-4">
        
        {/* 1. Logo */}
        <Link href={"/"} className="text-2xl font-black text-primary hover:opacity-90 transition-opacity">
          Elite Tail Treats
        </Link>
        
        {/* 2. Hauptmenü Links */}
        <nav className="hidden md:flex gap-8 font-medium">
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <Link href="/beratung" className="hover:text-primary transition-colors">Beratung</Link>
            <Link href="/ueber-uns" className="hover:text-primary transition-colors">Über Uns</Link>
        </nav>
        
        {/* 3. Aktionen (Anmelden, Warenkorb, Suche) */}
        {/* 'flex items-center' stellt sicher, dass sie auf gleicher Höhe wie das Menü sind */}
        <div className="flex items-center space-x-4 text-sm font-medium">
            
            {/* Anmelden / Login */}
            <Link 
                href="/login" 
                className="hover:text-primary transition-colors"
            >
                Anmelden
            </Link>

            {/* Warenkorb */}
            <Link 
                href="/cart" 
                className="hover:text-primary transition-colors flex items-center gap-1"
            >
                {/* Platzhalter für Warenkorb-Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
                    <circle cx="8" cy="21" r="1"/>
                    <circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6"/>
                </svg>
                Warenkorb (0)
            </Link>

            {/* Suche/Theme-Switcher (Optional) */}
            {/* <span className="text-muted-foreground">Suche/Toggle</span> */}
        </div>
      </div>
    </header>
  );
}