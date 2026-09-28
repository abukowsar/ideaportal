"use client";

import { useSyncExternalStore } from "react";
import WorkspaceSidebar, { type NavGroup, type SidebarStat } from "./WorkspaceSidebar";
import type { Locale } from "@/lib/i18n/locale";

const STORAGE_KEY = "doict_sidebar_collapsed";
const listeners = new Set<() => void>();
let memoryValue = false; // fallback when localStorage is unavailable (private mode, blocked storage)

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return memoryValue;
  }
}

function writeCollapsed(value: boolean) {
  memoryValue = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // per-viewer convenience only
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export default function WorkspaceShell({
  eyebrow,
  title,
  groups,
  statsTitle,
  stats,
  locale,
  children,
}: {
  eyebrow: string;
  title: string;
  groups: NavGroup[];
  statsTitle: string;
  stats: SidebarStat[];
  locale: Locale;
  children: React.ReactNode;
}) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);

  return (
    <div className={`wrap admin-shell${collapsed ? " collapsed" : ""}`}>
      <WorkspaceSidebar
        eyebrow={eyebrow}
        title={title}
        groups={groups}
        statsTitle={statsTitle}
        stats={stats}
        locale={locale}
        collapsed={collapsed}
        onToggle={() => writeCollapsed(!collapsed)}
      />
      <div className="admin-main">{children}</div>
    </div>
  );
}
