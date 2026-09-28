"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { nextDocket } from "@/lib/docket";
import { CATEGORIES } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { Prisma, type Status } from "@prisma/client";
import { isMaturityKey, parseTechTags } from "@/lib/tech";

export type CreateIdeaResult = { ok: true; docket: string } | { ok: false; error: string };

function parseJsonArray(raw: FormDataEntryValue | null): Prisma.InputJsonValue[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createIdea(formData: FormData): Promise<CreateIdeaResult> {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session?.user || (session.user.role !== "UPAZILA" && session.user.role !== "DISTRICT")) {
    return { ok: false, error: t(locale, "submit_err_role") };
  }
  if (!session.user.district) {
    return { ok: false, error: t(locale, "submit_err_no_district") };
  }

  const title = String(formData.get("title") ?? "").trim();
  const officerName = String(formData.get("officerName") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const concept = String(formData.get("concept") ?? "").trim();
  const solutionDescription = String(formData.get("solutionDescription") ?? "").trim();
  const currentProcessMap = String(formData.get("currentProcessMap") ?? "").trim();
  const proposedProcessMap = String(formData.get("proposedProcessMap") ?? "").trim();
  const impact = String(formData.get("impact") ?? "").trim();
  const pilotLocation = String(formData.get("pilotLocation") ?? "").trim();
  const implementationTimeline = String(formData.get("implementationTimeline") ?? "").trim();
  const resourceFinancial = String(formData.get("resourceFinancial") ?? "").trim();
  const resourceManpower = String(formData.get("resourceManpower") ?? "").trim();
  const resourceTechnical = String(formData.get("resourceTechnical") ?? "").trim();
  const resourceOther = String(formData.get("resourceOther") ?? "").trim();
  const resourceSource = String(formData.get("resourceSource") ?? "").trim();
  const teamMembers = parseJsonArray(formData.get("teamMembers"));
  const workPlan = parseJsonArray(formData.get("workPlan"));
  const techTags = parseTechTags(parseJsonArray(formData.get("techTags")));
  const rawMaturity = formData.get("maturity");
  const maturity = isMaturityKey(rawMaturity) ? rawMaturity : "CONCEPT";

  if (!title || !category || !concept) {
    return { ok: false, error: t(locale, "form_required_msg") };
  }
  if (!solutionDescription) {
    return { ok: false, error: t(locale, "submit_err_solution") };
  }
  if (techTags.length === 0) {
    return { ok: false, error: t(locale, "form_tech_required") };
  }
  if (!CATEGORIES.includes(category)) {
    return { ok: false, error: t(locale, "submit_err_category") };
  }

  const district = session.user.district;
  const upazila = session.user.role === "UPAZILA" ? session.user.upazila : null;
  const submittedById = session.user.id;
  const initialStatus: Status = session.user.role === "DISTRICT" ? "DISTRICT" : "UPAZILA";

  const docket = await prisma.$transaction(async (tx) => {
    const docket = await nextDocket(tx, district);
    await tx.idea.create({
      data: {
        docket,
        title,
        officerName: officerName || null,
        category,
        district,
        upazila,
        concept,
        impact: impact || null,
        solutionDescription: solutionDescription || null,
        currentProcessMap: currentProcessMap || null,
        proposedProcessMap: proposedProcessMap || null,
        pilotLocation: pilotLocation || null,
        implementationTimeline: implementationTimeline || null,
        teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
        resourceFinancial: resourceFinancial || null,
        resourceManpower: resourceManpower || null,
        resourceTechnical: resourceTechnical || null,
        resourceOther: resourceOther || null,
        resourceSource: resourceSource || null,
        workPlan: workPlan.length > 0 ? workPlan : undefined,
        techTags,
        maturity,
        status: initialStatus,
        submittedById,
      },
    });
    return docket;
  });

  revalidatePath("/repo");
  revalidatePath("/");

  return { ok: true, docket };
}
