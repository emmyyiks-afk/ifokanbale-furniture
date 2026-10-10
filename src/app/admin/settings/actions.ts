"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const shopName = String(formData.get("shopName") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const currency = String(formData.get("currency") ?? "NGN");
  const instagram = String(formData.get("instagram") ?? "").trim();
  const facebook = String(formData.get("facebook") ?? "").trim();

  if (!shopName || !phone || !whatsapp || !address) {
    throw new Error("Shop name, phone, WhatsApp and address are required");
  }

  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {
      shopName,
      tagline: tagline || null,
      phone,
      whatsapp,
      email: email || null,
      address,
      currency,
      instagram: instagram || null,
      facebook: facebook || null,
    },
    create: {
      id: "singleton",
      shopName,
      tagline: tagline || null,
      phone,
      whatsapp,
      email: email || null,
      address,
      currency,
      instagram: instagram || null,
      facebook: facebook || null,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/product/[slug]", "page");
}