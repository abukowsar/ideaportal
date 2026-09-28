"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import type { Status } from "@prisma/client";

const NEXT_STATUS: Partial<Record<Status, Status>> = {
  UPAZILA: "DISTRICT",
  DISTRICT: "HQ",
  HQ: "SELECTED",
};

export type AdvanceResult = { ok: true; status: Status } | { ok: false; error: string };

export async function advanceStatus(ideaId: string): Promise<AdvanceResult> {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  if (!session?.user) return { ok: false, error: t(locale, "repo_err_login") };

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) return { ok: false, error: t(locale, "repo_err_not_found") };

  const { role, district } = session.user;

  if (role === "DISTRICT") {
    if (district !== idea.district) {
      return { ok: false, error: t(locale, "repo_err_not_your_district") };
    }
    if (idea.status !== "UPAZILA" && idea.status !== "DISTRICT") {
      return { ok: false, error: t(locale, "repo_err_no_action_here") };
    }
  } else if (role === "HQ") {
    if (idea.status !== "HQ") {
      return { ok: false, error: t(locale, "repo_err_hq_only") };
    }
  } else {
    return { ok: false, error: t(locale, "repo_err_role_forbidden") };
  }

  const next = NEXT_STATUS[idea.status];
  if (!next) return { ok: false, error: t(locale, "repo_err_already_final") };

  await prisma.idea.update({ where: { id: ideaId }, data: { status: next } });

  revalidatePath("/repo");
  revalidatePath("/");

  return { ok: true, status: next };
}
