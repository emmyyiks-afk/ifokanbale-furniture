import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  const setting = await prisma.setting.findUnique({
    where: { id: "singleton" },
  });

  const phone = setting?.phone ?? "+2348068238642";
  const whatsapp = setting?.whatsapp ?? "+2348068238642";
  const email = setting?.email ?? "ifokanbalefoamandfurniture@gmail.com";
  const address = setting?.address ?? "Ipetumodu, Osun, Nigeria";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-forest-700 md:text-5xl">
        Visit our workshop
      </h1>
      <p className="mt-3 max-w-2xl text-forest-600">
        Come see the pieces in person, or reach out — we answer every message.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-forest-100 bg-white p-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Phone
            </h2>
            <p className="mt-2 text-lg text-forest-700">{phone}</p>
          </div>

          <div className="rounded-xl border border-forest-100 bg-white p-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Email
            </h2>
            <p className="mt-2 text-lg text-forest-700">{email}</p>
          </div>

          <div className="rounded-xl border border-forest-100 bg-white p-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Address
            </h2>
            <p className="mt-2 text-lg text-forest-700">{address}</p>
          </div>
        </div>

        {/* WhatsApp card */}
        <div className="flex flex-col justify-center rounded-2xl bg-forest-700 p-10 text-center text-cream">
          <p className="font-display text-3xl text-gold-500">Quick reply</p>
          <p className="mt-3 text-sm text-cream/80">
            WhatsApp is the fastest way to reach us. Send a photo of what you want
            and we'll quote you within hours.
          </p>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-3 text-sm font-medium text-forest-900 transition hover:bg-gold-600"
          >
            Open WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}