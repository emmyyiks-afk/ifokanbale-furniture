import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category || !category.isActive) notFound();

  return (
    <main>
      {/* Header */}
      <section className="border-b border-forest-100 bg-forest-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
            href="/"
            className="text-sm text-forest-500 transition hover:text-gold-600"
          >
            ← Back to home
          </Link>
          <h1 className="mt-4 font-display text-4xl text-forest-700 md:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-forest-600">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {category.products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-forest-200 bg-cream py-20 text-center">
            <p className="font-display text-2xl text-forest-500">
              Nothing here yet
            </p>
            <p className="mt-2 text-sm text-forest-500">
              Products will appear here once added from the admin dashboard.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-2 text-sm text-forest-900 transition hover:bg-gold-600"
            >
              Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {category.products.map((product) => (
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
                  <h3 className="font-medium text-forest-700">{product.name}</h3>
                  <p className="mt-1 text-sm text-forest-600">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                  {product.stockStatus === "OUT_OF_STOCK" ? (
                    <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                      Out of stock
                    </span>
                  ) : (
                    <span className="mt-2 inline-block rounded-full bg-forest-100 px-2 py-0.5 text-xs text-forest-700">
                      In stock
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}