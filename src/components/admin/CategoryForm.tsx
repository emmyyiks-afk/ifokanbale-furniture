"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/utils/uploadthing";
import { createCategory } from "@/app/admin/categories/actions";

export function CategoryForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const url = res[0]?.ufsUrl;
      if (url) setImageUrl(url);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onUploadError: (err) => {
      setError(`Upload failed: ${err.message}`);
      setUploading(false);
    },
  });

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      await startUpload(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (imageUrl) formData.set("imageUrl", imageUrl);

    try {
      await createCategory(formData);
      form.reset();
      setImageUrl(null);
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

      {/* ── Photo upload ── */}
      <div>
        <label className="mb-2 block text-sm text-forest-700">
          Category photo
        </label>

        {imageUrl ? (
          <div className="relative overflow-hidden rounded-lg border-2 border-gold-500">
            <div className="relative aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Category preview"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFiles}
              disabled={uploading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-forest-200 bg-cream px-6 py-8 text-center transition hover:border-gold-500 hover:bg-gold-50 disabled:opacity-50"
            >
              <div>
                <p className="font-display text-base text-forest-700">
                  {uploading ? "Uploading…" : "+ Add photo"}
                </p>
                <p className="mt-1 text-xs text-forest-500">
                  From your phone or computer
                </p>
              </div>
            </button>
          </>
        )}

        <p className="mt-2 text-xs text-forest-400">
          Optional. If left empty, the category will use the first product's
          photo.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending || uploading}
        className="w-full rounded-full bg-gold-500 px-4 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}