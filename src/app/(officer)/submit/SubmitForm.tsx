"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/bn";
import { categoryLabel, formatNumber } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { createIdea } from "./actions";
import Icon from "@/components/Icon";
import { MATURITY, MATURITY_KEYS, TECH, TECH_KEYS, techLabel, type MaturityKey, type TechKey } from "@/lib/tech";

type TeamMember = {
  name: string;
  designation: string;
  address: string;
  mobile: string;
  email: string;
};

type WorkPlanRow = { task: string; who: string; timeline: string; risk: string };

const EMPTY_MEMBER: TeamMember = { name: "", designation: "", address: "", mobile: "", email: "" };
const EMPTY_ROW: WorkPlanRow = { task: "", who: "", timeline: "", risk: "" };

export default function SubmitForm({
  district,
  upazila,
  name,
  locale,
  showUpazila,
}: {
  district: string;
  upazila: string;
  name: string;
  locale: Locale;
  showUpazila: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [category, setCategory] = useState("");
  const [concept, setConcept] = useState("");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [currentProcessMap, setCurrentProcessMap] = useState("");
  const [proposedProcessMap, setProposedProcessMap] = useState("");
  const [impact, setImpact] = useState("");
  const [pilotLocation, setPilotLocation] = useState("");
  const [implementationTimeline, setImplementationTimeline] = useState("");
  const [leader, setLeader] = useState<TeamMember>({ ...EMPTY_MEMBER });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [resourceFinancial, setResourceFinancial] = useState("");
  const [resourceManpower, setResourceManpower] = useState("");
  const [resourceTechnical, setResourceTechnical] = useState("");
  const [resourceOther, setResourceOther] = useState("");
  const [resourceSource, setResourceSource] = useState("");
  const [workPlan, setWorkPlan] = useState<WorkPlanRow[]>([{ ...EMPTY_ROW }]);
  const [techTags, setTechTags] = useState<TechKey[]>([]);
  const [maturity, setMaturity] = useState<MaturityKey>("CONCEPT");
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  function updateLeader(field: keyof TeamMember, value: string) {
    setLeader((prev) => ({ ...prev, [field]: value }));
  }

  function updateMember(index: number, field: keyof TeamMember, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function addMember() {
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
  }

  function removeMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateWorkPlan(index: number, field: keyof WorkPlanRow, value: string) {
    setWorkPlan((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function addWorkPlanRow() {
    setWorkPlan((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeWorkPlanRow(index: number) {
    setWorkPlan((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setTitle("");
    setOfficerName("");
    setCategory("");
    setConcept("");
    setSolutionDescription("");
    setCurrentProcessMap("");
    setProposedProcessMap("");
    setImpact("");
    setPilotLocation("");
    setImplementationTimeline("");
    setLeader({ ...EMPTY_MEMBER });
    setMembers([]);
    setResourceFinancial("");
    setResourceManpower("");
    setResourceTechnical("");
    setResourceOther("");
    setResourceSource("");
    setWorkPlan([{ ...EMPTY_ROW }]);
    setTechTags([]);
    setMaturity("CONCEPT");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !category || !concept.trim() || !solutionDescription.trim()) {
      setMsg({ text: t(locale, "form_required_msg"), error: true });
      return;
    }
    if (techTags.length === 0) {
      setMsg({ text: t(locale, "form_tech_required"), error: true });
      return;
    }
    setLoading(true);

    const teamPayload = [
      { role: "leader", ...leader },
      ...members.map((m, i) => ({ role: `member${i + 1}`, ...m })),
    ]
      .filter((m) => m.name.trim() || m.designation.trim() || m.address.trim() || m.mobile.trim() || m.email.trim())
      .map((m) => ({
        role: m.role,
        name: m.name.trim(),
        designation: m.designation.trim(),
        address: m.address.trim(),
        mobile: m.mobile.trim(),
        email: m.email.trim(),
      }));

    const workPlanPayload = workPlan
      .filter((r) => r.task.trim() || r.who.trim() || r.timeline.trim() || r.risk.trim())
      .map((r) => ({
        task: r.task.trim(),
        who: r.who.trim(),
        timeline: r.timeline.trim(),
        risk: r.risk.trim(),
      }));

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("officerName", officerName.trim());
    fd.set("category", category);
    fd.set("concept", concept.trim());
    fd.set("solutionDescription", solutionDescription.trim());
    fd.set("currentProcessMap", currentProcessMap.trim());
    fd.set("proposedProcessMap", proposedProcessMap.trim());
    fd.set("impact", impact.trim());
    fd.set("pilotLocation", pilotLocation.trim());
    fd.set("implementationTimeline", implementationTimeline.trim());
    fd.set("teamMembers", JSON.stringify(teamPayload));
    fd.set("resourceFinancial", resourceFinancial.trim());
    fd.set("resourceManpower", resourceManpower.trim());
    fd.set("resourceTechnical", resourceTechnical.trim());
    fd.set("resourceOther", resourceOther.trim());
    fd.set("resourceSource", resourceSource.trim());
    fd.set("workPlan", JSON.stringify(workPlanPayload));
    fd.set("techTags", JSON.stringify(techTags));
    fd.set("maturity", maturity);

    const result = await createIdea(fd);
    setLoading(false);

    if (!result.ok) {
      setMsg({ text: result.error, error: true });
      return;
    }

    setMsg({
      text: `${t(locale, "submit_success_pre")}${result.docket}${t(locale, "submit_success_post")}`,
    });
    resetForm();
    router.refresh();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <p className="form-official-note">
        <Icon name="fileText" size={16} /> {t(locale, "submit_official_format_note")}{" "}
        <a href="/innovationform.pdf" target="_blank" rel="noreferrer">
          {t(locale, "submit_official_format_link")}
        </a>
        {t(locale, "submit_official_format_note_post")}
      </p>

      <div className="field full">
        <label htmlFor="f-title">
          {t(locale, "form_title_label")} <span className="req">*</span>
        </label>
        <input
          id="f-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(locale, "form_title_placeholder")}
        />
      </div>
      <div className="field">
        <label htmlFor="f-cat">
          {t(locale, "form_category_label")} <span className="req">*</span>
        </label>
        <select id="f-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">{t(locale, "form_select_placeholder")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c, locale)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-district">{t(locale, "form_district_label")}</label>
        <input id="f-district" value={district} disabled />
      </div>
      {showUpazila && (
        <div className="field">
          <label htmlFor="f-upazila">{t(locale, "form_upazila_label")}</label>
          <input id="f-upazila" value={upazila} disabled />
        </div>
      )}
      <div className="form-grid" style={{ gridColumn: "1/-1", padding: 0 }}>
        <div className="field">
          <label htmlFor="f-name">{t(locale, "form_submitter_label")}</label>
          <input id="f-name" value={name} disabled />
          <span className="hint">{t(locale, "form_submitter_hint")}</span>
        </div>
        <div className="field">
          <label htmlFor="f-officer-name">{t(locale, "form_officer_name_label")}</label>
          <input id="f-officer-name" value={officerName} onChange={(e) => setOfficerName(e.target.value)} />
        </div>
      </div>
      <div className="field full">
        <label htmlFor="f-concept">
          {t(locale, "form_concept_label")} <span className="req">*</span>
        </label>
        <textarea
          id="f-concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder={t(locale, "form_concept_placeholder")}
        />
      </div>

      {/* ---- প্রযুক্তি ও পর্যায় / Technology & stage ---- */}
      <div className="form-section">
        <div className="form-section-title">
          {t(locale, "form_tech_label")} <span className="req">*</span>
        </div>
        <p className="hint form-section-hint">{t(locale, "form_tech_hint")}</p>
        <div className="tech-picker" role="group" aria-label={t(locale, "form_tech_label")}>
          {TECH_KEYS.map((k) => {
            const on = techTags.includes(k);
            return (
              <button
                key={k}
                type="button"
                className={"tech-pick" + (on ? " on" : "")}
                aria-pressed={on}
                onClick={() => setTechTags((prev) => (on ? prev.filter((x) => x !== k) : [...prev, k]))}
              >
                <Icon name={on ? "check" : TECH[k].icon} size={15} />
                {techLabel(k, locale)}
              </button>
            );
          })}
        </div>

        <div className="form-section-title form-section-title-sub">{t(locale, "form_maturity_label")}</div>
        <div className="maturity-picker" role="radiogroup" aria-label={t(locale, "form_maturity_label")}>
          {MATURITY_KEYS.map((k, i) => (
            <label key={k} className={"maturity-pick" + (maturity === k ? " on" : "")}>
              <input type="radio" name="maturity" value={k} checked={maturity === k} onChange={() => setMaturity(k)} />
              <span className="maturity-pick-n">{formatNumber(i + 1, locale)}</span>
              <b>{MATURITY[k][locale]}</b>
              <small>{MATURITY[k].hint[locale]}</small>
            </label>
          ))}
        </div>
      </div>

      {/* ---- সমাধান / Solution ---- */}
      <div className="form-section">
        <div className="form-section-title">{t(locale, "section_solution")}</div>
        <div className="form-grid" style={{ padding: 0 }}>
          <div className="field full">
            <label htmlFor="f-solution">
              {t(locale, "form_solution_label")} <span className="req">*</span>
            </label>
            <textarea
              id="f-solution"
              value={solutionDescription}
              onChange={(e) => setSolutionDescription(e.target.value)}
              placeholder={t(locale, "form_solution_placeholder")}
            />
          </div>
          <div className="field full">
            <label htmlFor="f-current-map">
              {t(locale, "form_current_process_label")} <span className="optional-tag">{t(locale, "optional_tag")}</span>
            </label>
            <textarea
              id="f-current-map"
              style={{ minHeight: "80px" }}
              value={currentProcessMap}
              onChange={(e) => setCurrentProcessMap(e.target.value)}
              placeholder={t(locale, "form_current_process_placeholder")}
            />
          </div>
          <div className="field full">
            <label htmlFor="f-proposed-map">
              {t(locale, "form_proposed_process_label")}{" "}
              <span className="optional-tag">{t(locale, "optional_tag")}</span>
            </label>
            <textarea
              id="f-proposed-map"
              style={{ minHeight: "80px" }}
              value={proposedProcessMap}
              onChange={(e) => setProposedProcessMap(e.target.value)}
              placeholder={t(locale, "form_proposed_process_placeholder")}
            />
          </div>
          <div className="field full">
            <label htmlFor="f-impact">
              {t(locale, "form_impact_label")} <span className="optional-tag">{t(locale, "optional_tag")}</span>
            </label>
            <textarea
              id="f-impact"
              style={{ minHeight: "80px" }}
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder={t(locale, "form_impact_placeholder")}
            />
          </div>
        </div>
      </div>

      {/* ---- পাইলট ও বাস্তবায়ন / Pilot & Implementation ---- */}
      <div className="form-section">
        <div className="form-section-title">
          {t(locale, "section_pilot")} <span className="optional-tag">{t(locale, "optional_tag")}</span>
        </div>
        <div className="form-grid" style={{ padding: 0 }}>
          <div className="field">
            <label htmlFor="f-pilot">{t(locale, "form_pilot_location_label")}</label>
            <input id="f-pilot" value={pilotLocation} onChange={(e) => setPilotLocation(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="f-timeline">{t(locale, "form_implementation_time_label")}</label>
            <input
              id="f-timeline"
              value={implementationTimeline}
              onChange={(e) => setImplementationTimeline(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ---- টিম সদস্য / Team Members ---- */}
      <div className="form-section">
        <div className="form-section-title">
          {t(locale, "section_team")} <span className="optional-tag">{t(locale, "optional_tag")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="team-card">
            <div className="team-card-head">{t(locale, "team_leader")}</div>
            <div className="form-subgrid">
              <div className="field">
                <label>{t(locale, "team_field_name")}</label>
                <input value={leader.name} onChange={(e) => updateLeader("name", e.target.value)} />
              </div>
              <div className="field">
                <label>{t(locale, "team_field_designation")}</label>
                <input value={leader.designation} onChange={(e) => updateLeader("designation", e.target.value)} />
              </div>
              <div className="field">
                <label>{t(locale, "team_field_address")}</label>
                <input value={leader.address} onChange={(e) => updateLeader("address", e.target.value)} />
              </div>
              <div className="field">
                <label>{t(locale, "team_field_mobile")}</label>
                <input value={leader.mobile} onChange={(e) => updateLeader("mobile", e.target.value)} />
              </div>
              <div className="field full">
                <label>{t(locale, "team_field_email")}</label>
                <input value={leader.email} onChange={(e) => updateLeader("email", e.target.value)} />
              </div>
            </div>
          </div>

          {members.map((m, i) => (
            <div className="team-card" key={i}>
              <div className="team-card-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{t(locale, "team_member_n").replace("{n}", String(i + 1))}</span>
                <button type="button" className="btn btn-outline btn-sm btn-danger" onClick={() => removeMember(i)}>
                  {t(locale, "team_remove_member")}
                </button>
              </div>
              <div className="form-subgrid">
                <div className="field">
                  <label>{t(locale, "team_field_name")}</label>
                  <input value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} />
                </div>
                <div className="field">
                  <label>{t(locale, "team_field_designation")}</label>
                  <input value={m.designation} onChange={(e) => updateMember(i, "designation", e.target.value)} />
                </div>
                <div className="field">
                  <label>{t(locale, "team_field_address")}</label>
                  <input value={m.address} onChange={(e) => updateMember(i, "address", e.target.value)} />
                </div>
                <div className="field">
                  <label>{t(locale, "team_field_mobile")}</label>
                  <input value={m.mobile} onChange={(e) => updateMember(i, "mobile", e.target.value)} />
                </div>
                <div className="field full">
                  <label>{t(locale, "team_field_email")}</label>
                  <input value={m.email} onChange={(e) => updateMember(i, "email", e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <div>
            <button type="button" className="btn btn-outline btn-sm" onClick={addMember}>
              {t(locale, "team_add_member")}
            </button>
          </div>
        </div>
      </div>

      {/* ---- প্রয়োজনীয় রিসোর্স / Required Resources ---- */}
      <div className="form-section">
        <div className="form-section-title">
          {t(locale, "section_resources")} <span className="optional-tag">{t(locale, "optional_tag")}</span>
        </div>
        <div className="form-grid" style={{ padding: 0 }}>
          <div className="field">
            <label htmlFor="f-res-financial">{t(locale, "form_resource_financial_label")}</label>
            <input id="f-res-financial" value={resourceFinancial} onChange={(e) => setResourceFinancial(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="f-res-manpower">{t(locale, "form_resource_manpower_label")}</label>
            <input id="f-res-manpower" value={resourceManpower} onChange={(e) => setResourceManpower(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="f-res-technical">{t(locale, "form_resource_technical_label")}</label>
            <input id="f-res-technical" value={resourceTechnical} onChange={(e) => setResourceTechnical(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="f-res-other">{t(locale, "form_resource_other_label")}</label>
            <input id="f-res-other" value={resourceOther} onChange={(e) => setResourceOther(e.target.value)} />
          </div>
          <div className="field full">
            <label htmlFor="f-res-source">{t(locale, "form_resource_source_label")}</label>
            <input id="f-res-source" value={resourceSource} onChange={(e) => setResourceSource(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ---- কর্মপরিকল্পনা / Work Plan ---- */}
      <div className="form-section">
        <div className="form-section-title">
          {t(locale, "section_work_plan")} <span className="optional-tag">{t(locale, "optional_tag")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {workPlan.map((row, i) => (
            <div className="workplan-row" key={i}>
              <div className="workplan-row-head">
                <span>#{i + 1}</span>
                {workPlan.length > 1 && (
                  <button type="button" className="btn btn-outline btn-sm btn-danger" onClick={() => removeWorkPlanRow(i)}>
                    {t(locale, "work_plan_remove_row")}
                  </button>
                )}
              </div>
              <div className="workplan-grid">
                <div className="field full">
                  <label>{t(locale, "work_plan_task")}</label>
                  <textarea style={{ minHeight: "60px" }} value={row.task} onChange={(e) => updateWorkPlan(i, "task", e.target.value)} />
                </div>
                <div className="field">
                  <label>{t(locale, "work_plan_who")}</label>
                  <input value={row.who} onChange={(e) => updateWorkPlan(i, "who", e.target.value)} />
                </div>
                <div className="field">
                  <label>{t(locale, "work_plan_timeline")}</label>
                  <input value={row.timeline} onChange={(e) => updateWorkPlan(i, "timeline", e.target.value)} />
                </div>
                <div className="field full">
                  <label>{t(locale, "work_plan_risk")}</label>
                  <input value={row.risk} onChange={(e) => updateWorkPlan(i, "risk", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <div>
            <button type="button" className="btn btn-outline btn-sm" onClick={addWorkPlanRow}>
              {t(locale, "work_plan_add_row")}
            </button>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-green" disabled={loading}>
          {loading ? t(locale, "submit_button_loading") : t(locale, "submit_button")}
        </button>
        {msg && <span className={`form-msg${msg.error ? " error" : ""}`}>{msg.text}</span>}
      </div>
    </form>
  );
}
