import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getLocale } from "@/lib/i18n/locale";
import DppHub, { parseDppFilter } from "@/components/dpp/DppHub";

export default async function AdminDppHubPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // admin layout shows the sign-in form
  if (session.user.role !== "ADMIN") redirect("/dpp");
  const { f } = await searchParams;
  return <DppHub user={session.user} locale={await getLocale()} basePath="/admin/dpp" filter={parseDppFilter(f)} />;
}
