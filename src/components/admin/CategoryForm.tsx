"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/app/admin/categories/actions";

export function CategoryForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createCategory(formData);
      form.reset();
      setSuccess("Category added");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-forest-100 bg-white p-6"
    >
      <h2 className="font-display text-xl text-forest-700">Add category</h2>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-forest-50 px-3 py-2 text-sm text-forest-700">
          {success}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm text-forest-700">Name *</label>
        <input
          name="name"
          required
          placeholder="Beds"
          className="w-full rounded-lg border border-forest-200 bg-cream px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-forest-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Hand-built beds in solid wood…"
          className="w-full rounded-lg border border-forest-200 bg-cream px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-forest-700">
          Image URL <span className="text-forest-400">(optional)</span>
        </label>
        <input
          name="imageUrl"
          type="url"
          placeholder="https://..."
          className="w-full rounded-lg border border-forest-200 bg-cream px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gold-500 px-4 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}