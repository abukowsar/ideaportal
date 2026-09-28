import Link from "next/link";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import type { DppStatus } from "@/lib/dpp";
import Icon from "@/components/Icon";

/** Entry point into the DPP builder for a SELECTED idea; the label follows the DPP's progress. */
export default function DppAction({
  href,
  status,
  locale,
  canEdit = true,
}: {
  href: string;
  status: DppStatus | null;
  locale: Locale;
  canEdit?: boolean;
}) {
  if (!canEdit && !status) return null;
  const [key, cls] = !canEdit
    ? (["dpp_view", "btn-outline"] as const)
    : !status
      ? (["dpp_start", "btn-gold"] as const)
      : status === "DRAFT"
        ? (["dpp_continue", "btn-gold"] as const)
        : (["dpp_view", "btn-outline"] as const);
  return (
    <Link className={`btn ${cls} btn-sm`} href={href}>
      <Icon name="fileText" size={15} /> {t(locale, key)}
    </Link>
  );
}
