import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_META } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { formatNumber, statusLabel, roleLabel, districtLabel } from "@/lib/i18n/vocab";
import { scopeWhere } from "@/lib/ideaView";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import type { NavGroup, SidebarStat } from "@/components/workspace/WorkspaceSidebar";

/** Workspace chrome for logged-in field officers (Upazila, District, HQ). */
export default async function OfficerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { user } = session;
  if (user.role === "ADMIN") redirect("/admin");

  const locale = await getLocale();
  const where = scopeWhere(user);
  const [counts, dppReady] = await Promise.all([
    prisma.idea.groupBy({ by: ["status"], where, _count: true }),
    prisma.dpp.count({ where: { status: "READY", idea: { ...where, status: "SELECTED" } } }),
  ]);

  const stats: SidebarStat[] = (["UPAZILA", "DISTRICT", "HQ", "SELECTED"] as const).map((status) => ({
    label: statusLabel(status, locale),
    count: formatNumber(counts.find((c) => c.status === status)?._count ?? 0, locale),
    cls: STATUS_META[status].cls,
  }));
  stats.push({ label: t(locale, "dpp_status_ready"), count: formatNumber(dppReady, locale), cls: "st-dpp" });

  const canSubmit = user.role === "UPAZILA" || user.role === "DISTRICT";
  const groups: NavGroup[] = [
    {
      title: t(locale, "ws_nav_main"),
      items: [
        { href: "/dashboard", label: t(locale, "nav_dashboard"), icon: "dashboard", exact: true },
        ...(canSubmit ? [{ href: "/submit", label: t(locale, "nav_submit"), icon: "filePlus" as const }] : []),
        { href: "/dpp", label: t(locale, "nav_dpp"), icon: "fileText" },
        { href: "/repo", label: t(locale, "nav_repo"), icon: "folder" },
      ],
    },
    {
      title: t(locale, "ws_nav_tools"),
      items: [
        { href: "/api/export/ideas", label: t(locale, "ws_export"), icon: "download", external: "download" },
        { href: "/innovationform.pdf", label: t(locale, "ws_official_format"), icon: "clipboardCheck", external: "newTab" },
      ],
    },
  ];

  const role = roleLabel(user.role, locale);
  const subline = user.district ? `${role} · ${districtLabel(user.district, locale)}` : role;

  return (
    <>
      <WorkspaceHeader
        userName={user.name ?? user.username}
        subline={subline}
        badge={role}
        brandHref="/dashboard"
        locale={locale}
      />
      <section id="admin-shell">
        <WorkspaceShell
          eyebrow={t(locale, "ws_officer_eyebrow")}
          title={t(locale, "ws_officer_title")}
          groups={groups}
          statsTitle={t(locale, "dash_pipeline_title")}
          stats={stats}
          locale={locale}
        >
          {children}
        </WorkspaceShell>
      </section>
    </>
  );
}
