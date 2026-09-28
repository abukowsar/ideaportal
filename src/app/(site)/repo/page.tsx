import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DISTRICTS } from "@/lib/bn";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { toIdeaView } from "@/lib/ideaView";
import { isTechKey } from "@/lib/tech";
import type { Viewer } from "@/lib/ideaFormat";
import RepoBrowser from "./RepoBrowser";

export default async function RepoPage({ searchParams }: { searchParams: Promise<{ tech?: string }> }) {
  const [session, locale, { tech }] = await Promise.all([getServerSession(authOptions), getLocale(), searchParams]);

  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { submittedBy: { select: { name: true } }, dpp: { select: { status: true } } },
  });

  const viewer: Viewer = session?.user ? { role: session.user.role, district: session.user.district } : null;

  return (
    <section id="repo">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">{t(locale, "repo_eyebrow")}</span>
          <h2>{t(locale, "repo_h2")}</h2>
          <p>{t(locale, "repo_p")}</p>
        </div>
        <RepoBrowser
          ideas={ideas.map(toIdeaView)}
          districts={DISTRICTS}
          viewer={viewer}
          locale={locale}
          initialTech={isTechKey(tech) ? tech : null}
        />
      </div>
    </section>
  );
}
