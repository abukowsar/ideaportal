import { cookies } from "next/headers";

export type Locale = "bn" | "en";

export const LOCALE_COOKIE = "doict_locale";
export const DEFAULT_LOCALE: Locale = "bn";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LOCALE;
}
