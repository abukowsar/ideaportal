import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { categoryLabel, formatNumber, ideaLocationLabel, statusLabel } from "@/lib/i18n/vocab";
import { formatDate } from "@/lib/i18n/time";
import { toIdeaView } from "@/lib/ideaView";
import { MATURITY, MATURITY_KEYS, maturityLevel } from "@/lib/tech";
import type { IdeaStatus } from "@/lib/ideaFormat";
import StatusBadge from "@/components/StatusBadge";
import TechTags from "@/components/TechTags";
import MaturityMeter from "@/components/MaturityMeter";
import IdeaDetailSections from "@/components/IdeaDetailSections";
import CopyLinkButton from "@/components/CopyLinkButton";
import Icon from "@/components/Icon";

const include = { submittedBy: { select: { name: true } }, dpp: { select: { status: true } } } as const;
const JOURNEY: IdeaStatus[] = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const idea = await prisma.idea.findUnique({ where: { id }, select: { title: true, concept: true } });
  return idea ? { title: idea.title, description: idea.concept.slice(0, 160) } : {};
}

/** Shareable, read-only page for a single idea. */
export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [locale, row] = await Promise.all([getLocale(), prisma.idea.findUnique({ where: { id }, include })]);
  if (!row) notFound();
  const idea = toIdeaView(row);

  // Related: other ideas sharing at least one technology, most overlap first.
  const others = await prisma.idea.findMany({ where: { id: { not: id } }, include, orderBy: { updatedAt: "desc" } });
  const related = others
    .map(toIdeaView)
    .map((o) => ({ o, overlap: o.techTags.filter((k) => idea.techTags.includes(k)).length }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((r) => r.o);

  const reached = JOURNEY.indexOf(idea.status);
  const steps = [
    ...JOURNEY.map((s, i) => ({ key: s, label: statusLabel(s, locale), done: i <= reached })),
    { key: "DPP", label: t(locale, "dpp_status_ready"), done: idea.dppStatus === "READY" },
  ];
  const level = maturityLevel(idea.maturity);
  const hasDetails = Boolean(
    idea.solutionDescription ||
      idea.currentProcessMap ||
      idea.proposedProcessMap ||
      idea.pilotLocation ||
      idea.implementationTimeline ||
      idea.teamMembers?.length ||
      idea.workPlan?.length ||
      idea.resourceFinancial ||
      idea.resourceManpower ||
      idea.resourceTechnical ||
      idea.resourceOther ||
      idea.resourceSource
  );

  return (
    <section className="idea-page">
      <div className="wrap">
        <Link href="/repo" className="idea-back">
          <Icon name="arrowLeft" size={16} /> {t(locale, "idea_back")}
        </Link>

        <div className="idea-hero">
          <div className="idea-hero-main">
            <div className="idea-hero-top">
              <span className="c-docket">{idea.docket}</span>
              <StatusBadge status={idea.status} locale={locale} />
            </div>
            <h1>{idea.title}</h1>
            <div className="idea-hero-meta">
              <span>
                <Icon name="pin" size={15} /> {ideaLocationLabel(idea.upazila, idea.district, locale)}
              </span>
              <span>
                <Icon name="layers" size={15} /> {categoryLabel(idea.category, locale)}
              </span>
              <span>
                <Icon name="clock" size={15} /> {formatDate(idea.createdAt, locale)}
              </span>
            </div>
            <TechTags tags={idea.techTags} locale={locale} />
          </div>
          <div className="idea-hero-actions">
            <CopyLinkButton label={t(locale, "idea_share")} copiedLabel={t(locale, "idea_copied")} />
            <a className="btn btn-outline btn-sm" href={`/print/idea/${idea.id}`} target="_blank" rel="noreferrer">
              <Icon name="printer" size={15} /> {t(locale, "print_button")}
            </a>
          </div>
        </div>

        <div className="idea-layout">
          <div className="idea-content">
            <article className="dash-panel idea-block">
              <h2>{t(locale, "idea_concept_h")}</h2>
              <p className="idea-text">{idea.concept}</p>
              {idea.impact && (
                <>
                  <h3>{t(locale, "idea_impact_h")}</h3>
                  <p className="idea-text">{idea.impact}</p>
                </>
              )}
            </article>
            {hasDetails && (
              <article className="dash-panel idea-block">
                <h2>{t(locale, "idea_details_h")}</h2>
                <IdeaDetailSections idea={idea} locale={locale} />
              </article>
            )}
            <p className="idea-ro">
              <Icon name="lock" size={14} /> {t(locale, "modal_ro_note")}
            </p>
          </div>

          <aside className="idea-aside">
            <div className="dash-panel">
              <h3 className="idea-aside-h">{t(locale, "maturity_label")}</h3>
              <MaturityMeter value={idea.maturity} locale={locale} />
              <ol className="maturity-steps">
                {MATURITY_KEYS.map((k, i) => (
                  <li key={k} className={i < level ? "done" : undefined}>
                    <span>{formatNumber(i + 1, locale)}</span>
                    <div>
                      <b>{MATURITY[k][locale]}</b>
                      <small>{MATURITY[k].hint[locale]}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="dash-panel">
              <h3 className="idea-aside-h">{t(locale, "idea_journey")}</h3>
              <ol className="journey">
                {steps.map((s) => (
                  <li key={s.key} className={s.done ? "done" : undefined}>
                    <span className="journey-dot">{s.done && <Icon name="check" size={12} strokeWidth={3} />}</span>
                    {s.label}
                  </li>
                ))}
              </ol>
              <p className="idea-submitter">
                {t(locale, "modal_submitted_by")} <b>{idea.submittedByName}</b>
              </p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="idea-related">
            <h2>{t(locale, "idea_related")}</h2>
            <div className="cards">
              {related.map((r) => (
                <Link key={r.id} href={`/ideas/${r.id}`} className="card idea-card">
                  <div className="c-top">
                    <span className="c-docket">{r.docket}</span>
                    <StatusBadge status={r.status} locale={locale} />
                  </div>
                  <h3>{r.title}</h3>
                  <TechTags tags={r.techTags} locale={locale} max={3} />
                  <MaturityMeter value={r.maturity} locale={locale} compact />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
