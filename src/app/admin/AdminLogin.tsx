import Link from "next/link";
import LoginForm from "@/app/(site)/login/LoginForm";
import LanguageSwitch from "@/components/LanguageSwitch";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";

/** Dedicated sign-in screen served at /admin (and any /admin/* page) when nobody is signed in. */
export default function AdminLogin({ locale }: { locale: Locale }) {
  return (
    <div className="admin-login">
      <div className="admin-login-top">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="brand-mark" />
          <div className="brand-name">
            <b>{t(locale, "brand_name")}</b>
            <small>{t(locale, "brand_tagline")}</small>
          </div>
        </Link>
        <LanguageSwitch current={locale} />
      </div>

      <main className="admin-login-card">
        <div className="admin-login-head">
          <span className="icon-tile" aria-hidden="true">
            <Icon name="shieldCheck" size={24} />
          </span>
          <span className="admin-login-badge">ADMIN</span>
          <h1>{t(locale, "admin_login_h")}</h1>
          <p>{t(locale, "admin_login_p")}</p>
        </div>
        <LoginForm locale={locale} adminOnly />
        <div className="admin-login-links">
          <Link href="/login">
            <Icon name="user" size={15} /> {t(locale, "admin_login_officer_link")}
          </Link>
          <Link href="/">
            {t(locale, "back_to_home")}
          </Link>
        </div>
      </main>

      <p className="admin-login-foot">
        <Icon name="lock" size={14} /> {t(locale, "login_secure_note")}
      </p>
    </div>
  );
}
