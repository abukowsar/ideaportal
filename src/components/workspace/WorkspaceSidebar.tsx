"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import Icon, { type IconName } from "@/components/Icon";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  exact?: boolean;
  /** Plain link that leaves the SPA: a file download or a new tab. */
  external?: "download" | "newTab";
};
export type NavGroup = { title: string; items: NavItem[] };
export type SidebarStat = { label: string; count: string; cls?: string };

export default function WorkspaceSidebar({
  eyebrow,
  title,
  groups,
  statsTitle,
  stats,
  locale,
  collapsed,
  onToggle,
}: {
  eyebrow: string;
  title: string;
  groups: NavGroup[];
  statsTitle: string;
  stats: SidebarStat[];
  locale: Locale;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar${collapsed ? " collapsed" : ""}`}>
      <button
        type="button"
        className="admin-sidebar-toggle"
        onClick={onToggle}
        aria-label={t(locale, collapsed ? "sidebar_expand" : "sidebar_collapse")}
        title={t(locale, collapsed ? "sidebar_expand" : "sidebar_collapse")}
      >
        <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={16} />
      </button>

      {!collapsed && (
        <div className="admin-sidebar-head">
          <span className="sec-eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
      )}

      {groups.map((group) => (
        <div className="ws-nav-group" key={group.title}>
          {!collapsed && <span className="admin-sidebar-label">{group.title}</span>}
          <nav className="admin-nav" aria-label={group.title}>
            {group.items.map((item) => {
              const active =
                !item.external && (item.exact ? pathname === item.href : pathname.startsWith(item.href));
              const className = `admin-nav-link${active ? " active" : ""}`;
              const tip = collapsed ? item.label : undefined;
              const content = (
                <>
                  <Icon name={item.icon} size={18} className="admin-nav-ic" />
                  {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                  {!collapsed && item.external && <Icon name={item.external === "download" ? "download" : "external"} size={14} className="admin-nav-ext" />}
                </>
              );
              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={className}
                    title={tip}
                    aria-label={collapsed ? item.label : undefined}
                    target={item.external === "newTab" ? "_blank" : undefined}
                    rel={item.external === "newTab" ? "noreferrer" : undefined}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={className}
                  title={tip}
                  aria-label={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      {!collapsed && stats.length > 0 && (
        <div className="admin-sidebar-stats">
          <span className="admin-sidebar-label">{statsTitle}</span>
          {stats.map((s) => (
            <div className={`admin-mini-stat${s.cls ? ` ${s.cls}` : ""}`} key={s.label}>
              <span>{s.label}</span>
              <b>{s.count}</b>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
