"use client";

import { useEffect } from "react";
import { statusLabel, categoryLabel, districtLabel } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import type { IdeaView } from "@/lib/ideaFormat";
import IdeaDetailSections from "@/components/IdeaDetailSections";
import DppAction from "@/components/DppAction";
import DppStatusBadge from "@/components/dpp/DppStatusBadge";
import TechTags from "@/components/TechTags";
import MaturityMeter from "@/components/MaturityMeter";
import Icon from "@/components/Icon";

export default function IdeaModal({
  idea,
  locale,
  onClose,
  actionLabel,
  onAction,
  actionLoading = false,
  actionError = "",
  dpp,
}: {
  idea: IdeaView;
  locale: Locale;
  onClose: () => void;
  actionLabel?: string | null;
  onAction?: () => void;
  actionLoading?: boolean;
  actionError?: string;
  /** Link into the DPP builder; shown only for SELECTED ideas. */
  dpp?: { href: string; canEdit: boolean };
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="modal-back open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="idea-modal-title">
        <button className="m-close" onClick={onClose} aria-label={t(locale, "close")}>
          <Icon name="x" size={18} />
        </button>
        <span className="c-docket">{idea.docket}</span>
        <h3 id="idea-modal-title">{idea.title}</h3>
        <div className="m-sub">
          {t(locale, "modal_submitted_by")} {idea.submittedByName}
          {idea.officerName && ` · ${t(locale, "form_officer_name_label")}: ${idea.officerName}`}
        </div>
        <div className="m-grid">
          <div className="m-cell">
            <b>{t(locale, "modal_cell_district")}</b>
            <span>{districtLabel(idea.district, locale)}</span>
          </div>
          {idea.upazila && (
            <div className="m-cell">
              <b>{t(locale, "modal_cell_upazila")}</b>
              <span>{idea.upazila}</span>
            </div>
          )}
          <div className="m-cell">
            <b>{t(locale, "modal_cell_category")}</b>
            <span>{categoryLabel(idea.category, locale)}</span>
          </div>
          <div className="m-cell">
            <b>{t(locale, "modal_cell_status")}</b>
            <span>{statusLabel(idea.status, locale)}</span>
          </div>
          {dpp && idea.status === "SELECTED" && (
            <div className="m-cell">
              <b>DPP</b>
              <DppStatusBadge status={idea.dppStatus} locale={locale} />
            </div>
          )}
        </div>
        <div className="m-tech">
          <TechTags tags={idea.techTags} locale={locale} />
          <MaturityMeter value={idea.maturity} locale={locale} />
        </div>
        <div className="m-body">{idea.concept}</div>
        {idea.impact && (
          <div className="m-body" style={{ color: "var(--muted)", fontSize: ".9rem" }}>
            {t(locale, "modal_expected_impact")} {idea.impact}
          </div>
        )}
        <IdeaDetailSections idea={idea} locale={locale} />
        <div className="m-ro">{t(locale, "modal_ro_note")}</div>
        <div className="m-actions">
          {dpp && idea.status === "SELECTED" && (
            <DppAction href={dpp.href} status={idea.dppStatus} canEdit={dpp.canEdit} locale={locale} />
          )}
          {actionLabel && onAction && (
            <button className="btn btn-green btn-sm" onClick={onAction} disabled={actionLoading}>
              {actionLoading ? t(locale, "processing") : actionLabel}
            </button>
          )}
          <a className="btn btn-outline btn-sm" href={`/ideas/${idea.id}`}>
            <Icon name="external" size={15} />
            {t(locale, "idea_open_page")}
          </a>
          <a className="btn btn-outline btn-sm" href={`/print/idea/${idea.id}`} target="_blank" rel="noreferrer">
            <Icon name="printer" size={16} />
            {t(locale, "print_button")}
          </a>
        </div>
        {actionError && (
          <p className="form-msg error" style={{ marginTop: "10px" }}>
            {actionError}
          </p>
        )}
      </div>
    </div>
  );
}
