import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t, type DictKey } from "@/lib/i18n/dict";
import { formatNumber, statusLabel, districtLabel, roleLabel } from "@/lib/i18n/vocab";
import { scopeWhere, toIdeaView } from "@/lib/ideaView";
import type { IdeaStatus, Viewer } from "@/lib/ideaFormat";
import type { Prisma } from "@prisma/client";
import DashboardList from "./DashboardList";
import Icon from "@/components/Icon";

const PIPELINE: IdeaStatus[] = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"];
const withSubmitter = { submittedBy: { select: { name: true } }, dpp: { select: { status: true } } } as const;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { user } = session;
  if (user.role === "ADMIN") redirect("/admin");

  const locale = await getLocale();
  const where = scopeWhere(user);
  const viewer: Viewer = { role: user.role, district: user.district };

  // Primary list = what this role acts on; secondary = context worth keeping an eye on.
  let primaryWhere: Prisma.IdeaWhereInput;
  let secondaryWhere: Prisma.IdeaWhereInput | null;
  let primaryTitle: DictKey;
  let primaryEmpty: DictKey;
  if (user.role === "UPAZILA") {
    primaryWhere = where;
    secondaryWhere = null;
    primaryTitle = "dash_mine_title";
    primaryEmpty = "dash_mine_empty";
  } else if (user.role === "DISTRICT") {
    primaryWhere = { ...where, status: { in: ["UPAZILA", "DISTRICT"] } };
    secondaryWhere = { ...where, status: { in: ["HQ", "SELECTED"] } };
    primaryTitle = "dash_queue_title";
    primaryEmpty = "dash_queue_empty";
  } else {
    primaryWhere = { status: "HQ" };
    secondaryWhere = { status: "SELECTED" };
    primaryTitle = "dash_queue_title";
    primaryEmpty = "dash_queue_empty";
  }

  const [statusGroups, dppGroups, primary, secondary, upazilaRows, districtRows] = await Promise.all([
    prisma.idea.groupBy({ by: ["status"], where, _count: true }),
    prisma.dpp.groupBy({ by: ["status"], where: { idea: { ...where, status: "SELECTED" } }, _count: true }),
    prisma.idea.findMany({ where: primaryWhere, orderBy: { updatedAt: "desc" }, include: withSubmitter }),
    secondaryWhere
      ? prisma.idea.findMany({ where: secondaryWhere, orderBy: { updatedAt: "desc" }, take: 8, include: withSubmitter })
      : Promise.resolve([]),
    user.role === "DISTRICT"
      ? prisma.idea.findMany({ where, distinct: ["upazila"], select: { upazila: true } })
      : Promise.resolve([]),
    user.role === "HQ" ? prisma.idea.findMany({ distinct: ["district"], select: { district: true } }) : Promise.resolve([]),
  ]);

  const count = (s: IdeaStatus) => statusGroups.find((g) => g.status === s)?._count ?? 0;
  const total = statusGroups.reduce((sum, g) => sum + g._count, 0);
  const n = (v: number) => formatNumber(v, locale);
  const dppReady = dppGroups.find((g) => g.status === "READY")?._count ?? 0;
  const dppStarted = dppGroups.reduce((sum, g) => sum + g._count, 0);
  const dppWaiting = count("SELECTED") - dppReady; // not started + drafts

  const kpis: { label: string; value: string; accent?: boolean }[] =
    user.role === "UPAZILA"
      ? [
          { label: t(locale, "dash_kpi_mine"), value: n(total) },
          { label: t(locale, "dash_kpi_in_progress"), value: n(count("UPAZILA") + count("DISTRICT")) },
          { label: t(locale, "stat_hq"), value: n(count("HQ")) },
          { label: t(locale, "stat_selected"), value: n(count("SELECTED")) },
        ]
      : user.role === "DISTRICT"
        ? [
            { label: t(locale, "dash_kpi_district"), value: n(total) },
            { label: t(locale, "dash_kpi_pending"), value: n(primary.length), accent: true },
            { label: t(locale, "stat_hq"), value: n(count("HQ")) },
            { label: t(locale, "stat_selected"), value: n(count("SELECTED")) },
            { label: t(locale, "dash_kpi_upazilas"), value: n(upazilaRows.filter((r) => r.upazila).length) },
          ]
        : [
            { label: t(locale, "stat_total"), value: n(total) },
            { label: t(locale, "dash_kpi_pending"), value: n(primary.length), accent: true },
            { label: t(locale, "stat_selected"), value: n(count("SELECTED")) },
            { label: t(locale, "dpp_kpi_waiting"), value: n(dppWaiting), accent: dppWaiting > 0 },
            { label: t(locale, "dpp_kpi_ready"), value: n(dppReady) },
            { label: t(locale, "stat_districts"), value: n(districtRows.length) },
          ];

  const subtitle =
    user.role === "UPAZILA"
      ? t(locale, "dash_sub_upazila")
      : user.role === "DISTRICT"
        ? t(locale, "dash_sub_district").replace("{district}", districtLabel(user.district ?? "", locale))
        : t(locale, "dash_sub_hq");

  const canSubmit = user.role === "UPAZILA" || user.role === "DISTRICT";

  return (
    <>
      <div className="dash-hero">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <span className="sec-eyebrow">
            {t(locale, "dash_eyebrow")} · {roleLabel(user.role, locale)}
          </span>
          <h2>{t(locale, "dash_welcome").replace("{name}", user.name ?? user.username)}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="dash-hero-actions">
          {canSubmit && (
            <Link className="btn btn-green btn-sm" href="/submit">
              <Icon name="filePlus" size={16} />
              {t(locale, "dash_new_proposal")}
            </Link>
          )}
          <a className="btn btn-outline btn-sm" href="/api/export/ideas">
            <Icon name="download" size={16} />
            {t(locale, "export_csv")}
          </a>
        </div>
      </div>

      <div className="admin-stats dash-kpis">
        {kpis.map((k) => (
          <div className={`stat stat-light${k.accent ? " stat-accent" : ""}`} key={k.label}>
            <span className="num">{k.value}</span>
            <span className="lbl">{k.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <h3>{t(locale, "dash_pipeline_title")}</h3>
        </div>
        <div className="dash-pipeline">
          {PIPELINE.map((s) => {
            const c = count(s);
            return (
              <div className={`dash-stage st-${s.toLowerCase()}`} key={s} style={{ flexGrow: Math.max(c, 1) }}>
                <b>{n(c)}</b>
                <span>{statusLabel(s, locale)}</span>
              </div>
            );
          })}
          <Link className="dash-stage st-dpp" href="/dpp" style={{ flexGrow: Math.max(dppReady, 1) }}>
            <b>{n(dppReady)}</b>
            <span>
              {t(locale, "dpp_status_ready")}
              {dppStarted > dppReady && ` · ${t(locale, "dpp_kpi_draft")} ${n(dppStarted - dppReady)}`}
            </span>
          </Link>
        </div>
      </div>

      <div className={`dash-grid${secondaryWhere ? "" : " single"}`}>
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>{t(locale, primaryTitle)}</h3>
            <span className="kanban-count">{n(primary.length)}</span>
          </div>
          <DashboardList
            ideas={primary.map(toIdeaView)}
            viewer={viewer}
            locale={locale}
            emptyText={t(locale, primaryEmpty)}
          />
        </div>

        {secondaryWhere && (
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>{t(locale, user.role === "HQ" ? "dash_selected_title" : "dash_forwarded_title")}</h3>
              <span className="kanban-count">{n(secondary.length)}</span>
            </div>
            <DashboardList
              ideas={secondary.map(toIdeaView)}
              viewer={viewer}
              locale={locale}
              emptyText={t(locale, user.role === "HQ" ? "dash_selected_empty" : "dash_forwarded_empty")}
            />
          </div>
        )}
      </div>
    </>
  );
}
