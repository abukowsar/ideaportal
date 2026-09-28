import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale, type Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dict";
import { statusLabel, categoryLabel, districtLabel } from "@/lib/i18n/vocab";
import { formatDate } from "@/lib/i18n/time";
import { toIdeaView } from "@/lib/ideaView";
import PrintButton from "./PrintButton";
import { maturityLabel, techLabel } from "@/lib/tech";

function Text({ value }: { value: string | null | undefined }) {
  return <div className="print-text">{value?.trim() ? value : "—"}</div>;
}

function memberLabel(role: string, locale: Locale): string {
  if (role === "leader") return t(locale, "team_leader");
  return t(locale, "team_member_n").replace("{n}", role.replace("member", ""));
}

export default async function PrintIdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const row = await prisma.idea.findUnique({
    where: { id },
    include: { submittedBy: { select: { name: true } } },
  });
  if (!row) notFound();
  const idea = toIdeaView(row);
  const team = idea.teamMembers ?? [];
  const plan = idea.workPlan ?? [];

  return (
    <div className="print-page">
      <div className="print-toolbar">
        <a className="btn btn-outline btn-sm" href="/repo">
          {t(locale, "print_back")}
        </a>
        <PrintButton label={t(locale, "print_now")} />
      </div>

      <article className="print-sheet">
        <div className="print-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="DoICT" />
          <div>
            <div className="gov">{t(locale, "hero_gov_line")}</div>
            <h1>{t(locale, "submit_official_format_link")}</h1>
          </div>
          <div className="docket mono">{idea.docket}</div>
        </div>

        <div className="print-meta">
          <div>
            <b>{t(locale, "th_status")}</b>
            {statusLabel(idea.status, locale)}
          </div>
          <div>
            <b>{t(locale, "form_category_label")}</b>
            {categoryLabel(idea.category, locale)}
          </div>
          <div>
            <b>{t(locale, "form_district_label")}</b>
            {districtLabel(idea.district, locale)}
          </div>
          <div>
            <b>{t(locale, "form_upazila_label")}</b>
            {idea.upazila ?? "—"}
          </div>
          <div>
            <b>{t(locale, "th_submitted_by")}</b>
            {idea.submittedByName}
          </div>
          <div>
            <b>{t(locale, "form_officer_name_label")}</b>
            {idea.officerName ?? "—"}
          </div>
          <div>
            <b>{t(locale, "print_submitted_on")}</b>
            {formatDate(idea.createdAt, locale)}
          </div>
          <div>
            <b>{t(locale, "print_generated_on")}</b>
            {formatDate(new Date().toISOString(), locale)}
          </div>
        </div>

        <table className="print-table">
          <tbody>
            <tr>
              <th>{t(locale, "form_title_label")}</th>
              <td>
                <Text value={idea.title} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "tech_label")}</th>
              <td>
                <Text value={idea.techTags.map((k) => techLabel(k, locale)).join(", ")} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "maturity_label")}</th>
              <td>
                <Text value={maturityLabel(idea.maturity, locale)} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "form_concept_label")}</th>
              <td>
                <Text value={idea.concept} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "section_solution")}</th>
              <td>
                <div className="print-sub">{t(locale, "form_solution_label")}</div>
                <Text value={idea.solutionDescription} />
                <div className="print-sub">{t(locale, "form_current_process_label")}</div>
                <Text value={idea.currentProcessMap} />
                <div className="print-sub">{t(locale, "form_proposed_process_label")}</div>
                <Text value={idea.proposedProcessMap} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "form_impact_label")}</th>
              <td>
                <Text value={idea.impact} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "form_pilot_location_label")}</th>
              <td>
                <Text value={idea.pilotLocation} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "form_implementation_time_label")}</th>
              <td>
                <Text value={idea.implementationTimeline} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "section_team")}</th>
              <td>
                {team.length === 0 ? (
                  <Text value={null} />
                ) : (
                  <table className="print-inner">
                    <thead>
                      <tr>
                        <th>{t(locale, "field_role")}</th>
                        <th>{t(locale, "team_field_name")}</th>
                        <th>{t(locale, "team_field_designation")}</th>
                        <th>{t(locale, "team_field_address")}</th>
                        <th>{t(locale, "team_field_mobile")}</th>
                        <th>{t(locale, "team_field_email")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((m, i) => (
                        <tr key={i}>
                          <td>{memberLabel(m.role, locale)}</td>
                          <td>{m.name}</td>
                          <td>{m.designation}</td>
                          <td>{m.address}</td>
                          <td>{m.mobile}</td>
                          <td>{m.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
            <tr>
              <th>{t(locale, "section_resources")}</th>
              <td>
                <div className="print-sub">{t(locale, "form_resource_financial_label")}</div>
                <Text value={idea.resourceFinancial} />
                <div className="print-sub">{t(locale, "form_resource_manpower_label")}</div>
                <Text value={idea.resourceManpower} />
                <div className="print-sub">{t(locale, "form_resource_technical_label")}</div>
                <Text value={idea.resourceTechnical} />
                <div className="print-sub">{t(locale, "form_resource_other_label")}</div>
                <Text value={idea.resourceOther} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "form_resource_source_label")}</th>
              <td>
                <Text value={idea.resourceSource} />
              </td>
            </tr>
            <tr>
              <th>{t(locale, "section_work_plan")}</th>
              <td>
                {plan.length === 0 ? (
                  <Text value={null} />
                ) : (
                  <table className="print-inner">
                    <thead>
                      <tr>
                        <th>{t(locale, "work_plan_task")}</th>
                        <th>{t(locale, "work_plan_who")}</th>
                        <th>{t(locale, "work_plan_timeline")}</th>
                        <th>{t(locale, "work_plan_risk")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.map((r, i) => (
                        <tr key={i}>
                          <td>{r.task}</td>
                          <td>{r.who}</td>
                          <td>{r.timeline}</td>
                          <td>{r.risk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="print-foot">
          <span className="mono">{idea.docket}</span>
          <span className="print-sign">{t(locale, "print_signature")}</span>
        </div>
      </article>
    </div>
  );
}
