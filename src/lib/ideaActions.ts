import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import type { IdeaStatus, Viewer } from "@/lib/ideaFormat";

/** Mirrors the permission rules enforced server-side in repo/actions.ts#advanceStatus. */
export function actionLabelFor(
  viewer: Viewer,
  idea: { status: IdeaStatus; district: string },
  locale: Locale
): string | null {
  if (!viewer) return null;
  if (viewer.role === "DISTRICT" && viewer.district === idea.district) {
    if (idea.status === "UPAZILA") return t(locale, "action_start_district");
    if (idea.status === "DISTRICT") return t(locale, "action_forward_hq");
  }
  if (viewer.role === "HQ" && idea.status === "HQ") {
    return t(locale, "action_final_select");
  }
  return null;
}

/**
 * Where a viewer goes to build or read an idea's DPP. HQ and admins author it; other officers
 * only read it, and only for ideas already known to be in their scope (e.g. their dashboard).
 */
export function dppLinkFor(
  viewer: Viewer,
  idea: { id: string; status: IdeaStatus },
  inScope = false
): { href: string; canEdit: boolean } | undefined {
  if (!viewer || idea.status !== "SELECTED") return undefined;
  if (viewer.role === "ADMIN") return { href: `/admin/dpp/${idea.id}`, canEdit: true };
  if (viewer.role === "HQ") return { href: `/dpp/${idea.id}`, canEdit: true };
  return inScope ? { href: `/dpp/${idea.id}`, canEdit: false } : undefined;
}
