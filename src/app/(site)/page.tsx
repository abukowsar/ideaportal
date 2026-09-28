import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/Reveal";
import StatusBadge from "@/components/StatusBadge";
import Icon, { type IconName } from "@/components/Icon";
import TechTags from "@/components/TechTags";
import MaturityMeter from "@/components/MaturityMeter";
import { MATURITY, MATURITY_KEYS, TECH, TECH_KEYS, parseTechTags, techLabel, type TechKey } from "@/lib/tech";
import { getLocale } from "@/lib/i18n/locale";
import { t, type DictKey } from "@/lib/i18n/dict";
import { formatNumber, categoryLabel, ideaLocationLabel } from "@/lib/i18n/vocab";

const CATEGORY_PROMPTS: { icon: IconName; titleKey: DictKey; bn: string }[] = [
  { icon: "monitor", titleKey: "cat_prompt_digital", bn: "ডিজিটাল সেবা" },
  { icon: "bot", titleKey: "cat_prompt_ai", bn: "এআই ও ডেটা" },
  { icon: "graduation", titleKey: "cat_prompt_edu", bn: "শিক্ষা ও দক্ষতা" },
  { icon: "wheat", titleKey: "cat_prompt_agri", bn: "কৃষি ও পরিবেশ" },
  { icon: "heart", titleKey: "cat_prompt_health", bn: "স্বাস্থ্যসেবা" },
  { icon: "network", titleKey: "cat_prompt_infra", bn: "অবকাঠামো ও সংযোগ" },
];

const HERO_STEPS: { key: DictKey; icon: IconName }[] = [
  { key: "hero_chip_submit", icon: "send" },
  { key: "hero_chip_district", icon: "clipboardCheck" },
  { key: "hero_chip_hq", icon: "landmark" },
  { key: "hero_chip_dpp", icon: "fileText" },
];

/** Technologies shown orbiting the hero bulb. */
const ORBIT_TECH: TechKey[] = ["AI", "IOT", "CLOUD", "MOBILE", "DATA", "GIS"];

const FLOW_STEPS: { n: 1 | 2 | 3 | 4; icon: IconName }[] = [
  { n: 1, icon: "send" },
  { n: 2, icon: "clipboardCheck" },
  { n: 3, icon: "landmark" },
  { n: 4, icon: "fileText" },
];

const INVOLVE_STEPS: { key: DictKey; icon: IconName }[] = [
  { key: "flow_illus_step1", icon: "search" },
  { key: "flow_illus_step2", icon: "building" },
  { key: "flow_illus_step3", icon: "ticket" },
  { key: "flow_illus_step4", icon: "chart" },
];

/** A lit bulb whose filament is the DoICT logo's rising bars and signal dot: an idea growing into a project. */
function IdeaBulb() {
  return (
    <svg className="idea-bulb" viewBox="0 0 120 150" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="idea-bulb-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="55%" stopColor="#ffd56b" stopOpacity=".85" />
          <stop offset="100%" stopColor="#ffd56b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="idea-bulb-rays" stroke="#fff3c4" strokeWidth="3" strokeLinecap="round">
        <line x1="60" y1="2" x2="60" y2="-8" />
        <line x1="22" y1="16" x2="15" y2="9" />
        <line x1="98" y1="16" x2="105" y2="9" />
        <line x1="7" y1="52" x2="-3" y2="52" />
        <line x1="113" y1="52" x2="123" y2="52" />
      </g>
      <circle className="idea-bulb-glow" cx="60" cy="55" r="48" fill="url(#idea-bulb-glow)" />
      <path
        d="M60 14C34 14 20 34 20 55c0 17 10 27 18 37 4 5 6 10 6 16h32c0-6 2-11 6-16 8-10 18-20 18-37 0-21-14-41-40-41Z"
        fill="rgba(255,255,255,.18)"
        stroke="rgba(255,255,255,.9)"
        strokeWidth="3"
      />
      <g fill="#ffd56b">
        <rect x="42" y="72" width="8" height="20" rx="2" />
        <rect x="54" y="62" width="8" height="30" rx="2" />
        <rect x="66" y="50" width="8" height="42" rx="2" />
      </g>
      <circle cx="70" cy="40" r="5" fill="#f42a41" stroke="#fff" strokeWidth="2" />
      <g fill="#dfe7e2">
        <rect x="43" y="111" width="34" height="7" rx="3" />
        <rect x="45" y="120" width="30" height="7" rx="3" />
        <rect x="48" y="129" width="24" height="7" rx="3" />
      </g>
      <path d="M53 138h14l-3 7h-8Z" fill="#b9c6bf" />
    </svg>
  );
}

