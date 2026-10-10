import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [productCount, categoryCount, outOfStockCount, inquiryCount, recent] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.product.count({
        where: { isActive: true, stockStatus: "OUT_OF_STOCK" },
      }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Active products", value: productCount, href: "/admin/products" },
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Out of stock", value: outOfStockCount, href: "/admin/products" },
    { label: "New inquiries", value: inquiryCount, href: "#" },
  ];

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-forest-700">Dashboard</h1>
      <p className="mb-8 text-sm text-forest-500">
        Overview of your catalogue and customer activity.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-forest-100 bg-white p-6 transition hover:border-gold-500"
          >
            <p className="text-xs uppercase tracking-wider text-forest-400">
              {s.label}
            </p>
            <p className="mt-3 font-display text-4xl text-forest-700">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/products/new"
          className="rounded-2xl bg-gold-500 p-6 text-forest-900 transition hover:bg-gold-600"
        >
          <p className="font-display text-xl">+ Add product</p>
          <p className="mt-1 text-xs text-forest-700/70">
            Upload a new piece to the catalogue
          </p>
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-2xl bg-forest-700 p-6 text-cream transition hover:bg-forest-500"
        >
          <p className="font-display text-xl text-gold-500">Manage categories</p>
          <p className="mt-1 text-xs text-cream/70">
            Add or edit product categories
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-2xl border border-forest-100 bg-white p-6 transition hover:border-gold-500"
        >
          <p className="font-display text-xl text-forest-700">Shop settings</p>
          <p className="mt-1 text-xs text-forest-500">
            Phone, WhatsApp, address
          </p>
        </Link>
      </div>

      {/* Recent inquiries */}
      <div className="mt-10 rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="font-display text-xl text-forest-700">
          Recent inquiries
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-forest-400">
            No customer inquiries yet. They'll appear here when someone submits
            the contact form.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-forest-100">
            {recent.map((i) => (
              <li key={i.id} className="py-3">
                <div className="flex items-baseline justify-between">
                  <p className="font-medium text-forest-700">
                    {i.name} · {i.phone}
                  </p>
                  <p className="text-xs text-forest-400">
                    {new Date(i.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-forest-600">
                  {i.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}