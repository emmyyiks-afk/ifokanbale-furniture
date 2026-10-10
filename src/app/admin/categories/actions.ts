"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name) throw new Error("Name is required");

  const slug = slugify(name);

  const max = await prisma.category.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      sortOrder: (max?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!name) throw new Error("Name is required");

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      imageUrl: imageUrl || null,
      isActive,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    throw new Error(
      `Cannot delete — ${productCount} product(s) use this category. Move or delete them first.`
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function toggleCategoryActive(id: string, current: boolean) {
  await requireAdmin();
  await prisma.category.update({
    where: { id },
    data: { isActive: !current },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}