import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleStock, toggleActive } from "./actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-forest-700">Products</h1>
          <p className="mt-1 text-sm text-forest-500">
            {products.length} product{products.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest-200 bg-white p-16 text-center">
          <p className="font-display text-2xl text-forest-500">
            No products yet
          </p>
          <p className="mt-2 text-sm text-forest-400">
            Add your first piece to see it on the public site.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600"
          >
            + Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-forest-100 bg-forest-50 text-xs uppercase tracking-wider text-forest-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-forest-50/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-cream">
                        {product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-forest-300">
                            ?
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-forest-700">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-forest-600">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 text-forest-600">
                    ₦{Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await toggleStock(product.id, product.stockStatus);
                      }}
                    >
                      <button
                        type="submit"
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          product.stockStatus === "IN_STOCK"
                            ? "bg-forest-100 text-forest-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stockStatus === "IN_STOCK"
                          ? "In stock"
                          : "Out of stock"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await toggleActive(product.id, product.isActive);
                      }}
                    >
                      <button
                        type="submit"
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          product.isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.isActive ? "Visible" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-forest-600 hover:text-gold-600"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}