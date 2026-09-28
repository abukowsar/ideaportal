import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DISTRICTS } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import IdeasManager, { type IdeaRow } from "./IdeasManager";

export default async function AdminIdeasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // admin layout shows the sign-in form
  const locale = await getLocale();

  if (session.user.role !== "ADMIN") {
    return (
      <section className="form-band">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-eyebrow">{t(locale, "restricted_area")}</span>
            <h2>{t(locale, "admin_nav_ideas")}</h2>
          </div>
          <div className="restricted">{t(locale, "admin_restricted")}</div>
          <p style={{ marginTop: "16px" }}>
            <Link className="btn btn-outline btn-sm" href="/">
              {t(locale, "back_to_home")}
            </Link>
          </p>
        </div>
      </section>
    );
  }

  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { submittedBy: { select: { name: true, username: true } }, dpp: { select: { status: true } } },
  });

  const data: IdeaRow[] = ideas.map((idea) => ({
    id: idea.id,
    docket: idea.docket,
    title: idea.title,
    category: idea.category,
    district: idea.district,
    upazila: idea.upazila,
    status: idea.status,
    submittedByName: idea.submittedBy.name,
    submittedByUsername: idea.submittedBy.username,
    dppStatus: idea.dpp?.status ?? null,
    createdAt: idea.createdAt.toISOString(),
  }));

  return (
    <>
      <div className="sec-head">
        <span className="sec-eyebrow">{t(locale, "admin_panel_eyebrow")}</span>
        <h2>{t(locale, "ideas_h2")}</h2>
        <p>{t(locale, "ideas_p")}</p>
      </div>
      <IdeasManager ideas={data} districts={DISTRICTS} locale={locale} />
    </>
  );
}
