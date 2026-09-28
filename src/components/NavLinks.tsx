"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SiteLink = { href: string; label: string };

/** Primary site navigation with the current page highlighted. */
export default function NavLinks({ links, label }: { links: SiteLink[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label={label}>
      {links.map((l) => {
        const active = !l.href.includes("#") && (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href));
        return (
          <Link key={l.href} href={l.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
