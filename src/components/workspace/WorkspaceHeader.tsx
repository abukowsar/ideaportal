import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitch from "@/components/LanguageSwitch";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";

export default function WorkspaceHeader({
  userName,
  subline,
  badge,
  brandHref,
  locale,
}: {
  userName: string;
  subline: string;
  badge: string;
  brandHref: string;
  locale: Locale;
}) {
  return (
    <header className="admin-topbar">
      <div className="wrap header-in">
        <div className="admin-topbar-left">
          <Link href="/" className="admin-topbar-close" aria-label={t(locale, "admin_close_aria")}>
            <Icon name="x" size={16} />
          </Link>
          <Link href={brandHref} className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="brand-mark" />
            <div className="brand-name">
              <b>{t(locale, "brand_name")}</b>
              <small>{t(locale, "brand_tagline")}</small>
            </div>
          </Link>
          <span className="admin-topbar-badge">
            <Icon name="shieldCheck" size={13} /> {badge}
          </span>
        </div>

        <div className="header-actions">
          <Link href="/" className="admin-topbar-home">
            <Icon name="home" size={16} /> {t(locale, "admin_home")}
          </Link>
          <LanguageSwitch current={locale} />
          <div className="admin-topbar-user">
            <span className="admin-topbar-avatar" aria-hidden="true">
              <Icon name="user" size={17} />
            </span>
            <div className="admin-topbar-user-meta">
              <b>{userName}</b>
              <small>{subline}</small>
            </div>
          </div>
          <LogoutButton locale={locale} redirectTo={brandHref === "/admin" ? "/admin" : "/login"} />
        </div>
      </div>
    </header>
  );
}
