"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { statusLabel, categoryLabel, districtLabel, formatNumber, ideaLocationLabel } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import { timeAgo } from "@/lib/i18n/time";
import type { Locale } from "@/lib/i18n/locale";
import IdeaDetailSections from "@/components/IdeaDetailSections";
import DppAction from "@/components/DppAction";
import type { TeamMemberData, WorkPlanRowData } from "@/lib/ideaFormat";
import { deleteIdea, setIdeaStatus } from "./actions";
import type { Status } from "@prisma/client";
import Icon from "@/components/Icon";

export type IdeaCardData = {
  id: string;
  docket: string;
  title: string;
  officerName: string | null;
  category: string;
  district: string;
  upazila: string | null;
  concept: string;
  impact: string | null;
  solutionDescription: string | null;
  currentProcessMap: string | null;
  proposedProcessMap: string | null;
  pilotLocation: string | null;
  implementationTimeline: string | null;
  teamMembers: TeamMemberData[] | null;
  resourceFinancial: string | null;
  resourceManpower: string | null;
  resourceTechnical: string | null;
  resourceOther: string | null;
  resourceSource: string | null;
  workPlan: WorkPlanRowData[] | null;
  status: Status;
  submittedByName: string;
  submittedByUsername: string;
  dppStatus: "DRAFT" | "READY" | null;
  createdAt: string;
  updatedAt: string;
};

const COLUMNS: Status[] = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"];

function advanceLabel(status: Status, locale: Locale): string | undefined {
  if (status === "UPAZILA") return t(locale, "advance_to_district");
  if (status === "DISTRICT") return t(locale, "advance_to_hq");
  if (status === "HQ") return t(locale, "advance_final_select");
  return undefined;
}

function nextStatus(s: Status): Status | null {
  const i = COLUMNS.indexOf(s);
  return i >= 0 && i < COLUMNS.length - 1 ? COLUMNS[i + 1] : null;
}

function prevStatus(s: Status): Status | null {
  const i = COLUMNS.indexOf(s);
  return i > 0 ? COLUMNS[i - 1] : null;
}

