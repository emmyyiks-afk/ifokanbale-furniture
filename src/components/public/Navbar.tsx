import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl text-forest-700">
          IFOKANBALE
        </Link>

        <nav className="hidden gap-8 text-sm text-forest-700 md:flex">
          <Link href="/category/beds" className="transition hover:text-gold-600">
            Beds
          </Link>
          <Link href="/category/sofas" className="transition hover:text-gold-600">
            Sofas
          </Link>
          <Link href="/category/tables" className="transition hover:text-gold-600">
            Tables
          </Link>
          <Link href="/category/chairs" className="transition hover:text-gold-600">
            Chairs
          </Link>
          <Link href="/about" className="transition hover:text-gold-600">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-gold-600">
            Contact
          </Link>
        </nav>

        <Link
          href="/contact"
          className="rounded-full bg-gold-500 px-5 py-2 text-xs font-medium tracking-wide text-forest-900 transition hover:bg-gold-600"
        >
          Enquire
        </Link>
      </div>
    </header>
  );
}