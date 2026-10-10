import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const setting = await prisma.setting.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-forest-700">Shop settings</h1>
        <p className="mt-1 text-sm text-forest-500">
          These details appear on the public site and in WhatsApp links.
        </p>
      </div>

      <SettingsForm setting={setting} />
    </div>
  );
}