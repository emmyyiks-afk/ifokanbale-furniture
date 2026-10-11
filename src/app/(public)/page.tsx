import { prisma } from "@/lib/prisma";
import { HeroIntro } from "@/components/public/HeroIntro";
import { CategoryCarousel } from "@/components/public/CategoryCarousel";
import { FeaturedPieces } from "@/components/public/FeaturedPieces";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <HeroIntro />

      {/* 1 — Auto-rotating category showcase */}
      <CategoryCarousel categories={categories} />

      {/* 2 — Categories grid */}
      <section id="collection" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-10 text-center font-display text-3xl text-forest-700 md:text-4xl">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group overflow-hidden rounded-xl border border-forest-100 bg-white transition hover:border-gold-500 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-100 to-forest-50">
                    <span className="font-display text-5xl text-forest-300">
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <p className="font-medium text-forest-700">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 — Real products: this is what "Explore Collection" scrolls to */}
      <FeaturedPieces />
    </>
  );
}