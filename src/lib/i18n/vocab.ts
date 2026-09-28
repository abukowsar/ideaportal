import type { Role, Status } from "@prisma/client";
import type { Locale } from "./locale";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export function formatNumber(n: number | string, locale: Locale): string {
  return locale === "bn" ? toBn(n) : String(n);
}

/**
 * Canonical district names are stored in the DB in Bengali (as chosen at
 * submission/account-creation time). DISTRICTS/DIST_CODE stay Bengali-keyed;
 * districtLabel() maps to English for display only.
 */
export const DIST_CODE: Record<string, string> = {
  ঢাকা: "DHA",
  চট্টগ্রাম: "CTG",
  লক্ষ্মীপুর: "LAK",
  কুমিল্লা: "CUM",
  বগুড়া: "BOG",
  রাজশাহী: "RAJ",
  খুলনা: "KHU",
  সিলেট: "SYL",
  রংপুর: "RAN",
  বরিশাল: "BAR",
  ময়মনসিংহ: "MYM",
  কিশোরগঞ্জ: "KIS",
};

export const DISTRICTS = Object.keys(DIST_CODE);

const DISTRICT_EN: Record<string, string> = {
  ঢাকা: "Dhaka",
  চট্টগ্রাম: "Chattogram",
  লক্ষ্মীপুর: "Lakshmipur",
  কুমিল্লা: "Cumilla",
  বগুড়া: "Bogura",
  রাজশাহী: "Rajshahi",
  খুলনা: "Khulna",
  সিলেট: "Sylhet",
  রংপুর: "Rangpur",
  বরিশাল: "Barishal",
  ময়মনসিংহ: "Mymensingh",
  কিশোরগঞ্জ: "Kishoreganj",
};

export function districtLabel(district: string, locale: Locale): string {
  return locale === "bn" ? district : (DISTRICT_EN[district] ?? district);
}

/** Ideas submitted directly by a district office have no upazila. */
export function ideaLocationLabel(upazila: string | null, district: string, locale: Locale): string {
  return upazila ? `${upazila}, ${districtLabel(district, locale)}` : districtLabel(district, locale);
}

/** Canonical category values stored in the DB (Bengali). */
export const CATEGORIES = [
  "ডিজিটাল সেবা",
  "এআই ও ডেটা",
  "শিক্ষা ও দক্ষতা",
  "কৃষি ও পরিবেশ",
  "স্বাস্থ্যসেবা",
  "অবকাঠামো ও সংযোগ",
];

const CATEGORY_EN: Record<string, string> = {
  "ডিজিটাল সেবা": "Digital Services",
  "এআই ও ডেটা": "AI & Data",
  "শিক্ষা ও দক্ষতা": "Education & Skills",
  "কৃষি ও পরিবেশ": "Agriculture & Environment",
  "স্বাস্থ্যসেবা": "Healthcare",
  "অবকাঠামো ও সংযোগ": "Infrastructure & Connectivity",
};

export function categoryLabel(category: string, locale: Locale): string {
  return locale === "bn" ? category : (CATEGORY_EN[category] ?? category);
}

export const ROLE_LABEL: Record<Role, { bn: string; en: string }> = {
  UPAZILA: { bn: "উপজেলা কার্যালয়", en: "Upazila Office" },
  DISTRICT: { bn: "জেলা কার্যালয়", en: "District Office" },
  HQ: { bn: "সদর দপ্তর", en: "Headquarters" },
  ADMIN: { bn: "সিস্টেম অ্যাডমিন", en: "System Admin" },
};

export function roleLabel(role: Role, locale: Locale): string {
  return ROLE_LABEL[role][locale];
}

export const STATUS_META: Record<Status, { bn: string; en: string; cls: string }> = {
  UPAZILA: { bn: "উপজেলায় জমা", en: "Submitted at Upazila", cls: "st-upazila" },
  DISTRICT: { bn: "জেলায় যাচাই চলছে", en: "Under District Review", cls: "st-district" },
  HQ: { bn: "সদর দপ্তরে প্রেরিত", en: "Forwarded to HQ", cls: "st-hq" },
  SELECTED: { bn: "নির্বাচিত", en: "Selected", cls: "st-selected" },
};

export function statusLabel(status: Status, locale: Locale): string {
  return STATUS_META[status][locale];
}
