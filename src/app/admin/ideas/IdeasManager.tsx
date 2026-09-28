"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_META } from "@/lib/bn";
import { statusLabel, categoryLabel, districtLabel, formatNumber, ideaLocationLabel } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { setIdeaStatus } from "../actions";
import type { Status } from "@prisma/client";
import DppAction from "@/components/DppAction";
import Icon from "@/components/Icon";

export type IdeaRow = {
  id: string;
  docket: string;
  title: string;
  category: string;
  district: string;
  upazila: string | null;
  status: Status;
  submittedByName: string;
  submittedByUsername: string;
  dppStatus: "DRAFT" | "READY" | null;
  createdAt: string;
};

const STATUSES: Status[] = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"];

export default function IdeasManager({
  ideas,
  districts,
  locale,
}: {
  ideas: IdeaRow[];
  districts: string[];
  locale: Locale;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleStatusChange(idea: IdeaRow, next: string) {
    setBusyId(idea.id);
    setError("");
    const result = await setIdeaStatus(idea.id, next);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (next === "SELECTED" && idea.status !== "SELECTED") {
      router.push(`/admin/dpp/${idea.id}?selected=1`);
      return;
    }
    router.refresh();
  }

  const filtered = ideas.filter((idea) => {
    if (district && idea.district !== district) return false;
    if (status && idea.status !== status) return false;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      if (
        !idea.title.toLowerCase().includes(s) &&
        !idea.docket.toLowerCase().includes(s) &&
        !idea.submittedByName.toLowerCase().includes(s)
      ) {
        return false;
      }
    }
    return true;
  });

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
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t(locale, "filter_all_statuses")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s, locale)}
            </option>
          ))}
        </select>
        <span className="ro-strip">
          {formatNumber(filtered.length, locale)} / {formatNumber(ideas.length, locale)}
        </span>
        <a className="btn btn-outline btn-sm" href="/api/export/ideas">
          <Icon name="download" size={16} />
          {t(locale, "export_csv")}
        </a>
      </div>

      {error && (
        <p className="form-msg error" style={{ marginBottom: "14px" }}>
          {error}
        </p>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t(locale, "th_docket")}</th>
              <th>{t(locale, "th_title")}</th>
              <th>{t(locale, "th_district_upazila")}</th>
              <th>{t(locale, "th_submitted_by")}</th>
              <th>{t(locale, "th_status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((idea) => (
              <tr key={idea.id}>
                <td className="mono">{idea.docket}</td>
                <td className="cell-truncate" title={idea.title}>
                  {idea.title} <span className="admin-subtle">· {categoryLabel(idea.category, locale)}</span>
                </td>
                <td className="cell-truncate">{ideaLocationLabel(idea.upazila, idea.district, locale)}</td>
                <td className="cell-truncate">
                  {idea.submittedByName} <span className="admin-subtle mono">({idea.submittedByUsername})</span>
                </td>
                <td>
                  <select
                    className={`status-select ${STATUS_META[idea.status].cls}`}
                    value={idea.status}
                    disabled={busyId === idea.id}
                    onChange={(e) => handleStatusChange(idea, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s, locale)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="admin-row-actions">
                  {idea.status === "SELECTED" && (
                    <DppAction href={`/admin/dpp/${idea.id}`} status={idea.dppStatus} locale={locale} />
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  {t(locale, "no_proposals_found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
