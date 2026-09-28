import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { formatNumber, districtLabel } from "@/lib/i18n/vocab";
import { formatDate } from "@/lib/i18n/time";
import type { IdeaView } from "@/lib/ideaFormat";
import { costTotal, formatLakh, formatMonth, fundTotal, lineTotal, monthsBetween, type DppView } from "@/lib/dpp";

function Text({ value }: { value: string | null | undefined }) {
  return <div className="print-text">{value?.trim() ? value : "—"}</div>;
}

/** The DPP in its official table layout — shared by the print page and the read-only view. */
export default function DppDocument({ idea, dpp, locale }: { idea: IdeaView; dpp: DppView; locale: Locale }) {
  const total = costTotal(dpp.costItems);
  const months = monthsBetween(dpp.implStart, dpp.implEnd);
  const lakh = (n: number) => formatLakh(n, locale);
  const share = (n: number) => (total > 0 ? `${formatNumber(((n / total) * 100).toFixed(1), locale)}%` : "—");

  return (
    <article className={`print-sheet dpp-sheet${dpp.status === "DRAFT" ? " is-draft" : ""}`}>
      {dpp.status === "DRAFT" && <div className="dpp-watermark">{t(locale, "dpp_print_draft_mark")}</div>}
      <div className="print-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="DoICT" />
        <div>
          <div className="gov">{t(locale, "hero_gov_line")}</div>
          <h1>{t(locale, "dpp_print_title")}</h1>
          <div className="dpp-part">{t(locale, "dpp_print_part")}</div>
        </div>
        <div className="docket mono">{idea.docket}</div>
      </div>

      <div className="print-meta">
        <div>
          <b>{t(locale, "dpp_source_idea")}</b>
          {idea.title}
        </div>
        <div>
          <b>{t(locale, "form_district_label")}</b>
          {districtLabel(idea.district, locale)}
          {idea.upazila ? ` · ${idea.upazila}` : ""}
        </div>
        <div>
          <b>{t(locale, "dpp_prepared_by")}</b>
          {dpp.preparedByName ?? "—"}
        </div>
        <div>
          <b>{dpp.finalizedAt ? t(locale, "dpp_finalized_on") : t(locale, "dpp_last_saved")}</b>
          {formatDate(dpp.finalizedAt ?? dpp.updatedAt, locale)}
        </div>
      </div>

      <table className="print-table">
        <tbody>
          <tr>
            <th>{t(locale, "dpp_f_project_name")}</th>
            <td>
              <Text value={dpp.projectName} />
            </td>
          </tr>
          {dpp.projectNameEn && (
            <tr>
              <th>{t(locale, "dpp_f_project_name_en")}</th>
              <td>
                <Text value={dpp.projectNameEn} />
              </td>
            </tr>
          )}
          <tr>
            <th>{t(locale, "dpp_f_ministry")}</th>
            <td>
              <Text value={dpp.sponsoringMinistry} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_agency")}</th>
            <td>
              <Text value={dpp.executingAgency} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_location")}</th>
            <td>
              <Text value={dpp.location} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_period")}</th>
            <td>
              {formatMonth(dpp.implStart, locale)} — {formatMonth(dpp.implEnd, locale)}
              {months && ` (${t(locale, "dpp_months").replace("{n}", formatNumber(months, locale))})`}
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_background")}</th>
            <td>
              <Text value={dpp.background} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_objectives")}</th>
            <td>
              <Text value={dpp.objectives} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_alignment")}</th>
            <td>
              <Text value={dpp.planAlignment} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_activities")}</th>
            <td>
              <Text value={dpp.activities} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_outputs")}</th>
            <td>
              <Text value={dpp.outputs} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_sec_cost").replace(/^\S+\s/, "")}</th>
            <td>
              <table className="print-inner">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t(locale, "dpp_c_item")}</th>
                    <th>{t(locale, "dpp_c_unit")}</th>
                    <th className="num">{t(locale, "dpp_c_qty")}</th>
                    <th className="num">{t(locale, "dpp_c_unit_cost")}</th>
                    <th className="num">{t(locale, "dpp_c_total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dpp.costItems.map((c, i) => (
                    <tr key={i}>
                      <td>{formatNumber(i + 1, locale)}</td>
                      <td>{c.item}</td>
                      <td>{c.unit}</td>
                      <td className="num">{formatNumber(c.qty, locale)}</td>
                      <td className="num">{lakh(c.unitCost)}</td>
                      <td className="num">{lakh(lineTotal(c))}</td>
                    </tr>
                  ))}
                  <tr className="dpp-total-row">
                    <td colSpan={5}>{t(locale, "dpp_c_grand")}</td>
                    <td className="num">{lakh(total)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_sec_finance").replace(/^\S+\s/, "")}</th>
            <td>
              <table className="print-inner">
                <tbody>
                  {(
                    [
                      ["dpp_fund_gob", dpp.fundGob],
                      ["dpp_fund_own", dpp.fundOwn],
                      ["dpp_fund_other", dpp.fundOther],
                    ] as const
                  ).map(([key, v]) => (
                    <tr key={key}>
                      <td>{t(locale, key)}</td>
                      <td className="num">{lakh(v)}</td>
                      <td className="num">{share(v)}</td>
                    </tr>
                  ))}
                  <tr className="dpp-total-row">
                    <td>{t(locale, "dpp_fund_total")}</td>
                    <td className="num">{lakh(fundTotal(dpp))}</td>
                    <td className="num">{share(fundTotal(dpp))}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_feasibility")}</th>
            <td>
              <Text value={dpp.feasibility} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_manpower")}</th>
            <td>
              <Text value={dpp.manpower} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_risks")}</th>
            <td>
              <Text value={dpp.risks} />
            </td>
          </tr>
          <tr>
            <th>{t(locale, "dpp_f_sustainability")}</th>
            <td>
              <Text value={dpp.sustainability} />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="print-foot">
        <span className="mono">{idea.docket} · DPP</span>
        <span className="print-sign">{t(locale, "print_signature")}</span>
      </div>
    </article>
  );
}
