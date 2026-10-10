"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/app/admin/settings/actions";
import type { Setting } from "@prisma/client";

export function SettingsForm({ setting }: { setting: Setting | null }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    try {
      await updateSettings(formData);
      setSuccess("Settings saved");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-forest-50 px-4 py-3 text-sm text-forest-700">
          {success}
        </p>
      )}

      <div className="rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-forest-700">Identity</h2>
        <div className="space-y-4">
          <Field
            label="Shop name *"
            name="shopName"
            defaultValue={setting?.shopName}
            placeholder="IFOKANBALE Forms & Furniture Work"
          />
          <Field
            label="Tagline"
            name="tagline"
            defaultValue={setting?.tagline ?? ""}
            placeholder="Handcrafted furniture for every home"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-forest-700">Contact</h2>
        <div className="space-y-4">
          <Field
            label="Phone *"
            name="phone"
            defaultValue={setting?.phone}
            placeholder="  +2348068238642"
          />
          <div>
            <label className="mb-1 block text-sm text-forest-700">
              WhatsApp number *
            </label>
            <input
              name="whatsapp"
              required
              defaultValue={setting?.whatsapp}
              placeholder="2348068238642  "
              className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-forest-400">
              Digits only, with country code. No spaces, no + sign. Example:{" "}
              <code className="text-forest-600">2348068238642  </code>
            </p>
          </div>
          <Field
            label="Email"
            name="email"
            type="email"
            defaultValue={setting?.email ?? ""}
            placeholder="ifokanbalefoamandfurniture@gmail.com"
          />
          <div>
            <label className="mb-1 block text-sm text-forest-700">
              Address *
            </label>
            <textarea
              name="address"
              required
              rows={2}
              defaultValue={setting?.address}
              placeholder="12 Workshop Road, Lagos"
              className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-forest-700">Extras</h2>
        <div className="space-y-4">
          <Field
            label="Instagram handle"
            name="instagram"
            defaultValue={setting?.instagram ?? ""}
            placeholder="ifokanbale"
          />
          <Field
            label="Facebook page"
            name="facebook"
            defaultValue={setting?.facebook ?? ""}
            placeholder="ifokanbale"
          />
          <div>
            <label className="mb-1 block text-sm text-forest-700">
              Currency
            </label>
            <select
              name="currency"
              defaultValue={setting?.currency ?? "NGN"}
              className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            >
              <option value="NGN">NGN — Nigerian Naira (₦)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="GBP">GBP — British Pound (£)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold-500 px-8 py-3 font-medium text-forest-900 transition hover:bg-gold-600 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-forest-700">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}