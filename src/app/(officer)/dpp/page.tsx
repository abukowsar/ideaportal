import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getLocale } from "@/lib/i18n/locale";
import DppHub, { parseDppFilter } from "@/components/dpp/DppHub";

export default async function DppHubPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { f } = await searchParams;
  return <DppHub user={session.user} locale={await getLocale()} basePath="/dpp" filter={parseDppFilter(f)} />;
}
