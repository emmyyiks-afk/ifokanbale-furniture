"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setPending(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-700 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-cream p-10"
      >
        <div className="text-center">
          <h1 className="font-display text-3xl text-forest-700">IFOKANBALE</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-forest-500">
            Admin access
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm text-forest-700">Email</label>
          <input
            name="email"
            type="email"
            required
            defaultValue="admin@ifokanbale.com"
            className="w-full rounded-lg border border-forest-200 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-forest-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-forest-200 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-gold-500 px-6 py-3 font-medium text-forest-900 transition hover:bg-gold-600 disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-xs text-forest-400">
          Default: admin@ifokanbale.com / admin1234
        </p>
      </form>
    </div>
  );
}