import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroIntro } from "@/components/public/HeroIntro";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const featured = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
    take: 8,
  });

  return (
    <>
      <HeroIntro />

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-10 text-center font-display text-3xl text-forest-700 md:text-4xl">
          Shop by category
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl border border-forest-100 bg-white p-6 text-center transition hover:border-gold-500 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-forest-700 transition group-hover:bg-gold-500 group-hover:text-cream">
                <span className="font-display text-2xl">
                  {cat.name.charAt(0)}
                </span>
              </div>
              <p className="font-medium text-forest-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      {featured.length > 0 && (
        <section className="bg-forest-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-10 text-center font-display text-3xl text-forest-700 md:text-4xl">
              Featured pieces
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group overflow-hidden rounded-xl border border-forest-100 bg-white transition hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText ?? product.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-forest-300">
                        <span className="font-display text-4xl">?</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wide text-forest-500">
                      {product.category.name}
                    </p>
                    <h3 className="mt-1 font-medium text-forest-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-forest-600">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                    {product.stockStatus === "OUT_OF_STOCK" && (
                      <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        Out of stock
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty state if no products yet ── */}
      {featured.length === 0 && (
        <section className="bg-forest-50 py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="mb-4 font-display text-3xl text-forest-700">
              Our showroom is coming to life
            </h2>
            <p className="mx-auto max-w-xl text-forest-600">
              Products will appear here as soon as the admin adds them.
              Sign in to the dashboard to add your first piece.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 text-sm text-forest-900 transition hover:bg-gold-600"
            >
              Go to admin
            </Link>
          </div>
        </section>
      )}
    </>
  );
}