export default async function HomePage() {
  const locale = await getLocale();
  const [total, districtRows, selected, showcaseRows, techRows] = await Promise.all([
    prisma.idea.count(),
    prisma.idea.findMany({ distinct: ["district"], select: { district: true } }),
    prisma.idea.count({ where: { status: "SELECTED" } }),
    prisma.idea.findMany({
      where: { status: { in: ["HQ", "SELECTED"] } },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    prisma.idea.findMany({ select: { techTags: true, maturity: true } }),
  ]);

  // Technology radar + maturity breakdown, computed from every idea's tags.
  const techCount = new Map<TechKey, number>();
  const maturityCount = new Map<string, number>();
  for (const r of techRows) {
    for (const k of parseTechTags(r.techTags)) techCount.set(k, (techCount.get(k) ?? 0) + 1);
    maturityCount.set(r.maturity, (maturityCount.get(r.maturity) ?? 0) + 1);
  }
  const radar = TECH_KEYS.map((k) => ({ key: k, count: techCount.get(k) ?? 0 })).sort((a, b) => b.count - a.count);
  const radarMax = Math.max(1, ...radar.map((r) => r.count));
  const showcase = showcaseRows.map((r) => ({ ...r, tags: parseTechTags(r.techTags) }));

  return (
    <>
      <div className="hero">
        <div className="hero-flag" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="gov-line">{t(locale, "hero_gov_line")}</div>
            {locale === "bn" ? (
              <h1>
                প্রযুক্তিনির্ভর <em>উদ্ভাবন</em>,
                <br />
                বদলে দেবে <em>জনসেবা</em>র অভিজ্ঞতা
              </h1>
            ) : (
              <h1>
                Technology-driven <em>innovation</em>
                <br />
                that transforms <em>public service</em>
              </h1>
            )}
            <p className="lede">{t(locale, "hero_lede")}</p>
            <div className="hero-cta">
              <Link className="btn btn-green" href="/repo">
                {t(locale, "hero_cta_repo")}
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link className="btn btn-outline" href="#involve">
                {t(locale, "hero_cta_how")}
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="num">{formatNumber(total, locale)}</span>
                <span className="lbl">{t(locale, "stat_total")}</span>
              </div>
              <div className="stat">
                <span className="num">{formatNumber(districtRows.length, locale)}</span>
                <span className="lbl">{t(locale, "stat_districts")}</span>
              </div>
              <div className="stat">
                <span className="num">{formatNumber(techCount.size, locale)}</span>
                <span className="lbl">{t(locale, "stat_tech")}</span>
              </div>
              <div className="stat">
                <span className="num">{formatNumber(selected, locale)}</span>
                <span className="lbl">{t(locale, "stat_selected")}</span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit o1" />
            <div className="hero-orbit o2" />
            <div className="tech-orbit">
              {ORBIT_TECH.map((k, i) => (
                <span className="tech-node" key={k} style={{ "--a": `${i * (360 / ORBIT_TECH.length)}deg` } as React.CSSProperties}>
                  <span className="tech-node-in" title={techLabel(k, locale)}>
                    <Icon name={TECH[k].icon} size={18} />
                  </span>
                </span>
              ))}
            </div>
            <div className="hero-blob">
              <IdeaBulb />
            </div>
            {HERO_STEPS.map((step, i) => (
              <span className={`hero-chip c${i + 1}`} key={step.key}>
                <b className="hero-chip-n">{formatNumber(`0${i + 1}`, locale)}</b>
                <Icon name={step.icon} size={15} />
                {t(locale, step.key)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section id="mission">
        <div className="wrap">
          <Reveal className="sec-head sec-head-center">
            <span className="sec-eyebrow">{t(locale, "mission_eyebrow")}</span>
            <h2>{t(locale, "mission_h2")}</h2>
            <p>{t(locale, "mission_p")}</p>
          </Reveal>
          <Reveal className="mission-grid">
            <div className="mission-card">
              <div className="icon-tile" aria-hidden="true">
                <Icon name="eye" size={24} />
              </div>
              <h3>{t(locale, "mission_card1_h3")}</h3>
              <p>{t(locale, "mission_card1_p")}</p>
            </div>
            <div className="mission-card">
              <div className="icon-tile" aria-hidden="true">
                <Icon name="map" size={24} />
              </div>
              <h3>{t(locale, "mission_card2_h3")}</h3>
              <p>{t(locale, "mission_card2_p")}</p>
            </div>
            <div className="mission-card">
              <div className="icon-tile" aria-hidden="true">
                <Icon name="sprout" size={24} />
              </div>
              <h3>{t(locale, "mission_card3_h3")}</h3>
              <p>{t(locale, "mission_card3_p")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="radar" className="alt-band">
        <div className="wrap">
          <Reveal className="sec-head sec-head-center">
            <span className="sec-eyebrow">{t(locale, "radar_eyebrow")}</span>
            <h2>{t(locale, "radar_h2")}</h2>
            <p>{t(locale, "radar_p")}</p>
          </Reveal>
          <Reveal className="radar-grid">
            {radar.map(({ key, count }) => (
              <Link key={key} href={`/repo?tech=${key}`} className={`radar-card${count === 0 ? " is-empty" : ""}`}>
                <span className="icon-tile icon-tile-soft" aria-hidden="true">
                  <Icon name={TECH[key].icon} size={22} />
                </span>
                <span className="radar-body">
                  <b>{techLabel(key, locale)}</b>
                  <small>
                    {count > 0
                      ? t(locale, "radar_ideas").replace("{n}", formatNumber(count, locale))
                      : t(locale, "radar_none")}
                  </small>
                  <span className="radar-bar" aria-hidden="true">
                    <span style={{ width: `${(count / radarMax) * 100}%` }} />
                  </span>
                </span>
                <Icon name="chevronRight" size={16} className="radar-go" />
              </Link>
            ))}
          </Reveal>

          <Reveal className="maturity-band">
            <div className="maturity-band-head">
              <span className="sec-eyebrow">{t(locale, "maturity_eyebrow")}</span>
              <h3>{t(locale, "maturity_h2")}</h3>
              <p>{t(locale, "maturity_p")}</p>
            </div>
            <ol className="maturity-funnel">
              {MATURITY_KEYS.map((k, i) => (
                <li key={k}>
                  <span className="maturity-funnel-n">{formatNumber(i + 1, locale)}</span>
                  <b className="mono">{formatNumber(maturityCount.get(k) ?? 0, locale)}</b>
                  <strong>{MATURITY[k][locale]}</strong>
                  <small>{MATURITY[k].hint[locale]}</small>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="flow">
        <div className="wrap">
          <Reveal className="sec-head sec-head-center">
            <span className="sec-eyebrow">{t(locale, "flow_eyebrow")}</span>
            <h2>{t(locale, "flow_h2")}</h2>
            <p>{t(locale, "flow_p")}</p>
          </Reveal>
          <Reveal className="flow">
            {FLOW_STEPS.map((step) => (
              <div className={`flow-step${step.n === 4 ? " flow-step-final" : ""}`} key={step.n}>
                <div className="flow-step-top">
                  <div className="icon-tile" aria-hidden="true">
                    <Icon name={step.icon} size={24} />
                  </div>
                  <span className="f-stage">{t(locale, `flow_step${step.n}_stage`)}</span>
                </div>
                <h3>{t(locale, `flow_step${step.n}_h3`)}</h3>
                <p>{t(locale, `flow_step${step.n}_p`)}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="open-callout">
            <div className="icon-tile icon-tile-gold" aria-hidden="true">
              <Icon name="shieldCheck" size={26} />
            </div>
            <div>
              <h3>
                {t(locale, "open_callout_h3")} <span className="ro-badge">READ-ONLY</span>
              </h3>
              <p>
                {t(locale, "open_callout_p_pre")}
                <b>{t(locale, "open_callout_p_bold")}</b>
                {t(locale, "open_callout_p_post")}
              </p>
              <p className="flow-note" style={{ marginTop: "12px" }}>
                {t(locale, "open_callout_note")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="categories" className="alt-band">
        <div className="wrap">
          <Reveal className="sec-head sec-head-center">
            <span className="sec-eyebrow">{t(locale, "cat_eyebrow")}</span>
            <h2>{t(locale, "cat_h2")}</h2>
            <p>{t(locale, "cat_p")}</p>
          </Reveal>
          <Reveal className="cat-grid">
            {CATEGORY_PROMPTS.map((c) => (
              <div className="cat-card" key={c.bn}>
                <span className="icon-tile icon-tile-soft" aria-hidden="true">
                  <Icon name={c.icon} size={22} />
                </span>
                <h3>{categoryLabel(c.bn, locale)}</h3>
                <p>{t(locale, c.titleKey)}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {showcase.length > 0 && (
        <section id="showcase">
          <div className="wrap">
            <Reveal className="sec-head sec-head-center">
              <span className="sec-eyebrow">{t(locale, "spotlight_eyebrow")}</span>
              <h2>{t(locale, "showcase_h2")}</h2>
              <p>{t(locale, "showcase_p")}</p>
            </Reveal>
            <Reveal className="cards">
              {showcase.map((idea) => (
                <Link className="card showcase-card idea-card" key={idea.id} href={`/ideas/${idea.id}`}>
                  <div className="c-top">
                    <span className="c-docket">{idea.docket}</span>
                    <StatusBadge status={idea.status} locale={locale} />
                  </div>
                  <h3>{idea.title}</h3>
                  <p className="c-sum">{idea.concept}</p>
                  <TechTags tags={idea.tags} locale={locale} max={3} />
                  <MaturityMeter value={idea.maturity} locale={locale} compact />
                  <div className="c-meta">
                    <span>
                      <Icon name="pin" size={14} /> {ideaLocationLabel(idea.upazila, idea.district, locale)}
                    </span>
                    <span>{categoryLabel(idea.category, locale)}</span>
                  </div>
                </Link>
              ))}
            </Reveal>
            <Reveal className="showcase-more">
              <Link className="btn btn-outline" href="/repo">
                {t(locale, "showcase_more")}
                <Icon name="arrowRight" size={18} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section id="involve">
        <div className="wrap">
          <Reveal className="involve-band">
            <div className="involve-grid">
              <div className="involve-copy">
                <span className="sec-eyebrow">{t(locale, "involve_eyebrow")}</span>
                <h2>{t(locale, "involve_h2")}</h2>
                <p>{t(locale, "involve_p")}</p>
                <ol className="involve-steps">
                  <li>{t(locale, "involve_step1")}</li>
                  <li>{t(locale, "involve_step2")}</li>
                  <li>{t(locale, "involve_step3")}</li>
                  <li>{t(locale, "involve_step4")}</li>
                </ol>
                <div className="hero-cta" style={{ marginTop: "22px" }}>
                  <Link className="btn btn-light" href="/repo">
                    {t(locale, "involve_cta1")}
                    <Icon name="arrowRight" size={18} />
                  </Link>
                  <Link className="btn btn-ghost" href="/login">
                    <Icon name="login" size={18} />
                    {t(locale, "involve_cta2")}
                  </Link>
                </div>
              </div>
              <div className="involve-flow" aria-hidden="true">
                {INVOLVE_STEPS.map((step, i) => (
                  <div className="involve-flow-step" key={step.key}>
                    <span className="involve-flow-num">
                      <Icon name={step.icon} size={20} />
                    </span>
                    <div className="involve-flow-body">
                      <b>{t(locale, step.key)}</b>
                      <span className="involve-flow-badge">STEP 0{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
