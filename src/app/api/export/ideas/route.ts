import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t, type DictKey } from "@/lib/i18n/dict";
import { statusLabel, categoryLabel, districtLabel } from "@/lib/i18n/vocab";
import { scopeWhere } from "@/lib/ideaView";
import { maturityLabel, parseTechTags, techLabel } from "@/lib/tech";

const HEADER_KEYS: DictKey[] = [
  "th_docket",
  "th_title",
  "form_category_label",
  "form_district_label",
  "form_upazila_label",
  "th_status",
  "tech_label",
  "maturity_label",
  "th_submitted_by",
  "form_officer_name_label",
  "print_submitted_on",
  "form_concept_label",
  "form_solution_label",
  "form_impact_label",
  "form_pilot_location_label",
  "form_implementation_time_label",
];

function csvCell(value: string | null | undefined): string {
  let s = value ?? "";
  // Neutralise spreadsheet formula injection from user-entered text.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  if (!session?.user) {
    return new Response(t(locale, "export_err_login"), { status: 401 });
  }

  const ideas = await prisma.idea.findMany({
    where: scopeWhere(session.user),
    orderBy: { createdAt: "desc" },
    include: { submittedBy: { select: { name: true } } },
  });

  const rows = ideas.map((idea) => [
    idea.docket,
    idea.title,
    categoryLabel(idea.category, locale),
    districtLabel(idea.district, locale),
    idea.upazila,
    statusLabel(idea.status, locale),
    parseTechTags(idea.techTags)
      .map((k) => techLabel(k, locale))
      .join("; "),
    maturityLabel(idea.maturity, locale),
    idea.submittedBy.name,
    idea.officerName,
    idea.createdAt.toISOString().slice(0, 10),
    idea.concept,
    idea.solutionDescription,
    idea.impact,
    idea.pilotLocation,
    idea.implementationTimeline,
  ]);

  const header = HEADER_KEYS.map((k) => t(locale, k));
  const csv = "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="doict-ideas-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
