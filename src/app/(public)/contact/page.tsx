import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  const setting = await prisma.setting.findUnique({
    where: { id: "singleton" },
  });

  const phone = setting?.phone ?? "+234 806 823 8642";
  const rawWhatsapp = setting?.whatsapp ?? "2348068238642";
  // Strip +, spaces, dashes — wa.me needs digits only
  const whatsapp = rawWhatsapp.replace(/\D/g, "");
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

      <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
        {/* Contact info */}
        <div className="min-w-0 space-y-6">
          <div className="rounded-xl border border-forest-100 bg-white p-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Phone
            </h2>
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="mt-2 block break-words text-base text-forest-700 hover:text-gold-600 sm:text-lg"
            >
              {phone}
            </a>
          </div>

          <div className="rounded-xl border border-forest-100 bg-white p-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Email
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-2 block break-all text-base text-forest-700 hover:text-gold-600 sm:text-lg"
            >
              {email}
            </a>
          </div>

          <div className="rounded-xl border border-forest-100 bg-white p-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Address
            </h2>
            <p className="mt-2 break-words text-base text-forest-700 sm:text-lg">
              {address}
            </p>
          </div>
        </div>

        {/* WhatsApp card */}
        <div className="flex min-w-0 flex-col justify-center rounded-2xl bg-forest-700 p-8 text-center text-cream sm:p-10">
          <p className="font-display text-2xl text-gold-500 sm:text-3xl">
            Quick reply
          </p>
          <p className="mt-3 text-sm text-cream/80">
            WhatsApp is the fastest way to reach us. Send a photo of what you
            want and we&apos;ll quote you within hours.
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