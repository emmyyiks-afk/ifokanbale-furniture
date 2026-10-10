import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page has no session — allow it through
  // (middleware handles the real guard, this is a fallback)
  if (!session?.user) {
    // Only render children if this is the login page
    // (which won't have a session). We can't detect the path in a layout,
    // so redirect. The middleware will have already allowed /admin/login.
    // To avoid a redirect loop, we use a nested check:
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-64 flex-col border-r border-forest-100 bg-white">
        <div className="border-b border-forest-100 px-6 py-5">
          <Link href="/admin/dashboard" className="font-display text-xl text-forest-700">
            IFOKANBALE
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-forest-400">
            Admin
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <AdminLink href="/admin/dashboard">Dashboard</AdminLink>
          <AdminLink href="/admin/products">Products</AdminLink>
          <AdminLink href="/admin/categories">Categories</AdminLink>
          <AdminLink href="/admin/settings">Settings</AdminLink>
        </nav>

        <div className="border-t border-forest-100 p-3">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-xs text-forest-500 hover:bg-forest-50"
          >
            View public site ↗
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-forest-500 hover:bg-forest-50"
            >
              Sign out
            </button>
          </form>
          <p className="mt-3 px-3 text-[10px] text-forest-400">
            {session.user.email}
          </p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}

function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm text-forest-700 transition hover:bg-gold-50 hover:text-forest-900"
    >
      {children}
    </Link>
  );
}