import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DISTRICTS } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import UsersManager, { type UserRow } from "./UsersManager";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // admin layout shows the sign-in form
  const locale = await getLocale();

  if (session.user.role !== "ADMIN") {
    return (
      <section className="form-band">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-eyebrow">{t(locale, "restricted_area")}</span>
            <h2>{t(locale, "users_h2")}</h2>
          </div>
          <div className="restricted">{t(locale, "admin_restricted")}</div>
          <p style={{ marginTop: "16px" }}>
            <Link className="btn btn-outline btn-sm" href="/">
              {t(locale, "back_to_home")}
            </Link>
          </p>
        </div>
      </section>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { ideas: true } } },
  });

  const data: UserRow[] = users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    district: u.district,
    upazila: u.upazila,
    createdAt: u.createdAt.toISOString(),
    ideaCount: u._count.ideas,
  }));

  return (
    <>
      <div className="sec-head">
        <span className="sec-eyebrow">{t(locale, "admin_panel_eyebrow")}</span>
        <h2>{t(locale, "users_h2")}</h2>
        <p>{t(locale, "users_p")}</p>
      </div>
      <UsersManager users={data} districts={DISTRICTS} currentUserId={session.user.id} locale={locale} />
    </>
  );
}
