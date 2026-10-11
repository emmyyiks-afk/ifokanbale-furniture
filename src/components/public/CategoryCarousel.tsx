"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@prisma/client";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || categories.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % categories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, categories.length]);

  if (categories.length === 0) return null;
  const current = categories[index];

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold-600">
            Our range
          </p>
          <h2 className="mt-2 font-display text-3xl text-forest-700 md:text-4xl">
            What we craft
          </h2>
        </div>
        <Link
          href={`/category/${current.slug}`}
          className="hidden rounded-full border border-forest-200 px-5 py-2 text-sm text-forest-700 transition hover:border-gold-500 hover:text-gold-600 sm:inline-block"
        >
          View {current.name} →
        </Link>
      </div>

      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest-100 sm:aspect-[16/9] md:aspect-[21/9]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {current.imageUrl ? (
              <Image
                src={current.imageUrl}
                alt={current.name}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-500 to-forest-700">
                <span className="font-display text-7xl text-cream/30">
                  {current.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 sm:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gold-500">
                  Now showing
                </p>
                <h3 className="mt-2 font-display text-3xl text-cream sm:text-4xl md:text-5xl">
                  {current.name}
                </h3>
              </div>
              <Link
                href={`/category/${current.slug}`}
                className="hidden rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600 sm:inline-block"
              >
                Browse →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${cat.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-8 bg-gold-500"
                : "w-1.5 bg-forest-200 hover:bg-forest-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href={`/category/${current.slug}`}
          className="block rounded-full bg-gold-500 px-6 py-3 text-center text-sm font-medium text-forest-900"
        >
          Browse {current.name}
        </Link>
      </div>
    </section>
  );
}