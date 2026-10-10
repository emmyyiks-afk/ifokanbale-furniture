import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-forest-200 bg-white p-12 text-center">
        <p className="font-display text-2xl text-forest-500">
          Add a category first
        </p>
        <p className="mt-2 text-sm text-forest-400">
          Every product belongs to a category. Create at least one before adding products.
        </p>
        <a
          href="/admin/categories"
          className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600"
        >
          Go to categories
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-forest-700">
        Add product
      </h1>
      <p className="mb-8 text-sm text-forest-500">
        Fill in the details below. Fields marked * are required.
      </p>
      <ProductForm categories={categories} onSubmit={createProduct} />
    </div>
  );
}