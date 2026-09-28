import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import type { TeamMemberData, WorkPlanRowData } from "@/lib/ideaFormat";

export type IdeaDetailData = {
  solutionDescription: string | null;
  currentProcessMap: string | null;
  proposedProcessMap: string | null;
  pilotLocation: string | null;
  implementationTimeline: string | null;
  teamMembers: TeamMemberData[] | null;
  resourceFinancial: string | null;
  resourceManpower: string | null;
  resourceTechnical: string | null;
  resourceOther: string | null;
  resourceSource: string | null;
  workPlan: WorkPlanRowData[] | null;
};

function memberLabel(role: string, locale: Locale): string {
  if (role === "leader") return t(locale, "team_leader");
  const n = role.replace("member", "");
  return t(locale, "team_member_n").replace("{n}", n);
}

export default function IdeaDetailSections({ idea, locale }: { idea: IdeaDetailData; locale: Locale }) {
  const hasResources = Boolean(
    idea.resourceFinancial || idea.resourceManpower || idea.resourceTechnical || idea.resourceOther || idea.resourceSource
  );
  const hasTeam = Boolean(idea.teamMembers && idea.teamMembers.length > 0);
  const hasWorkPlan = Boolean(idea.workPlan && idea.workPlan.length > 0);
  const hasPilot = Boolean(idea.pilotLocation || idea.implementationTimeline);

  return (
    <>
      {idea.solutionDescription && (
        <div className="detail-block">
          <b>{t(locale, "section_solution")}</b>
          <p>{idea.solutionDescription}</p>
        </div>
      )}
      {idea.currentProcessMap && (
        <div className="detail-block">
          <b>{t(locale, "form_current_process_label")}</b>
          <p>{idea.currentProcessMap}</p>
        </div>
      )}
      {idea.proposedProcessMap && (
        <div className="detail-block">
          <b>{t(locale, "form_proposed_process_label")}</b>
          <p>{idea.proposedProcessMap}</p>
        </div>
      )}
      {hasPilot && (
        <div className="detail-grid-2">
          {idea.pilotLocation && (
            <div className="m-cell">
              <b>{t(locale, "form_pilot_location_label")}</b>
              <span>{idea.pilotLocation}</span>
            </div>
          )}
          {idea.implementationTimeline && (
            <div className="m-cell">
              <b>{t(locale, "form_implementation_time_label")}</b>
              <span>{idea.implementationTimeline}</span>
            </div>
          )}
        </div>
      )}
      {hasTeam && (
        <div className="detail-block">
          <b>{t(locale, "section_team")}</b>
          <div className="detail-team-list">
            {idea.teamMembers!.map((m, i) => (
              <div className="detail-team-item" key={i}>
                <span className="detail-team-role">{memberLabel(m.role, locale)}</span>
                <span>
                  {m.name}
                  {m.designation ? ` · ${m.designation}` : ""}
                </span>
                {(m.mobile || m.email) && (
                  <span className="admin-subtle">{[m.mobile, m.email].filter(Boolean).join(" · ")}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {hasResources && (
        <div className="detail-block">
          <b>{t(locale, "section_resources")}</b>
          <ul className="detail-resource-list">
            {idea.resourceFinancial && (
              <li>
                <b>{t(locale, "form_resource_financial_label")}:</b> {idea.resourceFinancial}
              </li>
            )}
            {idea.resourceManpower && (
              <li>
                <b>{t(locale, "form_resource_manpower_label")}:</b> {idea.resourceManpower}
              </li>
            )}
            {idea.resourceTechnical && (
              <li>
                <b>{t(locale, "form_resource_technical_label")}:</b> {idea.resourceTechnical}
              </li>
            )}
            {idea.resourceOther && (
              <li>
                <b>{t(locale, "form_resource_other_label")}:</b> {idea.resourceOther}
              </li>
            )}
            {idea.resourceSource && (
              <li>
                <b>{t(locale, "form_resource_source_label")}:</b> {idea.resourceSource}
              </li>
            )}
          </ul>
        </div>
      )}
      {hasWorkPlan && (
        <div className="detail-block">
          <b>{t(locale, "section_work_plan")}</b>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t(locale, "work_plan_task")}</th>
                  <th>{t(locale, "work_plan_who")}</th>
                  <th>{t(locale, "work_plan_timeline")}</th>
                  <th>{t(locale, "work_plan_risk")}</th>
                </tr>
              </thead>
              <tbody>
                {idea.workPlan!.map((r, i) => (
                  <tr key={i}>
                    <td>{r.task}</td>
                    <td>{r.who}</td>
                    <td>{r.timeline}</td>
                    <td>{r.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
