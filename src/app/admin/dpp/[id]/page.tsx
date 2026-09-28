import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getLocale } from "@/lib/i18n/locale";
import DppWorkspace from "@/components/dpp/DppWorkspace";

export default async function AdminDppPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ selected?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // admin layout shows the sign-in form
  const [{ id }, { selected }] = await Promise.all([params, searchParams]);
  if (session.user.role !== "ADMIN") redirect(`/dpp/${id}`);
  return (
    <DppWorkspace
      ideaId={id}
      user={session.user}
      locale={await getLocale()}
      basePath="/admin/dpp"
      justSelected={selected === "1"}
    />
  );
}
