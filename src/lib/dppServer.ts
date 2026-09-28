import type { Dpp, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toIdeaView } from "@/lib/ideaView";
import type { DppCostItem, DppView } from "@/lib/dpp";

type SessionUser = { id: string; role: Role; district: string | null };

/** HQ selects ideas, so HQ (and system admins) author the DPP; everyone else in scope reads it. */
export const canEditDpp = (role: Role) => role === "HQ" || role === "ADMIN";

export function toDppView(row: Dpp & { preparedBy: { name: string } | null }): DppView {
  return {
    projectName: row.projectName,
    projectNameEn: row.projectNameEn ?? "",
    sponsoringMinistry: row.sponsoringMinistry,
    executingAgency: row.executingAgency,
    location: row.location ?? "",
    implStart: row.implStart ?? "",
    implEnd: row.implEnd ?? "",
    background: row.background ?? "",
    objectives: row.objectives ?? "",
    activities: row.activities ?? "",
    outputs: row.outputs ?? "",
    planAlignment: row.planAlignment ?? "",
    feasibility: row.feasibility ?? "",
    manpower: row.manpower ?? "",
    risks: row.risks ?? "",
    sustainability: row.sustainability ?? "",
    costItems: (row.costItems as DppCostItem[] | null) ?? [],
    fundGob: row.fundGob,
    fundOwn: row.fundOwn,
    fundOther: row.fundOther,
    status: row.status,
    preparedByName: row.preparedBy?.name ?? null,
    finalizedAt: row.finalizedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** A user may see a DPP for any idea they can see on their dashboard. */
export function canViewIdea(user: SessionUser, idea: { district: string; submittedById: string }) {
  if (user.role === "HQ" || user.role === "ADMIN") return true;
  if (user.role === "DISTRICT") return user.district === idea.district;
  return idea.submittedById === user.id;
}

/** Loads a selected idea with its DPP (if any), or null when missing / not selected / out of scope. */
export async function loadDppContext(ideaId: string, user: SessionUser) {
  const row = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: {
      submittedBy: { select: { name: true } },
      dpp: { include: { preparedBy: { select: { name: true } } } },
    },
  });
  if (!row || row.status !== "SELECTED" || !canViewIdea(user, row)) return null;
  return {
    idea: toIdeaView(row),
    dpp: row.dpp ? toDppView(row.dpp) : null,
    canEdit: canEditDpp(user.role),
  };
}
