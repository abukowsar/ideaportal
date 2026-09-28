"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryLabel, ideaLocationLabel } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import { timeAgo } from "@/lib/i18n/time";
import type { Locale } from "@/lib/i18n/locale";
import type { IdeaView, Viewer } from "@/lib/ideaFormat";
import { actionLabelFor, dppLinkFor } from "@/lib/ideaActions";
import DppAction from "@/components/DppAction";
import DppStatusBadge from "@/components/dpp/DppStatusBadge";
import StatusBadge from "@/components/StatusBadge";
import IdeaModal from "@/components/IdeaModal";
import { advanceStatus } from "@/app/(site)/repo/actions";
import Icon from "@/components/Icon";

export default function DashboardList({
  ideas,
  viewer,
  locale,
  emptyText,
}: {
  ideas: IdeaView[];
  viewer: Viewer;
  locale: Locale;
  emptyText: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const closeModal = useCallback(() => setOpenId(null), []);

  async function advance(idea: IdeaView) {
    setBusyId(idea.id);
    setErrors((prev) => ({ ...prev, [idea.id]: "" }));
    const result = await advanceStatus(idea.id);
    setBusyId(null);
    if (!result.ok) {
      setErrors((prev) => ({ ...prev, [idea.id]: result.error }));
      return;
    }
    if (result.status === "SELECTED") {
      // Final selection hands the idea straight to the DPP builder, pre-filled from the proposal.
      router.push(`/dpp/${idea.id}?selected=1`);
      return;
    }
    router.refresh();
  }

  if (ideas.length === 0) return <div className="dash-empty">{emptyText}</div>;

  const openIdea = ideas.find((x) => x.id === openId) ?? null;

  return (
    <>
      <ul className="dash-list">
        {ideas.map((idea) => {
          const label = actionLabelFor(viewer, idea, locale);
          const busy = busyId === idea.id;
          const dpp = dppLinkFor(viewer, idea, true);
          return (
            <li className="dash-item" key={idea.id}>
              <div className="dash-item-main">
                <div className="dash-item-top">
                  <span className="c-docket">{idea.docket}</span>
                  <StatusBadge status={idea.status} locale={locale} />
                  {dpp && <DppStatusBadge status={idea.dppStatus} locale={locale} />}
                </div>
                <button type="button" className="dash-item-title" onClick={() => setOpenId(idea.id)}>
                  {idea.title}
                </button>
                <div className="dash-item-meta">
                  <Icon name="pin" size={13} /> {ideaLocationLabel(idea.upazila, idea.district, locale)} · {categoryLabel(idea.category, locale)} ·{" "}
                  {timeAgo(idea.updatedAt, locale)}
                </div>
                {errors[idea.id] && <p className="form-msg error">{errors[idea.id]}</p>}
              </div>
              <div className="dash-item-actions">
                {dpp && <DppAction href={dpp.href} status={idea.dppStatus} canEdit={dpp.canEdit} locale={locale} />}
                {label && (
                  <button type="button" className="btn btn-green btn-sm" disabled={busy} onClick={() => advance(idea)}>
                    {busy ? t(locale, "processing") : label}
                  </button>
                )}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpenId(idea.id)}>
                  {t(locale, "view_details")}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {openIdea && (
        <IdeaModal
          idea={openIdea}
          locale={locale}
          onClose={closeModal}
          actionLabel={actionLabelFor(viewer, openIdea, locale)}
          onAction={() => advance(openIdea)}
          actionLoading={busyId === openIdea.id}
          actionError={errors[openIdea.id]}
          dpp={dppLinkFor(viewer, openIdea, true)}
        />
      )}
    </>
  );
}
