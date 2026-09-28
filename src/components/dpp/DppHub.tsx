import Link from "next/link";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { t, type DictKey } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { formatNumber, ideaLocationLabel, categoryLabel } from "@/lib/i18n/vocab";
import { timeAgo } from "@/lib/i18n/time";
import { scopeWhere } from "@/lib/ideaView";
import { canEditDpp } from "@/lib/dppServer";
import { costTotal, formatLakh, type DppCostItem } from "@/lib/dpp";
import DppStatusBadge from "./DppStatusBadge";
import Icon from "@/components/Icon";

export type DppFilter = "all" | "none" | "draft" | "ready";
export const parseDppFilter = (v: string | string[] | undefined): DppFilter =>
  v === "none" || v === "draft" || v === "ready" ? v : "all";

/** List of SELECTED ideas and where each one's DPP stands. Shared by officer and admin workspaces. */
export default async function DppHub({
  user,
  locale,
  basePath,
  filter,
}: {
  user: { id: string; role: Role; district: string | null };
  locale: Locale;
  basePath: string;
  filter: DppFilter;
}) {
  const ideas = await prisma.idea.findMany({
    where: { ...scopeWhere(user), status: "SELECTED" },
    orderBy: { updatedAt: "desc" },
    include: {
      dpp: { select: { status: true, costItems: true, updatedAt: true } },
    },
  });

  const counts = {
    none: ideas.filter((i) => !i.dpp).length,
    draft: ideas.filter((i) => i.dpp?.status === "DRAFT").length,
    ready: ideas.filter((i) => i.dpp?.status === "READY").length,
  };
  const shown = ideas.filter((i) =>
    filter === "all" ? true : filter === "none" ? !i.dpp : i.dpp?.status === filter.toUpperCase()
  );
  // Ideas waiting for a DPP come first — that is the work to do.
  const rank = (i: (typeof ideas)[number]) => (!i.dpp ? 0 : i.dpp.status === "DRAFT" ? 1 : 2);
  shown.sort((a, b) => rank(a) - rank(b));

  const editor = canEditDpp(user.role);
  const n = (v: number) => formatNumber(v, locale);
  const tabs: { key: DppFilter; label: DictKey; count: number }[] = [
    { key: "all", label: "dpp_filter_all", count: ideas.length },
    { key: "none", label: "dpp_kpi_waiting", count: counts.none },
    { key: "draft", label: "dpp_kpi_draft", count: counts.draft },
    { key: "ready", label: "dpp_kpi_ready", count: counts.ready },
  ];

  return (
    <>
      <div className="dash-hero">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <span className="sec-eyebrow">{t(locale, "dpp_hub_eyebrow")}</span>
          <h2>{t(locale, "dpp_hub_h2")}</h2>
          <p>{t(locale, editor ? "dpp_hub_p" : "dpp_hub_p_readonly")}</p>
        </div>
      </div>

      <div className="admin-stats dash-kpis">
        <div className="stat stat-light">
          <span className="num">{n(ideas.length)}</span>
          <span className="lbl">{t(locale, "dpp_kpi_selected")}</span>
        </div>
        <div className={`stat stat-light${editor && counts.none > 0 ? " stat-accent" : ""}`}>
          <span className="num">{n(counts.none)}</span>
          <span className="lbl">{t(locale, "dpp_kpi_waiting")}</span>
        </div>
        <div className="stat stat-light">
          <span className="num">{n(counts.draft)}</span>
          <span className="lbl">{t(locale, "dpp_kpi_draft")}</span>
        </div>
        <div className="stat stat-light">
          <span className="num">{n(counts.ready)}</span>
          <span className="lbl">{t(locale, "dpp_kpi_ready")}</span>
        </div>
      </div>

      <div className="dash-panel">
        <nav className="dpp-tabs" aria-label={t(locale, "nav_dpp")}>
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "all" ? basePath : `${basePath}?f=${tab.key}`}
              className={filter === tab.key ? "active" : ""}
              aria-current={filter === tab.key ? "page" : undefined}
            >
              {t(locale, tab.label)} <span>{n(tab.count)}</span>
            </Link>
          ))}
        </nav>

        {shown.length === 0 ? (
          <div className="dash-empty">{t(locale, "dpp_hub_empty")}</div>
        ) : (
          <ul className="dash-list">
            {shown.map((idea) => {
              const status = idea.dpp?.status ?? null;
              const cost = idea.dpp ? costTotal((idea.dpp.costItems as DppCostItem[] | null) ?? []) : 0;
              const [cta, cls] = !editor
                ? (["dpp_view", "btn-outline"] as const)
                : !status
                  ? (["dpp_start", "btn-gold"] as const)
                  : status === "DRAFT"
                    ? (["dpp_continue", "btn-green"] as const)
                    : (["dpp_view", "btn-outline"] as const);
              return (
                <li className="dash-item" key={idea.id}>
                  <div className="dash-item-main">
                    <div className="dash-item-top">
                      <span className="c-docket">{idea.docket}</span>
                      <DppStatusBadge status={status} locale={locale} />
                    </div>
                    <Link className="dash-item-title" href={`${basePath}/${idea.id}`}>
                      {idea.title}
                    </Link>
                    <div className="dash-item-meta">
                      <Icon name="pin" size={13} /> {ideaLocationLabel(idea.upazila, idea.district, locale)} ·{" "}
                      {categoryLabel(idea.category, locale)}
                      {idea.dpp && (
                        <>
                          {" · "}
                          {cost > 0 && `৳ ${formatLakh(cost, locale)} ${t(locale, "dpp_lakh")} · `}
                          {timeAgo(idea.dpp.updatedAt.toISOString(), locale)}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="dash-item-actions">
                    {(editor || status) && (
                      <Link className={`btn ${cls} btn-sm`} href={`${basePath}/${idea.id}`}>
                        {t(locale, cta)}
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
