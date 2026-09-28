import type { DictKey } from "@/lib/i18n/dict";
import type { IdeaView } from "@/lib/ideaFormat";
import type { Locale } from "@/lib/i18n/locale";
import { formatNumber } from "@/lib/i18n/vocab";

/** One line of the DPP cost estimate. Amounts are in lakh taka. */
export type DppCostItem = { item: string; unit: string; qty: number; unitCost: number };

export type DppStatus = "DRAFT" | "READY";

/** Editable DPP content (everything except bookkeeping fields). */
export type DppData = {
  projectName: string;
  projectNameEn: string;
  sponsoringMinistry: string;
  executingAgency: string;
  location: string;
  implStart: string; // "YYYY-MM"
  implEnd: string; // "YYYY-MM"
  background: string;
  objectives: string;
  activities: string;
  outputs: string;
  planAlignment: string;
  feasibility: string;
  manpower: string;
  risks: string;
  sustainability: string;
  costItems: DppCostItem[];
  fundGob: number;
  fundOwn: number;
  fundOther: number;
};

export type DppView = DppData & {
  status: DppStatus;
  preparedByName: string | null;
  finalizedAt: string | null;
  updatedAt: string;
};

export const DPP_TEXT_FIELDS = [
  "projectName",
  "projectNameEn",
  "sponsoringMinistry",
  "executingAgency",
  "location",
  "implStart",
  "implEnd",
  "background",
  "objectives",
  "activities",
  "outputs",
  "planAlignment",
  "feasibility",
  "manpower",
  "risks",
  "sustainability",
] as const satisfies readonly (keyof DppData)[];

export const DEFAULT_MINISTRY = "ডাক, টেলিযোগাযোগ ও তথ্যপ্রযুক্তি মন্ত্রণালয় — তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ";
export const DEFAULT_AGENCY = "তথ্য ও যোগাযোগ প্রযুক্তি অধিদপ্তর (DoICT)";

const numbered = (lines: string[]) => lines.map((l, i) => `${i + 1}. ${l}`).join("\n");

/** First draft of a DPP, pre-filled from the selected idea's innovation-format data. */
export function dppDefaultsFromIdea(idea: IdeaView): DppData {
  const plan = (idea.workPlan ?? []).filter((r) => r.task.trim());
  const risks = (idea.workPlan ?? []).map((r) => r.risk.trim()).filter(Boolean);
  const place = [idea.upazila, idea.district].filter(Boolean).join(", ");

  const background = [
    idea.concept,
    idea.currentProcessMap ? `বর্তমান প্রক্রিয়া: ${idea.currentProcessMap}` : "",
    idea.proposedProcessMap ? `প্রস্তাবিত প্রক্রিয়া: ${idea.proposedProcessMap}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    projectName: idea.title,
    projectNameEn: "",
    sponsoringMinistry: DEFAULT_MINISTRY,
    executingAgency: DEFAULT_AGENCY,
    location: idea.pilotLocation?.trim() || place,
    implStart: "",
    implEnd: "",
    background,
    objectives: idea.solutionDescription ?? "",
    activities: plan.length > 0 ? numbered(plan.map((r) => r.task.trim())) : "",
    outputs: idea.impact ?? "",
    planAlignment: "",
    feasibility: idea.implementationTimeline ? `প্রস্তাবিত বাস্তবায়নকাল (প্রস্তাবনা অনুযায়ী): ${idea.implementationTimeline}` : "",
    manpower: idea.resourceManpower ?? "",
    risks: risks.length > 0 ? numbered(risks) : "",
    sustainability: idea.resourceSource ?? "",
    costItems:
      plan.length > 0
        ? plan.map((r) => ({ item: r.task.trim(), unit: "থোক", qty: 1, unitCost: 0 }))
        : [{ item: "", unit: "থোক", qty: 1, unitCost: 0 }],
    fundGob: 0,
    fundOwn: 0,
    fundOther: 0,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const lineTotal = (c: DppCostItem) => round2((Number(c.qty) || 0) * (Number(c.unitCost) || 0));
export const costTotal = (items: DppCostItem[]) => round2(items.reduce((s, c) => s + lineTotal(c), 0));
export const fundTotal = (d: Pick<DppData, "fundGob" | "fundOwn" | "fundOther">) =>
  round2((Number(d.fundGob) || 0) + (Number(d.fundOwn) || 0) + (Number(d.fundOther) || 0));

export type DppCheck = { key: DictKey; ok: boolean };

/** Everything that must be true before a DPP can be marked ready (চূড়ান্ত). */
export function dppChecklist(d: DppData): DppCheck[] {
  const filled = (s: string) => s.trim().length > 0;
  const total = costTotal(d.costItems);
  return [
    { key: "dpp_chk_identity", ok: filled(d.projectName) && filled(d.sponsoringMinistry) && filled(d.executingAgency) },
    { key: "dpp_chk_location", ok: filled(d.location) },
    { key: "dpp_chk_period", ok: filled(d.implStart) && filled(d.implEnd) && d.implStart <= d.implEnd },
    { key: "dpp_chk_objectives", ok: filled(d.background) && filled(d.objectives) },
    { key: "dpp_chk_activities", ok: filled(d.activities) && filled(d.outputs) },
    { key: "dpp_chk_cost", ok: total > 0 && d.costItems.every((c) => filled(c.item)) },
    { key: "dpp_chk_finance", ok: total > 0 && Math.abs(fundTotal(d) - total) < 0.01 },
  ];
}

/** Coerce untrusted input (form payload / stored JSON) into a clean DppData. */
export function sanitizeDpp(raw: unknown): DppData {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, max = 8000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const num = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) && n >= 0 ? round2(Math.min(n, 1e9)) : 0;
  };
  const month = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}$/.test(v) ? v : "");

  const items = Array.isArray(src.costItems) ? src.costItems.slice(0, 100) : [];
  const out = {} as DppData;
  for (const f of DPP_TEXT_FIELDS) out[f] = str(src[f], f === "projectName" || f === "projectNameEn" ? 300 : 8000);
  out.implStart = month(src.implStart);
  out.implEnd = month(src.implEnd);
  out.costItems = items
    .map((c) => {
      const r = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
      return { item: str(r.item, 300), unit: str(r.unit, 40), qty: num(r.qty), unitCost: num(r.unitCost) };
    })
    .filter((c) => c.item || c.unitCost > 0);
  out.fundGob = num(src.fundGob);
  out.fundOwn = num(src.fundOwn);
  out.fundOther = num(src.fundOther);
  return out;
}

/** Lakh-taka amount with up to two decimals, in the viewer's digits. */
export function formatLakh(n: number, locale: Locale): string {
  const s = (Math.round(n * 100) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  return formatNumber(s, locale);
}

/** Inclusive month count between two "YYYY-MM" values, or null if incomplete/invalid. */
export function monthsBetween(start: string, end: string): number | null {
  if (!start || !end) return null;
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  const n = (ey - sy) * 12 + (em - sm) + 1;
  return n > 0 ? n : null;
}

export function formatMonth(ym: string, locale: Locale): string {
  if (!ym) return "—";
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", { month: "long", year: "numeric" });
}
