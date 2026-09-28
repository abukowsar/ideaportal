import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import LoginForm from "./LoginForm";
import Icon, { type IconName } from "@/components/Icon";
import { getLocale } from "@/lib/i18n/locale";
import { t, type DictKey } from "@/lib/i18n/dict";

const FEATURES: { key: DictKey; icon: IconName }[] = [
  { key: "login_feat1", icon: "clipboardCheck" },
  { key: "login_feat2", icon: "fileText" },
  { key: "login_feat3", icon: "chart" },
];

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  const locale = await getLocale();

  return (
    <div className="auth-wrap">
      <div className="wrap">
        <div className="auth-shell">
          <aside className="auth-panel">
            <span className="sec-eyebrow">{t(locale, "login_panel_eyebrow")}</span>
            <h2>{t(locale, "login_panel_h")}</h2>
            <ul className="auth-features">
              {FEATURES.map((f) => (
                <li key={f.key}>
                  <span className="auth-feature-ic" aria-hidden="true">
                    <Icon name={f.icon} size={18} />
                  </span>
                  {t(locale, f.key)}
                </li>
              ))}
            </ul>
            <p className="auth-secure">
              <Icon name="shieldCheck" size={16} /> {t(locale, "login_secure_note")}
            </p>
          </aside>

          <div className="auth-card">
            <div className="auth-card-head">
              <span className="icon-tile" aria-hidden="true">
                <Icon name="lock" size={22} />
              </span>
              <div>
                <h1>{t(locale, "login_h2")}</h1>
                <p className="lede-sm">{t(locale, "login_p")}</p>
              </div>
            </div>
            <LoginForm locale={locale} />
            <div className="auth-hint">
              <Icon name="info" size={16} />
              <div>
                <b>{t(locale, "login_hint_label")}</b> hq {t(locale, "login_hint_hq")} · district-cumilla,
                district-dhaka {t(locale, "login_hint_etc")} {t(locale, "login_hint_district")} · upazila-raipur,
                upazila-patiya {t(locale, "login_hint_etc")} {t(locale, "login_hint_upazila")}
                <br />
                {t(locale, "login_hint_password_label")} <b>demo1234</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