export default function ReviewBoard({
  ideas: initialIdeas,
  districts,
  locale,
}: {
  ideas: IdeaCardData[];
  districts: string[];
  locale: Locale;
}) {
  const router = useRouter();
  const [ideas, setIdeas] = useState(initialIdeas);
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (district && idea.district !== district) return false;
      if (query) {
        const hay = `${idea.title} ${idea.docket} ${idea.submittedByName}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [ideas, q, district]);

  const grouped = useMemo(() => {
    const map: Record<Status, IdeaCardData[]> = { UPAZILA: [], DISTRICT: [], HQ: [], SELECTED: [] };
    for (const idea of filtered) map[idea.status].push(idea);
    return map;
  }, [filtered]);

  async function applyStatus(idea: IdeaCardData, status: Status) {
    setBusyId(idea.id);
    setError("");
    const result = await setIdeaStatus(idea.id, status);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (status === "SELECTED") {
      // A freshly selected idea goes straight to its pre-filled DPP draft.
      router.push(`/admin/dpp/${idea.id}?selected=1`);
      return;
    }
    setIdeas((prev) => prev.map((x) => (x.id === idea.id ? { ...x, status } : x)));
    router.refresh();
  }

  async function handleDelete(idea: IdeaCardData) {
    const confirmMsg = t(locale, "confirm_delete_idea").replace("{title}", idea.title).replace("{docket}", idea.docket);
    if (!confirm(confirmMsg)) return;
    setBusyId(idea.id);
    setError("");
    const result = await deleteIdea(idea.id);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setIdeas((prev) => prev.filter((x) => x.id !== idea.id));
    setOpenId((id) => (id === idea.id ? null : id));
    router.refresh();
  }

  const openIdea = ideas.find((x) => x.id === openId) ?? null;

  return (
    <div>
      <div className="repo-controls">
        <input
          placeholder={t(locale, "review_search_placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">{t(locale, "filter_all_districts")}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {districtLabel(d, locale)}
            </option>
          ))}
        </select>
        <span className="ro-strip">
          {formatNumber(filtered.length, locale)} / {formatNumber(ideas.length, locale)}
        </span>
      </div>

      {error && (
        <p className="form-msg error" style={{ marginBottom: "14px" }}>
          {error}
        </p>
      )}

      <div className="kanban">
        {COLUMNS.map((status) => (
          <div className="kanban-col" key={status}>
            <div className="kanban-col-head">
              <h4>{statusLabel(status, locale)}</h4>
              <span className="kanban-count">{formatNumber(grouped[status].length, locale)}</span>
            </div>
            <div className="kanban-cards">
              {grouped[status].map((idea) => {
                const next = nextStatus(idea.status);
                const prev = prevStatus(idea.status);
                const busy = busyId === idea.id;
                return (
                  <div className="kanban-card" key={idea.id}>
                    <div className="c-top">
                      <span className="c-docket">{idea.docket}</span>
                      <span className="admin-subtle">{timeAgo(idea.updatedAt, locale)}</span>
                    </div>
                    <button
                      type="button"
                      className="kanban-title"
                      onClick={() => {
                        setOpenId(idea.id);
                        setError("");
                      }}
                    >
                      {idea.title}
                    </button>
                    <p className="k-sum">{idea.concept}</p>
                    <div className="k-meta">
                      <span>
                        <Icon name="pin" size={13} /> {ideaLocationLabel(idea.upazila, idea.district, locale)}
                      </span>
                      <span>{categoryLabel(idea.category, locale)}</span>
                    </div>
                    <div className="k-meta">
                      <span>{t(locale, "submitted_by_label")} {idea.submittedByName}</span>
                    </div>
                    <div className="kanban-actions">
                      {idea.status === "SELECTED" && (
                        <DppAction href={`/admin/dpp/${idea.id}`} status={idea.dppStatus} locale={locale} />
                      )}
                      {next && (
                        <button
                          type="button"
                          className="btn btn-green btn-sm"
                          disabled={busy}
                          onClick={() => applyStatus(idea, next)}
                        >
                          {busy ? t(locale, "processing") : advanceLabel(idea.status, locale)}
                        </button>
                      )}
                      {prev && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled={busy}
                          onClick={() => applyStatus(idea, prev)}
                        >
                          {t(locale, "send_back")}
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline btn-sm btn-danger"
                        disabled={busy}
                        onClick={() => handleDelete(idea)}
                      >
                        {t(locale, "delete_label")}
                      </button>
                    </div>
                  </div>
                );
              })}
              {grouped[status].length === 0 && (
                <div className="kanban-empty">{t(locale, "no_proposals_at_stage")}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {openIdea && (
        <div
          className="modal-back open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenId(null);
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rev-title">
            <button className="m-close" onClick={() => setOpenId(null)} aria-label={t(locale, "close")}>
              <Icon name="x" size={18} />
            </button>
            <span className="c-docket">{openIdea.docket}</span>
            <h3 id="rev-title">{openIdea.title}</h3>
            <div className="m-sub">
              {t(locale, "modal_submitted_by")} {openIdea.submittedByName} ({openIdea.submittedByUsername})
              {openIdea.officerName && ` · ${t(locale, "form_officer_name_label")}: ${openIdea.officerName}`}
            </div>
            <div className="m-grid">
              <div className="m-cell">
                <b>{t(locale, "modal_cell_district")}</b>
                <span>{districtLabel(openIdea.district, locale)}</span>
              </div>
              {openIdea.upazila && (
                <div className="m-cell">
                  <b>{t(locale, "modal_cell_upazila")}</b>
                  <span>{openIdea.upazila}</span>
                </div>
              )}
              <div className="m-cell">
                <b>{t(locale, "modal_cell_category")}</b>
                <span>{categoryLabel(openIdea.category, locale)}</span>
              </div>
              <div className="m-cell">
                <b>{t(locale, "modal_cell_status")}</b>
                <span>{statusLabel(openIdea.status, locale)}</span>
              </div>
            </div>
            <div className="m-body">{openIdea.concept}</div>
            {openIdea.impact && (
              <div className="m-body" style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                {t(locale, "modal_expected_impact")} {openIdea.impact}
              </div>
            )}
            <IdeaDetailSections idea={openIdea} locale={locale} />
            <div className="m-actions">
              {openIdea.status === "SELECTED" && (
                <DppAction href={`/admin/dpp/${openIdea.id}`} status={openIdea.dppStatus} locale={locale} />
              )}
              {nextStatus(openIdea.status) && (
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  disabled={busyId === openIdea.id}
                  onClick={() => applyStatus(openIdea, nextStatus(openIdea.status)!)}
                >
                  {advanceLabel(openIdea.status, locale)}
                </button>
              )}
              {prevStatus(openIdea.status) && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={busyId === openIdea.id}
                  onClick={() => applyStatus(openIdea, prevStatus(openIdea.status)!)}
                >
                  {t(locale, "send_back_full")}
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline btn-sm btn-danger"
                disabled={busyId === openIdea.id}
                onClick={() => handleDelete(openIdea)}
              >
                {t(locale, "delete_label")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
