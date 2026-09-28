import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getLocale } from "@/lib/i18n/locale";
import DppWorkspace from "@/components/dpp/DppWorkspace";

export default async function DppPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ selected?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const [{ id }, { selected }] = await Promise.all([params, searchParams]);
  return (
    <DppWorkspace
      ideaId={id}
      user={session.user}
      locale={await getLocale()}
      basePath="/dpp"
      justSelected={selected === "1"}
    />
  );
}
