import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──
  const passwordHash = await bcrypt.hash("Ifokanbale2424", 12);

  await prisma.user.upsert({
    where: { email: "admin@ifokanbale.com" },
    update: { passwordHash },
    create: {
      name: "Admin",
      email: "admin@ifokanbale.com",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created (admin@ifokanbale.com / Ifokanbale2424)");

  // ── Categories ──
  const categories = [
    { name: "Beds",       slug: "beds",       sortOrder: 1 },
    { name: "Pillows",    slug: "pillows",    sortOrder: 2 },
    { name: "Sofas",      slug: "sofas",      sortOrder: 3 },
    { name: "Tables",     slug: "tables",     sortOrder: 4 },
    { name: "Chairs",     slug: "chairs",     sortOrder: 5 },
    { name: "Wardrobes",  slug: "wardrobes",  sortOrder: 6 },
    { name: "Mattresses", slug: "mattresses", sortOrder: 7 },
    { name: "Decor",      slug: "decor",      sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✓ ${categories.length} categories seeded`);

  // ── Shop settings ──
  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {
      shopName: "IFOKANBALE Forms & Furniture Work",
      tagline: "Handcrafted furniture for every home",
      phone: "+2348068238642  ",
      whatsapp: "2348068238642  ",
      email: "ifokanbalefoamandfurniture@gmail.com",
      address: "12, Market Street, Kooso, Ipetumodu, Osun State",
      currency: "NGN",
    },
    create: {
      id: "singleton",
      shopName: "IFOKANBALE Forms & Furniture Work",
      tagline: "Handcrafted furniture for every home",
      phone: "+2348068238642  ",
      whatsapp: "2348068238642  ",
      email: "ifokanbalefoamandfurniture@gmail.com",
      address: "12, Market Street, Kooso, Ipetumodu, Osun State",
      currency: "NGN",
    },
  });
  console.log("✓ Shop settings seeded");

  console.log("\n✨ Database ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());