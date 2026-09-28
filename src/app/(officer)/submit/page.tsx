import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import SubmitForm from "./SubmitForm";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { districtLabel } from "@/lib/i18n/vocab";

export default async function SubmitPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { user } = session;
  const locale = await getLocale();

  if (user.role !== "UPAZILA" && user.role !== "DISTRICT") {
    return (
      <>
        <div className="sec-head">
          <span className="sec-eyebrow">{t(locale, "submit_eyebrow")}</span>
          <h2>{t(locale, "submit_restricted_h2")}</h2>
        </div>
        <div className="restricted">
          {t(locale, "submit_restricted_pre")}
          <a href="/repo" style={{ color: "var(--green)", fontWeight: 600 }}>
            {t(locale, "submit_restricted_link")}
          </a>
          {t(locale, "submit_restricted_post")}
        </div>
      </>
    );
  }

  const isUpazila = user.role === "UPAZILA";

  return (
    <>
      <div className="sec-head">
        <span className="sec-eyebrow">{t(locale, isUpazila ? "submit_eyebrow" : "submit_eyebrow_district")}</span>
        <h2>{t(locale, "submit_h2")}</h2>
        <p>{t(locale, "submit_p")}</p>
      </div>
      <div className="dash-panel ws-form-card">
        <SubmitForm
          district={user.district ? districtLabel(user.district, locale) : ""}
          upazila={user.upazila ?? ""}
          name={user.name ?? ""}
          locale={locale}
          showUpazila={isUpazila}
        />
      </div>
    </>
  );
}
