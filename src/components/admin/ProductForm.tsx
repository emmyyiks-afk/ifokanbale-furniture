"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product, ProductImage } from "@prisma/client";
import { useUploadThing } from "@/utils/uploadthing";

type ProductWithImages = Product & { images: ProductImage[] };

export function ProductForm({
  categories,
  product,
  onSubmit,
}: {
  categories: Category[];
  product?: ProductWithImages;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images.map((i) => i.url) ?? []
  );

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const newUrls = res.map((file) => file.ufsUrl);
      setImageUrls((prev) => [...prev, ...newUrls]);
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
    setUploading(true);

    try {
      await startUpload(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPending(true);
    setError("");

    try {
      const formData = new FormData(form);
      formData.set("imageUrls", imageUrls.join("\n"));
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* ── Basics ── */}
      <div className="rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="mb-4 font-display text-xl text-forest-700">Basics</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-forest-700">
              Product name *
            </label>
            <input
              name="name"
              required
              defaultValue={product?.name}
              placeholder="King Size Bed"
              className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-forest-700">
                Category *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={product?.categoryId}
                className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
              >
                <option value="">Choose…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-forest-700">
                Price (₦) *
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="100"
                required
                defaultValue={product?.price}
                placeholder="250000"
                className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-forest-700">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              placeholder="Solid mahogany, hand-finished. Available in king and queen."
              className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Photos ── */}
      <div className="rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="mb-1 font-display text-xl text-forest-700">Photos</h2>
        <p className="mb-5 text-xs text-forest-400">
          Click the button below to pick photos from your phone or computer.
        </p>

        {imageUrls.length > 0 && (
          <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {imageUrls.map((url) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-lg border border-forest-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-forest-200 bg-cream px-6 py-10 text-center transition hover:border-gold-500 hover:bg-gold-50 disabled:opacity-50"
        >
          <div>
            <p className="font-display text-lg text-forest-700">
              {uploading ? "Uploading…" : "+ Add photos"}
            </p>
            <p className="mt-1 text-xs text-forest-500">
              JPG, PNG, WebP or GIF · up to 4 at a time
            </p>
          </div>
        </button>

        <p className="mt-3 text-xs text-forest-400">
          Click <strong>Save</strong> after photos upload to attach them to the
          product.
        </p>
      </div>

      {/* ── Status ── */}
      <div className="rounded-2xl border border-forest-100 bg-white p-6">
        <h2 className="mb-4 font-display text-xl text-forest-700">Status</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-forest-700">
              Stock status
            </label>
            <select
              name="stockStatus"
              defaultValue={product?.stockStatus ?? "IN_STOCK"}
              className="w-full rounded-lg border border-forest-200 bg-cream px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            >
              <option value="IN_STOCK">In stock</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm text-forest-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product?.isActive ?? true}
              className="h-4 w-4 accent-gold-500"
            />
            Visible on public site
          </label>

          <label className="flex items-center gap-3 text-sm text-forest-700">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product?.isFeatured ?? false}
              className="h-4 w-4 accent-gold-500"
            />
            Show on homepage as featured
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-gold-500 px-8 py-3 font-medium text-forest-900 transition hover:bg-gold-600 disabled:opacity-50"
        >
          {pending
            ? "Saving…"
            : product
            ? "Save changes"
            : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-forest-200 px-8 py-3 text-sm text-forest-700 transition hover:bg-forest-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}