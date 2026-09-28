import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { loadDppContext } from "@/lib/dppServer";
import DppDocument from "@/components/dpp/DppDocument";
import PrintButton from "../../idea/[id]/PrintButton";

export default async function PrintDppPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { id } = await params;
  const locale = await getLocale();
  const ctx = await loadDppContext(id, session.user);
  if (!ctx?.dpp) notFound();
  const back = session.user.role === "ADMIN" ? `/admin/dpp/${id}` : `/dpp/${id}`;

  return (
    <div className="print-page">
      <div className="print-toolbar">
        <a className="btn btn-outline btn-sm" href={back}>
          {t(locale, "print_back")}
        </a>
        <PrintButton label={t(locale, "print_now")} />
      </div>
      <DppDocument idea={ctx.idea} dpp={ctx.dpp} locale={locale} />
    </div>
  );
}
