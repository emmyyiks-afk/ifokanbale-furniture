import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });

  if (!product || !product.isActive) notFound();

  const [setting, related] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "singleton" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      take: 4,
    }),
  ]);

  const whatsapp = setting?.whatsapp ?? "2348068238642";
  const phone = setting?.phone ?? "2348068238642";
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in "${product.name}" (₦${Number(product.price).toLocaleString()}). Is it available?`
  );

  return (
    <main>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-forest-500">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <span className="mx-2">/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-gold-600"
          >
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-forest-700">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText ?? product.name}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-forest-300">
                  <span className="font-display text-6xl">?</span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square overflow-hidden rounded-lg border border-forest-100 bg-cream"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-widest text-forest-500">
              {product.category.name}
            </p>
            <h1 className="mt-2 font-display text-4xl text-forest-700 md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 font-display text-3xl text-gold-600">
              ₦{Number(product.price).toLocaleString()}
            </p>

            <div className="mt-4">
              {product.stockStatus === "IN_STOCK" ? (
                <span className="inline-block rounded-full bg-forest-100 px-3 py-1 text-sm text-forest-700">
                  ● In stock
                </span>
              ) : (
                <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                  ● Out of stock
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-forest-600">
                {product.description}
              </p>
            )}

            {/* Action buttons */}
            <div className="mt-10 space-y-3">
              <a
                href={`https://wa.me/${whatsapp}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full bg-gold-500 px-6 py-4 text-center font-medium text-forest-900 transition hover:bg-gold-600"
              >
                Enquire on WhatsApp
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="block w-full rounded-full border border-forest-300 px-6 py-4 text-center font-medium text-forest-700 transition hover:bg-forest-50"
              >
                Call {phone}
              </a>
            </div>

            {/* Trust badges */}
            <ul className="mt-8 space-y-2 border-t border-forest-100 pt-6 text-sm text-forest-500">
              <li>✓ Handcrafted in our workshop</li>
              <li>✓ Delivery available nationwide</li>
              <li>✓ Custom sizes on request</li>
            </ul>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-2xl text-forest-700">
              More from {product.category.name}
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group overflow-hidden rounded-xl border border-forest-100 bg-white transition hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-cream">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0].url}
                        alt={p.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-forest-300">
                        <span className="font-display text-3xl">?</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-forest-700">{p.name}</p>
                    <p className="mt-1 text-xs text-forest-600">
                      ₦{Number(p.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}