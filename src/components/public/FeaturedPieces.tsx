import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export async function FeaturedPieces() {
  const [products, setting] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.setting.findUnique({ where: { id: "singleton" } }),
  ]);

  const whatsapp = setting?.whatsapp ?? "2348068238642";

  // Fallback: if no featured products yet, show the latest 8 active products
  const fallback =
    products.length > 0
      ? products
      : await prisma.product.findMany({
          where: { isActive: true },
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            category: true,
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        });

  return (
    <section id="featured" className="bg-forest-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold-600">
              Handpicked
            </p>
            <h2 className="mt-2 font-display text-3xl text-forest-700 md:text-4xl">
              Featured pieces
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-forest-500 md:block">
            Each piece is made to order in our workshop.
          </p>
        </div>

        {fallback.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-forest-200 bg-white py-16 text-center">
            <p className="font-display text-2xl text-forest-500">
              Our showroom is coming to life
            </p>
            <p className="mt-2 text-sm text-forest-500">
              Products will appear here as soon as we add them.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600"
            >
              Enquire about a custom piece
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallback.map((product) => {
              const img = product.images[0];
              const outOfStock = product.stockStatus === "OUT_OF_STOCK";
              const waMsg = encodeURIComponent(
                `Hi, I'm interested in "${product.name}" (${formatPrice(
                  product.price
                )}). Is it available?`
              );

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl border border-forest-100 bg-white transition hover:shadow-lg"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                      {img ? (
                        <Image
                          src={img.url}
                          alt={img.altText ?? product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-forest-300">
                          <span className="font-display text-4xl">?</span>
                        </div>
                      )}

                      {outOfStock && (
                        <span className="absolute left-3 top-3 rounded-full bg-forest-900/85 px-3 py-1 text-[10px] uppercase tracking-wider text-cream">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-forest-400">
                      {product.category.name}
                    </p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="mt-1 font-medium text-forest-800 transition hover:text-gold-600">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="mt-2 font-display text-lg text-gold-600">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={`https://wa.me/${whatsapp}?text=${waMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full bg-forest-700 px-4 py-2 text-center text-xs font-medium text-cream transition hover:bg-forest-500"
                      >
                        Enquire
                      </a>
                      <Link
                        href={`/product/${product.slug}`}
                        className="rounded-full border border-forest-200 px-4 py-2 text-xs text-forest-700 transition hover:border-gold-500 hover:text-gold-600"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-gold-500 px-8 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600"
          >
            Request a custom piece
          </Link>
        </div>
      </div>
    </section>
  );
}