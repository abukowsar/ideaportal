"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { dppChecklist, sanitizeDpp } from "@/lib/dpp";
import { canEditDpp } from "@/lib/dppServer";

export type DppActionResult = { ok: true; status: "DRAFT" | "READY" } | { ok: false; error: string };

function revalidateDpp(ideaId: string) {
  for (const p of ["/dpp", `/dpp/${ideaId}`, "/admin/dpp", `/admin/dpp/${ideaId}`, "/dashboard", "/admin", "/admin/ideas"]) {
    revalidatePath(p);
  }
}

async function authorize(ideaId: string) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  if (!session?.user) return { ok: false, error: t(locale, "repo_err_login") } as const;
  if (!canEditDpp(session.user.role)) return { ok: false, error: t(locale, "dpp_err_role") } as const;
  const idea = await prisma.idea.findUnique({ where: { id: ideaId }, include: { dpp: { select: { status: true } } } });
  if (!idea) return { ok: false, error: t(locale, "repo_err_not_found") } as const;
  if (idea.status !== "SELECTED") return { ok: false, error: t(locale, "dpp_err_not_selected") } as const;
  return { ok: true, session, locale, idea } as const;
}

/** Saves the DPP draft; with `finalize` it must also pass the readiness checklist. */
export async function saveDpp(ideaId: string, payload: unknown, finalize: boolean): Promise<DppActionResult> {
  const auth = await authorize(ideaId);
  if (!auth.ok) return { ok: false, error: auth.error };
  const { session, locale, idea } = auth;

  if (idea.dpp?.status === "READY") return { ok: false, error: t(locale, "dpp_err_locked") };

  const data = sanitizeDpp(payload);
  if (!data.projectName) return { ok: false, error: t(locale, "dpp_err_name") };
  if (finalize && dppChecklist(data).some((c) => !c.ok)) {
    return { ok: false, error: t(locale, "dpp_err_incomplete") };
  }

  const status = finalize ? "READY" : "DRAFT";
  const fields = {
    ...data,
    status,
    preparedById: session.user.id,
    finalizedAt: finalize ? new Date() : null,
  } as const;
  await prisma.dpp.upsert({
    where: { ideaId },
    create: { ideaId, ...fields },
    update: fields,
  });

  revalidateDpp(ideaId);
  return { ok: true, status };
}

/** Unlocks a finalized DPP so it can be revised. */
export async function reopenDpp(ideaId: string): Promise<DppActionResult> {
  const auth = await authorize(ideaId);
  if (!auth.ok) return { ok: false, error: auth.error };
  if (!auth.idea.dpp) return { ok: false, error: t(auth.locale, "repo_err_not_found") };

  await prisma.dpp.update({ where: { ideaId }, data: { status: "DRAFT", finalizedAt: null } });
  revalidateDpp(ideaId);
  return { ok: true, status: "DRAFT" };
}
