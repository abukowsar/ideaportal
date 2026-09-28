"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import type { Role, Status } from "@prisma/client";

const ROLES: Role[] = ["UPAZILA", "DISTRICT", "HQ", "ADMIN"];
const STATUSES: Status[] = ["UPAZILA", "DISTRICT", "HQ", "SELECTED"];

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  const locale = await getLocale();
  const session = await requireAdmin();
  if (!session) return { ok: false, error: t(locale, "admin_err_permission") };

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "") as Role;
  const district = String(formData.get("district") ?? "").trim() || null;
  const upazila = String(formData.get("upazila") ?? "").trim() || null;

  if (!username || !password || !name) {
    return { ok: false, error: t(locale, "admin_err_create_required") };
  }
  if (password.length < 6) {
    return { ok: false, error: t(locale, "admin_err_password_len") };
  }
  if (!ROLES.includes(role)) {
    return { ok: false, error: t(locale, "admin_err_invalid_role") };
  }

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return { ok: false, error: t(locale, "admin_err_username_used") };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, passwordHash, name, role, district, upazila },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUser(userId: string, formData: FormData): Promise<ActionResult> {
  const locale = await getLocale();
  const session = await requireAdmin();
  if (!session) return { ok: false, error: t(locale, "admin_err_permission") };

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "") as Role;
  const district = String(formData.get("district") ?? "").trim() || null;
  const upazila = String(formData.get("upazila") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!name) return { ok: false, error: t(locale, "admin_err_name_required") };
  if (!ROLES.includes(role)) {
    return { ok: false, error: t(locale, "admin_err_invalid_role") };
  }
  if (password && password.length < 6) {
    return { ok: false, error: t(locale, "admin_err_password_len") };
  }
  if (role !== "ADMIN" && session.user.id === userId) {
    return { ok: false, error: t(locale, "admin_err_self_demote") };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      role,
      district,
      upazila,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const locale = await getLocale();
  const session = await requireAdmin();
  if (!session) return { ok: false, error: t(locale, "admin_err_permission") };

  if (session.user.id === userId) {
    return { ok: false, error: t(locale, "admin_err_self_delete") };
  }

  const ideaCount = await prisma.idea.count({ where: { submittedById: userId } });
  if (ideaCount > 0) {
    return {
      ok: false,
      error: t(locale, "admin_err_has_ideas").replace("{count}", String(ideaCount)),
    };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteIdea(ideaId: string): Promise<ActionResult> {
  const locale = await getLocale();
  const session = await requireAdmin();
  if (!session) return { ok: false, error: t(locale, "admin_err_permission") };

  await prisma.idea.delete({ where: { id: ideaId } });
  revalidatePath("/admin/ideas");
  revalidatePath("/repo");
  revalidatePath("/");
  return { ok: true };
}

export async function setIdeaStatus(ideaId: string, status: string): Promise<ActionResult> {
  const locale = await getLocale();
  const session = await requireAdmin();
  if (!session) return { ok: false, error: t(locale, "admin_err_permission") };

  if (!STATUSES.includes(status as Status)) {
    return { ok: false, error: t(locale, "admin_err_invalid_status") };
  }

  await prisma.idea.update({ where: { id: ideaId }, data: { status: status as Status } });
  revalidatePath("/admin/ideas");
  revalidatePath("/repo");
  revalidatePath("/");
  return { ok: true };
}
