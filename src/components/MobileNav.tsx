"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";

export default function MobileNav({
  links,
  label,
  children,
}: {
  links: { href: string; label: string }[];
  label: string;
  /** Extra controls shown at the bottom of the panel (e.g. the language switch on phones). */
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={open ? "x" : "menu"} size={20} />
      </button>
      {open && (
        <nav className="mobile-nav-panel" aria-label={label}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
              <Icon name="chevronRight" size={16} />
            </Link>
          ))}
          {children && <div className="mobile-nav-extra">{children}</div>}
        </nav>
      )}
    </div>
  );
}
