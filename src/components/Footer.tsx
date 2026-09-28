import Link from "next/link";
import Icon from "@/components/Icon";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { formatNumber } from "@/lib/i18n/vocab";

export default async function Footer() {
  const locale = await getLocale();
  const year = formatNumber(new Date().getFullYear(), locale);
  const stages = ["flow_step1_h3", "flow_step2_h3", "flow_step3_h3", "flow_step4_h3"] as const;

  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <div className="foot-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" />
            <b>{t(locale, "brand_name")}</b>
          </div>
          <p>{t(locale, "footer_about")}</p>
          <p className="foot-gov">{t(locale, "footer_line1")}</p>
        </div>

        <div>
          <h4>{t(locale, "footer_quick")}</h4>
          <ul>
            <li>
              <Link href="/">{t(locale, "nav_home")}</Link>
            </li>
            <li>
              <Link href="/#flow">{t(locale, "nav_how")}</Link>
            </li>
            <li>
              <Link href="/repo">{t(locale, "nav_repo")}</Link>
            </li>
            <li>
              <Link href="/login">{t(locale, "btn_official_login")}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>{t(locale, "footer_process")}</h4>
          <ol className="foot-steps">
            {stages.map((k, i) => (
              <li key={k}>
                <span>{formatNumber(`0${i + 1}`, locale)}</span>
                {t(locale, k)}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4>{t(locale, "footer_resources")}</h4>
          <ul>
            <li>
              <a href="/innovationform.pdf" target="_blank" rel="noreferrer">
                <Icon name="fileText" size={15} /> {t(locale, "ws_official_format")}
              </a>
            </li>
            <li>
              <Link href="/repo">
                <Icon name="search" size={15} /> {t(locale, "ws_public_repo")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="wrap foot-bottom-in">
          <span>
            © {year} {t(locale, "footer_line1")} · {t(locale, "footer_rights")}
          </span>
          <span className="mono">DoICT · IDEA PORTAL</span>
        </div>
      </div>
    </footer>
  );
}
