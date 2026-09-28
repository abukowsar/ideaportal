import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { MATURITY_KEYS, maturityLabel, maturityLevel, type MaturityKey } from "@/lib/tech";

/** Four-segment readiness meter: concept → prototype → pilot → ready to scale. */
export default function MaturityMeter({
  value,
  locale,
  compact = false,
}: {
  value: MaturityKey;
  locale: Locale;
  compact?: boolean;
}) {
  const level = maturityLevel(value);
  return (
    <div
      className={`maturity${compact ? " is-compact" : ""} lv-${level}`}
      role="img"
      aria-label={`${t(locale, "maturity_label")}: ${maturityLabel(value, locale)} (${level}/4)`}
    >
      <div className="maturity-bar" aria-hidden="true">
        {MATURITY_KEYS.map((k, i) => (
          <span key={k} className={i < level ? "on" : undefined} />
        ))}
      </div>
      <span className="maturity-text">{maturityLabel(value, locale)}</span>
    </div>
  );
}
