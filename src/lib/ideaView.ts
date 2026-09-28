import type { Idea, Prisma, Role } from "@/generated/prisma/client";
import type { IdeaView, TeamMemberData, WorkPlanRowData } from "@/lib/ideaFormat";
import { parseTechTags } from "@/lib/tech";

export function toIdeaView(
  idea: Idea & { submittedBy: { name: string }; dpp?: { status: "DRAFT" | "READY" } | null }
): IdeaView {
  return {
    id: idea.id,
    docket: idea.docket,
    title: idea.title,
    officerName: idea.officerName,
    category: idea.category,
    district: idea.district,
    upazila: idea.upazila,
    concept: idea.concept,
    impact: idea.impact,
    solutionDescription: idea.solutionDescription,
    currentProcessMap: idea.currentProcessMap,
    proposedProcessMap: idea.proposedProcessMap,
    pilotLocation: idea.pilotLocation,
    implementationTimeline: idea.implementationTimeline,
    teamMembers: idea.teamMembers as TeamMemberData[] | null,
    resourceFinancial: idea.resourceFinancial,
    resourceManpower: idea.resourceManpower,
    resourceTechnical: idea.resourceTechnical,
    resourceOther: idea.resourceOther,
    resourceSource: idea.resourceSource,
    workPlan: idea.workPlan as WorkPlanRowData[] | null,
    techTags: parseTechTags(idea.techTags),
    maturity: idea.maturity,
    status: idea.status,
    submittedByName: idea.submittedBy.name,
    dppStatus: idea.dpp?.status ?? null,
    createdAt: idea.createdAt.toISOString(),
    updatedAt: idea.updatedAt.toISOString(),
  };
}

/** Which ideas an employee "owns" for dashboards and exports. HQ and ADMIN see everything. */
export function scopeWhere(user: { id: string; role: Role; district: string | null }): Prisma.IdeaWhereInput {
  if (user.role === "UPAZILA") return { submittedById: user.id };
  if (user.role === "DISTRICT") return { district: user.district ?? "" };
  return {};
}
