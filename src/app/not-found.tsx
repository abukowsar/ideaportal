import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <main className="nf">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="DoICT" className="nf-logo" />
      <div className="nf-code mono">404</div>
      <h1>{t(locale, "nf_title")}</h1>
      <p>{t(locale, "nf_p")}</p>
      <Link className="btn btn-green" href="/">
        {t(locale, "back_to_home")}
      </Link>
    </main>
  );
}
