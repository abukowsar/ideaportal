import { t } from "./dict";
import { formatNumber } from "./vocab";
import type { Locale } from "./locale";

export function timeAgo(iso: string, locale: Locale): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return t(locale, "today");
  if (days === 1) return t(locale, "yesterday");
  if (days < 30) return t(locale, "days_ago").replace("{n}", formatNumber(days, locale));
  return t(locale, "months_ago").replace("{n}", formatNumber(Math.floor(days / 30), locale));
}

export function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
