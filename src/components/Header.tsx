import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import MobileNav from "@/components/MobileNav";
import NavLinks, { type SiteLink } from "@/components/NavLinks";
import LanguageSwitch from "@/components/LanguageSwitch";
import Icon from "@/components/Icon";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { roleLabel, districtLabel } from "@/lib/i18n/vocab";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const user = session?.user;

  const links: SiteLink[] = [
    { href: "/", label: t(locale, "nav_home") },
    { href: "/#flow", label: t(locale, "nav_how") },
    { href: "/repo", label: t(locale, "nav_repo") },
  ];
  const workspaceHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const mobileLinks: SiteLink[] = user
    ? [...links, { href: workspaceHref, label: t(locale, "nav_workspace") }]
    : [...links, { href: "/login", label: t(locale, "btn_official_login") }];

  return (
    <header className="site-header">
      <div className="wrap header-in">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="brand-mark" />
          <div className="brand-name">
            <b>{t(locale, "brand_name")}</b>
            <small>{t(locale, "brand_tagline")}</small>
          </div>
        </Link>

        <NavLinks links={links} label={t(locale, "nav_aria")} />

        <div className="header-actions">
          <LanguageSwitch current={locale} />
          {user ? (
            <>
              <Link className="btn btn-green btn-sm header-cta" href={workspaceHref}>
                <Icon name="dashboard" size={16} />
                <span>{t(locale, "nav_workspace")}</span>
              </Link>
              <div className="user-chip" title={user.name ?? ""}>
                <span className="user-avatar" aria-hidden="true">
                  <Icon name="user" size={16} />
                </span>
                <span className="user-chip-text">
                  <b>{user.name}</b>
                  <span className="role-tag">
                    {roleLabel(user.role, locale)}
                    {user.district ? ` · ${districtLabel(user.district, locale)}` : ""}
                  </span>
                </span>
              </div>
              <LogoutButton locale={locale} redirectTo={user.role === "ADMIN" ? "/admin" : "/login"} />
            </>
          ) : (
            <Link className="btn btn-green btn-sm header-cta" href="/login">
              <Icon name="login" size={16} />
              <span>{t(locale, "btn_official_login")}</span>
            </Link>
          )}
          <MobileNav links={mobileLinks} label={t(locale, "menu_toggle")}>
            <LanguageSwitch current={locale} />
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
