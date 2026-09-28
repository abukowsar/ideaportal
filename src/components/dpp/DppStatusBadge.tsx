import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import type { DppStatus } from "@/lib/dpp";
import Icon from "@/components/Icon";

export default function DppStatusBadge({ status, locale }: { status: DppStatus | null; locale: Locale }) {
  const [cls, key] =
    status === "READY"
      ? (["dpp-ready", "dpp_status_ready"] as const)
      : status === "DRAFT"
        ? (["dpp-draft", "dpp_status_draft"] as const)
        : (["dpp-none", "dpp_status_none"] as const);
  return (
    <span className={`dpp-badge ${cls}`}>
      <Icon name={status === "READY" ? "checkCircle" : "fileText"} size={12} /> {t(locale, key)}
    </span>
  );
}
