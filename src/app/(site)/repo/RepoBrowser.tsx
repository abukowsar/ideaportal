"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { statusLabel, categoryLabel, districtLabel, ideaLocationLabel, formatNumber } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import type { IdeaStatus, IdeaView, Viewer } from "@/lib/ideaFormat";
import { actionLabelFor, dppLinkFor } from "@/lib/ideaActions";
import { MATURITY_KEYS, TECH, TECH_KEYS, maturityLabel, maturityLevel, techLabel, type TechKey } from "@/lib/tech";
import StatusBadge from "@/components/StatusBadge";
import IdeaModal from "@/components/IdeaModal";
import TechTags from "@/components/TechTags";
import MaturityMeter from "@/components/MaturityMeter";
import Icon from "@/components/Icon";
import { advanceStatus } from "./actions";

const STATUSES: IdeaStatus[] = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"];
type Sort = "newest" | "advanced" | "title";

export default function RepoBrowser({
  ideas: initialIdeas,
  districts,
  viewer,
  locale,
  initialTech,
}: {
  ideas: IdeaView[];
  districts: string[];
  viewer: Viewer;
  locale: Locale;
  initialTech: TechKey | null;
}) {
  const router = useRouter();
  const [ideas, setIdeas] = useState(initialIdeas);
  const [q, setQ] = useState("");
  const [filterDist, setFilterDist] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTech, setFilterTech] = useState<TechKey | "">(initialTech ?? "");
  const [filterMaturity, setFilterMaturity] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const n = (v: number) => formatNumber(v, locale);

  // Only offer technologies that at least one idea actually uses.
  const techCounts = useMemo(() => {
    const counts = new Map<TechKey, number>();
    for (const idea of ideas) for (const k of idea.techTags) counts.set(k, (counts.get(k) ?? 0) + 1);
    return TECH_KEYS.filter((k) => counts.has(k)).map((k) => ({ key: k, count: counts.get(k)! }));
  }, [ideas]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = ideas.filter((x) => {
      if (filterDist && x.district !== filterDist) return false;
      if (filterStatus && x.status !== filterStatus) return false;
      if (filterTech && !x.techTags.includes(filterTech)) return false;
      if (filterMaturity && x.maturity !== filterMaturity) return false;
      if (query && !(x.title + " " + x.concept + " " + x.docket).toLowerCase().includes(query)) return false;
      return true;
    });
    if (sort === "advanced") {
      const statusRank = (s: IdeaStatus) => STATUSES.indexOf(s);
      list.sort(
        (a, b) => maturityLevel(b.maturity) - maturityLevel(a.maturity) || statusRank(b.status) - statusRank(a.status)
      );
    } else if (sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title, locale === "bn" ? "bn" : "en"));
    }
    return list;
  }, [ideas, q, filterDist, filterStatus, filterTech, filterMaturity, sort, locale]);

  const hasFilters = Boolean(q || filterDist || filterStatus || filterTech || filterMaturity);
  const openIdea = ideas.find((x) => x.id === openId) ?? null;
  const closeModal = useCallback(() => setOpenId(null), []);

  function clearFilters() {
    setQ("");
    setFilterDist("");
    setFilterStatus("");
    setFilterTech("");
    setFilterMaturity("");
  }

  async function handleAdvance() {
    if (!openIdea) return;
    setActionLoading(true);
    setActionError("");
    const result = await advanceStatus(openIdea.id);
    setActionLoading(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    const nextStatus = result.status;
    if (nextStatus === "SELECTED") {
      router.push(`/dpp/${openIdea.id}?selected=1`);
      return;
    }
    setIdeas((prev) => prev.map((x) => (x.id === openIdea.id ? { ...x, status: nextStatus } : x)));
    router.refresh();
  }

  return (
    <>
      <div className="repo-toolbar">
        <div className="repo-search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder={t(locale, "repo_search_placeholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t(locale, "repo_search_placeholder")}
          />
        </div>
        <select value={filterDist} onChange={(e) => setFilterDist(e.target.value)} aria-label={t(locale, "filter_all_districts")}>
          <option value="">{t(locale, "filter_all_districts")}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {districtLabel(d, locale)}
            </option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label={t(locale, "filter_all_statuses")}>
          <option value="">{t(locale, "filter_all_statuses")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s, locale)}
            </option>
          ))}
        </select>
        <select
          value={filterMaturity}
          onChange={(e) => setFilterMaturity(e.target.value)}
          aria-label={t(locale, "filter_all_maturity")}
        >
          <option value="">{t(locale, "filter_all_maturity")}</option>
          {MATURITY_KEYS.map((m) => (
            <option key={m} value={m}>
              {maturityLabel(m, locale)}
            </option>
          ))}
        </select>
      </div>

      <div className="tech-filter" role="group" aria-label={t(locale, "tech_label")}>
        <button type="button" className={filterTech === "" ? "on" : ""} onClick={() => setFilterTech("")}>
          <Icon name="layers" size={15} />
          {t(locale, "filter_all_tech")}
        </button>
        {techCounts.map(({ key, count }) => (
          <button
            type="button"
            key={key}
            className={filterTech === key ? "on" : ""}
            aria-pressed={filterTech === key}
            onClick={() => setFilterTech(filterTech === key ? "" : key)}
          >
            <Icon name={TECH[key].icon} size={15} />
            {techLabel(key, locale)}
            <span>{n(count)}</span>
          </button>
        ))}
      </div>

      <div className="repo-resultbar">
        <span className="repo-count">
          <b>{t(locale, "repo_result_count").replace("{n}", n(filtered.length))}</b>
          {hasFilters && (
            <button type="button" className="repo-clear" onClick={clearFilters}>
              <Icon name="x" size={13} /> {t(locale, "repo_clear_filters")}
            </button>
          )}
        </span>
        <span className="repo-right">
          <span className="ro-strip">
            <Icon name="lock" size={13} /> {t(locale, "ro_strip")}
          </span>
          <label className="repo-sort">
            <Icon name="filter" size={14} />
            <span className="sr-only">{t(locale, "sort_label")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="newest">{t(locale, "sort_newest")}</option>
              <option value="advanced">{t(locale, "sort_advanced")}</option>
              <option value="title">{t(locale, "sort_title")}</option>
            </select>
          </label>
        </span>
      </div>

      <div className="cards">
        {filtered.map((x) => (
          <button
            key={x.id}
            type="button"
            className="card idea-card"
            onClick={() => {
              setOpenId(x.id);
              setActionError("");
            }}
          >
            <div className="c-top">
              <span className="c-docket">{x.docket}</span>
              <StatusBadge status={x.status} locale={locale} />
            </div>
            <h3>{x.title}</h3>
            <p className="c-sum">{x.concept}</p>
            <TechTags tags={x.techTags} locale={locale} max={3} />
            <MaturityMeter value={x.maturity} locale={locale} compact />
            <div className="c-meta">
              <span>
                <Icon name="pin" size={14} /> {ideaLocationLabel(x.upazila, x.district, locale)}
              </span>
              <span>{categoryLabel(x.category, locale)}</span>
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty">{t(locale, "repo_empty")}</div>}

      {openIdea && (
        <IdeaModal
          idea={openIdea}
          locale={locale}
          onClose={closeModal}
          actionLabel={actionLabelFor(viewer, openIdea, locale)}
          onAction={handleAdvance}
          actionLoading={actionLoading}
          actionError={actionError}
          dpp={dppLinkFor(viewer, openIdea)}
        />
      )}
    </>
  );
}
