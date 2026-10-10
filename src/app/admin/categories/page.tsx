import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { deleteCategory, toggleCategoryActive } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-forest-700">Categories</h1>
        <p className="mt-1 text-sm text-forest-500">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} ·
          Each product belongs to one.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-forest-200 bg-white p-12 text-center">
              <p className="font-display text-xl text-forest-500">
                No categories yet
              </p>
              <p className="mt-2 text-sm text-forest-400">
                Add one using the form on the right.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-forest-100 bg-forest-50 text-xs uppercase tracking-wider text-forest-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Products</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-forest-50/40">
                      <td className="px-4 py-3 font-medium text-forest-700">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-xs text-forest-500">
                        /{cat.slug}
                      </td>
                      <td className="px-4 py-3 text-forest-600">
                        {cat._count.products}
                      </td>
                      <td className="px-4 py-3">
                        <form
                          action={async () => {
                            "use server";
                            await toggleCategoryActive(cat.id, cat.isActive);
                          }}
                        >
                          <button
                            type="submit"
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              cat.isActive
                                ? "bg-forest-100 text-forest-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {cat.isActive ? "Active" : "Hidden"}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <form
                          action={async () => {
                            "use server";
                            try {
                              await deleteCategory(cat.id);
                            } catch {
                              // handled below via UI — do nothing
                            }
                          }}
                        >
                          <button
                            type="submit"
                            disabled={cat._count.products > 0}
                            title={
                              cat._count.products > 0
                                ? "Cannot delete — has products"
                                : "Delete category"
                            }
                            className="text-xs text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add form */}
        <div>
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}