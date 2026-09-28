import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DISTRICTS } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import type { TeamMemberData, WorkPlanRowData } from "@/lib/ideaFormat";
import ReviewBoard, { type IdeaCardData } from "./ReviewBoard";

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // admin layout shows the sign-in form
  const locale = await getLocale();

  if (session.user.role !== "ADMIN") {
    return (
      <section className="form-band">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-eyebrow">{t(locale, "restricted_area")}</span>
            <h2>{t(locale, "nav_admin")}</h2>
          </div>
          <div className="restricted">{t(locale, "admin_restricted_home_text")}</div>
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
    orderBy: { updatedAt: "desc" },
    include: { submittedBy: { select: { name: true, username: true } }, dpp: { select: { status: true } } },
  });

  const data: IdeaCardData[] = ideas.map((idea) => ({
    id: idea.id,
    docket: idea.docket,
    title: idea.title,
    officerName: idea.officerName,
    category: idea.category,
    district: idea.district,
    upazila: idea.upazila,
    concept: idea.concept,
    impact: idea.impact,
    solutionDescription: idea.solutionDescription,
    currentProcessMap: idea.currentProcessMap,
    proposedProcessMap: idea.proposedProcessMap,
    pilotLocation: idea.pilotLocation,
    implementationTimeline: idea.implementationTimeline,
    teamMembers: idea.teamMembers as TeamMemberData[] | null,
    resourceFinancial: idea.resourceFinancial,
    resourceManpower: idea.resourceManpower,
    resourceTechnical: idea.resourceTechnical,
    resourceOther: idea.resourceOther,
    resourceSource: idea.resourceSource,
    workPlan: idea.workPlan as WorkPlanRowData[] | null,
    status: idea.status,
    submittedByName: idea.submittedBy.name,
    submittedByUsername: idea.submittedBy.username,
    dppStatus: idea.dpp?.status ?? null,
    createdAt: idea.createdAt.toISOString(),
    updatedAt: idea.updatedAt.toISOString(),
  }));

  return (
    <>
      <div className="sec-head">
        <span className="sec-eyebrow">{t(locale, "action_center_eyebrow")}</span>
        <h2>{t(locale, "action_center_h2")}</h2>
        <p>{t(locale, "action_center_p")}</p>
      </div>
      <ReviewBoard ideas={data} districts={DISTRICTS} locale={locale} />
    </>
  );
}
