import Icon from "@/components/Icon";
import type { Locale } from "@/lib/i18n/locale";
import { formatNumber } from "@/lib/i18n/vocab";
import { TECH, techLabel, type TechKey } from "@/lib/tech";

/** Technology chips for an idea; `max` collapses the rest into a "+n" chip. */
export default function TechTags({ tags, locale, max }: { tags: TechKey[]; locale: Locale; max?: number }) {
  if (tags.length === 0) return null;
  const shown = max ? tags.slice(0, max) : tags;
  const rest = tags.length - shown.length;
  return (
    <ul className="tech-tags">
      {shown.map((k) => (
        <li key={k} className="tech-tag">
          <Icon name={TECH[k].icon} size={13} />
          {techLabel(k, locale)}
        </li>
      ))}
      {rest > 0 && <li className="tech-tag tech-tag-more">+{formatNumber(rest, locale)}</li>}
    </ul>
  );
}
