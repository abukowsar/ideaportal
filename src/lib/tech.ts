import type { IconName } from "@/components/Icon";
import type { Locale } from "@/lib/i18n/locale";

/** Technologies an idea can use. Keys are stored in Idea.techTags; labels are display-only. */
export const TECH = {
  AI: { bn: "কৃত্রিম বুদ্ধিমত্তা (AI)", en: "Artificial Intelligence", icon: "bot" },
  DATA: { bn: "ডেটা অ্যানালিটিক্স", en: "Data Analytics", icon: "chart" },
  IOT: { bn: "আইওটি ও সেন্সর", en: "IoT & Sensors", icon: "cpu" },
  MOBILE: { bn: "মোবাইল অ্যাপ", en: "Mobile App", icon: "smartphone" },
  WEB: { bn: "ওয়েব প্ল্যাটফর্ম", en: "Web Platform", icon: "globe" },
  CLOUD: { bn: "ক্লাউড কম্পিউটিং", en: "Cloud Computing", icon: "cloud" },
  SMS: { bn: "এসএমএস ও ভয়েস (IVR)", en: "SMS & Voice (IVR)", icon: "message" },
  GIS: { bn: "জিআইএস ও ম্যাপিং", en: "GIS & Mapping", icon: "map" },
  CYBER: { bn: "সাইবার নিরাপত্তা", en: "Cybersecurity", icon: "shield" },
  BLOCKCHAIN: { bn: "ব্লকচেইন", en: "Blockchain", icon: "link" },
  ROBOTICS: { bn: "ড্রোন ও রোবোটিক্স", en: "Drones & Robotics", icon: "rocket" },
} as const satisfies Record<string, { bn: string; en: string; icon: IconName }>;

export type TechKey = keyof typeof TECH;
export const TECH_KEYS = Object.keys(TECH) as TechKey[];

export const isTechKey = (v: unknown): v is TechKey => typeof v === "string" && v in TECH;

export const techLabel = (key: TechKey, locale: Locale) => TECH[key][locale];

/** Keep only known tech keys, de-duplicated, from untrusted JSON. */
export function parseTechTags(raw: unknown): TechKey[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter(isTechKey))];
}

/** How far an idea has progressed toward real-world use (a simplified readiness scale). */
export const MATURITY = {
  CONCEPT: { bn: "ধারণা", en: "Concept", hint: { bn: "সমস্যা ও সমাধানের ধারণা", en: "Problem and solution defined" } },
  PROTOTYPE: { bn: "প্রোটোটাইপ", en: "Prototype", hint: { bn: "কার্যকর নমুনা তৈরি", en: "Working prototype built" } },
  PILOT: { bn: "পাইলট", en: "Pilot", hint: { bn: "মাঠপর্যায়ে পরীক্ষামূলক চালু", en: "Tested in the field" } },
  SCALE: { bn: "সম্প্রসারণযোগ্য", en: "Ready to scale", hint: { bn: "সারা দেশে বিস্তারের জন্য প্রস্তুত", en: "Ready for national rollout" } },
} as const;

export type MaturityKey = keyof typeof MATURITY;
export const MATURITY_KEYS = Object.keys(MATURITY) as MaturityKey[];
export const isMaturityKey = (v: unknown): v is MaturityKey => typeof v === "string" && v in MATURITY;
export const maturityLabel = (key: MaturityKey, locale: Locale) => MATURITY[key][locale];
/** 1-based level on the 4-step scale. */
export const maturityLevel = (key: MaturityKey) => MATURITY_KEYS.indexOf(key) + 1;
