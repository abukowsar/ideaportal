import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_META } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { formatNumber, statusLabel } from "@/lib/i18n/vocab";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import AdminLogin from "./AdminLogin";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import type { NavGroup, SidebarStat } from "@/components/workspace/WorkspaceSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session?.user) {
    return <AdminLogin locale={locale} />;
  }
  if (session.user.role !== "ADMIN") {
    return <>{children}</>;
  }


  const [pendingIdeas, userCount, dppReady] = await Promise.all([
    prisma.idea.groupBy({ by: ["status"], _count: true }),
    prisma.user.count(),
    prisma.dpp.count({ where: { status: "READY", idea: { status: "SELECTED" } } }),
  ]);

  const stats: SidebarStat[] = (["UPAZILA", "DISTRICT", "HQ", "SELECTED"] as const).map((status) => ({
    label: statusLabel(status, locale),
    count: formatNumber(pendingIdeas.find((p) => p.status === status)?._count ?? 0, locale),
    cls: STATUS_META[status].cls,
  }));
  stats.push({ label: t(locale, "dpp_status_ready"), count: formatNumber(dppReady, locale), cls: "st-dpp" });
  stats.push({ label: t(locale, "admin_total_users"), count: formatNumber(userCount, locale) });

  const groups: NavGroup[] = [
    {
      title: t(locale, "ws_nav_main"),
      items: [
        { href: "/admin", label: t(locale, "admin_nav_action_center"), icon: "zap", exact: true },
        { href: "/admin/analytics", label: t(locale, "admin_nav_analytics"), icon: "chart" },
        { href: "/admin/ideas", label: t(locale, "admin_nav_ideas"), icon: "folder" },
        { href: "/admin/dpp", label: t(locale, "nav_dpp"), icon: "fileText" },
        { href: "/admin/users", label: t(locale, "admin_nav_users"), icon: "users" },
      ],
    },
    {
      title: t(locale, "ws_nav_tools"),
      items: [
        { href: "/api/export/ideas", label: t(locale, "ws_export"), icon: "download", external: "download" },
        { href: "/repo", label: t(locale, "ws_public_repo"), icon: "globe" },
      ],
    },
  ];

  return (
    <>
      <WorkspaceHeader
        userName={session.user.name ?? session.user.username}
        subline={session.user.username}
        badge="ADMIN"
        brandHref="/admin"
        locale={locale}
      />
      <section id="admin-shell">
        <WorkspaceShell
          eyebrow={t(locale, "admin_eyebrow")}
          title={t(locale, "admin_control_room")}
          groups={groups}
          statsTitle={t(locale, "admin_pending_actions")}
          stats={stats}
          locale={locale}
        >
          {children}
        </WorkspaceShell>
      </section>
    </>
  );
}
