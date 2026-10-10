import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-forest-100 bg-forest-700 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl text-gold-500">IFOKANBALE</h3>
          <p className="mt-3 text-sm text-cream/70">
            Forms & Furniture Work. Handcrafted pieces built to last.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium tracking-wide text-gold-500">
            EXPLORE
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/category/beds" className="hover:text-gold-500">Beds</Link></li>
            <li><Link href="/category/sofas" className="hover:text-gold-500">Sofas</Link></li>
            <li><Link href="/category/tables" className="hover:text-gold-500">Tables</Link></li>
            <li><Link href="/category/chairs" className="hover:text-gold-500">Chairs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium tracking-wide text-gold-500">
            CONTACT
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>  +2348068238642</li>
            <li>ifokanbalefoamandfurniture@gmail.com</li>
            <li>12,Market Street, Kooso,Ipetumodu,Osun State  </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} IFOKANBALE Forms & Furniture Work
<span className="mx-2 text-cream/20">·</span>
<Link href="/admin/login" className="text-cream/20 hover:text-gold-500">
  ·
</Link>
      </div>
    </footer>
  );
}