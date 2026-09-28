import type { Role, Status } from "@/generated/prisma/client";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

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

export const CATEGORIES = [
  "ডিজিটাল সেবা",
  "এআই ও ডেটা",
  "শিক্ষা ও দক্ষতা",
  "কৃষি ও পরিবেশ",
  "স্বাস্থ্যসেবা",
  "অবকাঠামো ও সংযোগ",
];

export const ROLE_LABEL: Record<Role, string> = {
  UPAZILA: "উপজেলা কার্যালয়",
  DISTRICT: "জেলা কার্যালয়",
  HQ: "সদর দপ্তর",
  ADMIN: "সিস্টেম অ্যাডমিন",
};

export const STATUS_META: Record<Status, { label: string; cls: string }> = {
  UPAZILA: { label: "উপজেলায় জমা", cls: "st-upazila" },
  DISTRICT: { label: "জেলায় যাচাই চলছে", cls: "st-district" },
  HQ: { label: "সদর দপ্তরে প্রেরিত", cls: "st-hq" },
  SELECTED: { label: "নির্বাচিত", cls: "st-selected" },
};
