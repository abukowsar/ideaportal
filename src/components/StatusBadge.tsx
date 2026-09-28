import { STATUS_META } from "@/lib/bn";
import { statusLabel } from "@/lib/i18n/vocab";
import type { Locale } from "@/lib/i18n/locale";
import type { Status } from "@/generated/prisma/client";

export default function StatusBadge({ status, locale = "bn" }: { status: Status; locale?: Locale }) {
  const meta = STATUS_META[status];
  return <span className={`status ${meta.cls}`}>{statusLabel(status, locale)}</span>;
}
