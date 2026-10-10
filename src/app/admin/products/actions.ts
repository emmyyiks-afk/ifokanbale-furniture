"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Generate a unique slug for a product.
 * If "king-bed" exists, tries "king-bed-2", "king-bed-3", etc.
 * Pass excludeId when updating so a product doesn't collide with itself.
 */
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) break;
    if (excludeId && existing.id === excludeId) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const stockStatus = String(formData.get("stockStatus") ?? "IN_STOCK");
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name || !categoryId || !price) {
    throw new Error("Name, category and price are required");
  }

  // Unique slug — no more collisions
  const slug = await generateUniqueSlug(name);

  await prisma.product.create({
    data: {
      name,
      slug,
      categoryId,
      description: description || null,
      price,
      stockStatus,
      isFeatured,
      isActive,
      images: {
        create: imageUrls.map((url, i) => ({
          url,
          sortOrder: i,
          altText: name,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
  redirect(`/admin/products`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const stockStatus = String(formData.get("stockStatus") ?? "IN_STOCK");
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name || !categoryId || !price) {
    throw new Error("Name, category and price are required");
  }

  // Unique slug, excluding this product's own current slug
  const slug = await generateUniqueSlug(name, id);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      categoryId,
      description: description || null,
      price,
      stockStatus,
      isFeatured,
      isActive,
    },
  });

  // Replace images: delete existing, recreate
  await prisma.productImage.deleteMany({ where: { productId: id } });
  if (imageUrls.length > 0) {
    await prisma.productImage.createMany({
      data: imageUrls.map((url, i) => ({
        productId: id,
        url,
        sortOrder: i,
        altText: name,
      })),
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
  redirect(`/admin/products`);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
}

export async function toggleStock(id: string, current: string) {
  await requireAdmin();
  await prisma.product.update({
    where: { id },
    data: {
      stockStatus: current === "IN_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK",
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
}

export async function toggleActive(id: string, current: boolean) {
  await requireAdmin();
  await prisma.product.update({
    where: { id },
    data: { isActive: !current },
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
}