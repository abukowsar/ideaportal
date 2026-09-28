import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { statusLabel, categoryLabel, districtLabel, formatNumber } from "@/lib/i18n/vocab";
import Charts, { type BarDatum, type TrendPoint } from "./Charts";

const STATUS_COLOR: Record<string, string> = {
  UPAZILA: "#0b7a53",
  DISTRICT: "#c98420",
  HQ: "#2a78d6",
  SELECTED: "#c94f2e",
};

const STATUS_ORDER = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"] as const;

const MONTH_LABEL_BN = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"];
const MONTH_LABEL_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // admin layout shows the sign-in form
  const locale = await getLocale();
  const MONTH_LABEL = locale === "bn" ? MONTH_LABEL_BN : MONTH_LABEL_EN;

  if (session.user.role !== "ADMIN") {
    return (
      <section className="form-band">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-eyebrow">{t(locale, "restricted_area")}</span>
            <h2>{t(locale, "analytics_h2")}</h2>
          </div>
          <div className="restricted">{t(locale, "admin_restricted")}</div>
          <p style={{ marginTop: "16px" }}>
            <Link className="btn btn-outline btn-sm" href="/">
              {t(locale, "back_to_home")}
            </Link>
          </p>
        </div>
      </section>
    );
  }

  const [statusGroups, districtGroups, categoryGroups, ideas] = await Promise.all([
    prisma.idea.groupBy({ by: ["status"], _count: true }),
    prisma.idea.groupBy({ by: ["district"], _count: true }),
    prisma.idea.groupBy({ by: ["category"], _count: true }),
    prisma.idea.findMany({ select: { createdAt: true } }),
  ]);

  const total = statusGroups.reduce((sum, g) => sum + g._count, 0);

  const statusData: BarDatum[] = STATUS_ORDER.map((status) => {
    const found = statusGroups.find((g) => g.status === status);
    return { label: statusLabel(status, locale), value: found?._count ?? 0, color: STATUS_COLOR[status] };
  });

  const districtData: BarDatum[] = districtGroups
    .map((g) => ({ label: districtLabel(g.district, locale), value: g._count, color: "#0b7a53" }))
    .sort((a, b) => b.value - a.value);

  const categoryData: BarDatum[] = categoryGroups
    .map((g) => ({ label: categoryLabel(g.category, locale), value: g._count, color: "#2a78d6" }))
    .sort((a, b) => b.value - a.value);

  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABEL[d.getMonth()] });
  }
  const monthCounts = new Map(months.map((m) => [m.key, 0]));
  for (const idea of ideas) {
    const d = new Date(idea.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (monthCounts.has(key)) monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  }
  const trendData: TrendPoint[] = months.map((m) => ({ label: m.label, value: monthCounts.get(m.key) ?? 0 }));

  return (
    <>
      <div className="sec-head">
        <span className="sec-eyebrow">{t(locale, "admin_panel_eyebrow")}</span>
        <h2>{t(locale, "analytics_h2")}</h2>
        <p>{t(locale, "analytics_p").replace("{total}", formatNumber(total, locale))}</p>
      </div>
      <Charts status={statusData} district={districtData} category={categoryData} trend={trendData} locale={locale} />
    </>
  );
}
