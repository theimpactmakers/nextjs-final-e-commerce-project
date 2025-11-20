import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container max-w-7xl px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Produkt nicht gefunden
        </h1>
        <p className="text-muted-foreground mb-8">
          Das gesuchte Produkt existiert nicht oder wurde entfernt.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          Zum Shop
        </Link>
      </div>
    </div>
  );
}
