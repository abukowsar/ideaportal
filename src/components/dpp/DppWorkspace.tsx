import Link from "next/link";
import { notFound } from "next/navigation";
import type { Role } from "@prisma/client";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { districtLabel } from "@/lib/i18n/vocab";
import { loadDppContext } from "@/lib/dppServer";
import { dppDefaultsFromIdea } from "@/lib/dpp";
import DppEditor from "./DppEditor";
import DppDocument from "./DppDocument";
import DppStatusBadge from "./DppStatusBadge";
import Icon from "@/components/Icon";

/** DPP editor (HQ/admin) or read-only DPP view (everyone else in scope) for one selected idea. */
export default async function DppWorkspace({
  ideaId,
  user,
  locale,
  basePath,
  justSelected,
}: {
  ideaId: string;
  user: { id: string; role: Role; district: string | null };
  locale: Locale;
  basePath: string;
  justSelected: boolean;
}) {
  const ctx = await loadDppContext(ideaId, user);
  if (!ctx) notFound();
  const { idea, dpp, canEdit } = ctx;
  const printHref = `/print/dpp/${idea.id}`;

  return (
    <>
      <div className="dash-hero">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <span className="sec-eyebrow">
            {t(locale, "nav_dpp")} · <span className="mono">{idea.docket}</span>
          </span>
          <h2>{dpp?.projectName || idea.title}</h2>
          <p>
            <Icon name="pin" size={15} /> {idea.upazila ? `${idea.upazila}, ` : ""}
            {districtLabel(idea.district, locale)} · {t(locale, "modal_submitted_by")} {idea.submittedByName}
          </p>
        </div>
        <div className="dash-hero-actions">
          <DppStatusBadge status={dpp?.status ?? null} locale={locale} />
          <Link className="btn btn-outline btn-sm" href={basePath}>
            {t(locale, "dpp_back")}
          </Link>
          <a className="btn btn-outline btn-sm" href={`/print/idea/${idea.id}`} target="_blank" rel="noreferrer">
            {t(locale, "dpp_source_idea")} <Icon name="external" size={14} />
          </a>
        </div>
      </div>

      {canEdit ? (
        <>
          <div className={`dpp-note${justSelected && !dpp ? " is-celebrate" : ""}`}>
            <Icon name={justSelected && !dpp ? "sparkles" : "info"} size={18} />
            <span>{justSelected && !dpp ? t(locale, "dpp_just_selected") : t(locale, "dpp_source_note")}</span>
          </div>
          <DppEditor
            ideaId={idea.id}
            initial={dpp ?? dppDefaultsFromIdea(idea)}
            initialStatus={dpp?.status ?? null}
            isNew={!dpp}
            locale={locale}
            printHref={printHref}
          />
        </>
      ) : dpp ? (
        <>
          <div className="dpp-note">
            <Icon name="info" size={18} />
            <span>{t(locale, "dpp_readonly_note")}</span>{" "}
            <a href={printHref} target="_blank" rel="noreferrer">
              <Icon name="printer" size={15} /> {t(locale, "dpp_print")}
            </a>
          </div>
          <div className="dpp-readonly">
            <DppDocument idea={idea} dpp={dpp} locale={locale} />
          </div>
        </>
      ) : (
        <div className="dash-panel">
          <div className="dash-empty">{t(locale, "dpp_not_started_note")}</div>
        </div>
      )}
    </>
  );
}
