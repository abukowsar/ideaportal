"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { t, type DictKey } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { formatNumber } from "@/lib/i18n/vocab";
import {
  costTotal,
  dppChecklist,
  formatLakh,
  fundTotal,
  lineTotal,
  monthsBetween,
  type DppCostItem,
  type DppData,
  type DppStatus,
} from "@/lib/dpp";
import { reopenDpp, saveDpp } from "@/lib/dppActions";
import Icon from "@/components/Icon";

type TextKey = Exclude<
  keyof DppData,
  "costItems" | "fundGob" | "fundOwn" | "fundOther"
>;
const EMPTY_ITEM: DppCostItem = { item: "", unit: "থোক", qty: 1, unitCost: 0 };

export default function DppEditor({
  ideaId,
  initial,
  initialStatus,
  isNew,
  locale,
  printHref,
}: {
  ideaId: string;
  initial: DppData;
  initialStatus: DppStatus | null;
  isNew: boolean;
  locale: Locale;
  printHref: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<DppData>(initial);
  const [status, setStatus] = useState<DppStatus | null>(initialStatus);
  const [dirty, setDirty] = useState(isNew);
  const [busy, setBusy] = useState<"save" | "final" | "reopen" | null>(null);
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(
    null,
  );
  const locked = status === "READY";

  const checks = useMemo(() => dppChecklist(data), [data]);
  const done = checks.filter((c) => c.ok).length;
  const total = costTotal(data.costItems);
  const funded = fundTotal(data);
  const gap = Math.round((total - funded) * 100) / 100;
  const months = monthsBetween(data.implStart, data.implEnd);
  const n = (v: number | string) => formatNumber(v, locale);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function patch(p: Partial<DppData>) {
    setData((prev) => ({ ...prev, ...p }));
    setDirty(true);
    setMsg(null);
  }

  function setItem(i: number, p: Partial<DppCostItem>) {
    patch({
      costItems: data.costItems.map((c, j) => (j === i ? { ...c, ...p } : c)),
    });
  }

  async function save(finalize: boolean) {
    setBusy(finalize ? "final" : "save");
    setMsg(null);
    const res = await saveDpp(ideaId, data, finalize);
    setBusy(null);
    if (!res.ok) {
      setMsg({ text: res.error, error: true });
      return;
    }
    setStatus(res.status);
    setDirty(false);
    setMsg({ text: t(locale, finalize ? "dpp_finalized" : "dpp_saved") });
    router.refresh();
  }

  async function reopen() {
    setBusy("reopen");
    const res = await reopenDpp(ideaId);
    setBusy(null);
    if (!res.ok) {
      setMsg({ text: res.error, error: true });
      return;
    }
    setStatus("DRAFT");
    setMsg(null);
    router.refresh();
  }

  const text = (
    key: TextKey,
    label: DictKey,
    opts: { area?: boolean; rows?: number; full?: boolean } = {},
  ) => (
    <div className={`field${opts.full === false ? "" : " full"}`}>
      <label htmlFor={`dpp-${key}`}>{t(locale, label)}</label>
      {opts.area ? (
        <textarea
          id={`dpp-${key}`}
          rows={opts.rows ?? 4}
          value={data[key]}
          onChange={(e) => patch({ [key]: e.target.value })}
        />
      ) : (
        <input
          id={`dpp-${key}`}
          value={data[key]}
          onChange={(e) => patch({ [key]: e.target.value })}
        />
      )}
    </div>
  );

  const money = (key: "fundGob" | "fundOwn" | "fundOther", label: DictKey) => (
    <div className="field">
      <label htmlFor={`dpp-${key}`}>{t(locale, label)}</label>
      <input
        id={`dpp-${key}`}
        type="number"
        min={0}
        step="0.01"
        inputMode="decimal"
        value={data[key] || ""}
        placeholder="0"
        onChange={(e) => patch({ [key]: Number(e.target.value) || 0 })}
      />
    </div>
  );

  return (
    <div className="dpp-wrap">
      <div className="dpp-layout">
        <fieldset className="dpp-form" disabled={locked || busy !== null}>
          {locked && (
            <div className="dpp-note is-locked">
              <Icon name="lock" size={16} /> {t(locale, "dpp_locked_note")}
            </div>
          )}

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_identity")}</h3>
            <div className="form-grid">
              {text("projectName", "dpp_f_project_name")}
              {text("projectNameEn", "dpp_f_project_name_en")}
              {text("sponsoringMinistry", "dpp_f_ministry", { full: false })}
              {text("executingAgency", "dpp_f_agency", { full: false })}
            </div>
          </section>

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_period")}</h3>
            <div className="form-grid">
              {text("location", "dpp_f_location")}
              <div className="field">
                <label htmlFor="dpp-implStart">
                  {t(locale, "dpp_f_start")}
                </label>
                <input
                  id="dpp-implStart"
                  type="month"
                  value={data.implStart}
                  onChange={(e) => patch({ implStart: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="dpp-implEnd">{t(locale, "dpp_f_end")}</label>
                <input
                  id="dpp-implEnd"
                  type="month"
                  min={data.implStart || undefined}
                  value={data.implEnd}
                  onChange={(e) => patch({ implEnd: e.target.value })}
                />
                {months && (
                  <span className="hint">
                    {t(locale, "dpp_f_duration")}:{" "}
                    {t(locale, "dpp_months").replace("{n}", n(months))}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_background")}</h3>
            <div className="form-grid">
              {text("background", "dpp_f_background", { area: true, rows: 6 })}
              {text("objectives", "dpp_f_objectives", { area: true })}
              {text("planAlignment", "dpp_f_alignment", {
                area: true,
                rows: 3,
              })}
            </div>
          </section>

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_activities")}</h3>
            <div className="form-grid">
              {text("activities", "dpp_f_activities", { area: true, rows: 5 })}
              {text("outputs", "dpp_f_outputs", { area: true })}
            </div>
          </section>

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_cost")}</h3>
            <div className="dpp-cost">
              <div className="dpp-cost-row dpp-cost-head" aria-hidden="true">
                <span>{t(locale, "dpp_c_item")}</span>
                <span>{t(locale, "dpp_c_unit")}</span>
                <span>{t(locale, "dpp_c_qty")}</span>
                <span>{t(locale, "dpp_c_unit_cost")}</span>
                <span>{t(locale, "dpp_c_total")}</span>
                <span />
              </div>
              {data.costItems.map((c, i) => (
                <div className="dpp-cost-row" key={i}>
                  <input
                    aria-label={t(locale, "dpp_c_item")}
                    placeholder={t(locale, "dpp_c_item")}
                    value={c.item}
                    onChange={(e) => setItem(i, { item: e.target.value })}
                  />
                  <input
                    aria-label={t(locale, "dpp_c_unit")}
                    value={c.unit}
                    onChange={(e) => setItem(i, { unit: e.target.value })}
                  />
                  <input
                    aria-label={t(locale, "dpp_c_qty")}
                    type="number"
                    min={0}
                    step="any"
                    value={c.qty || ""}
                    onChange={(e) =>
                      setItem(i, { qty: Number(e.target.value) || 0 })
                    }
                  />
                  <input
                    aria-label={t(locale, "dpp_c_unit_cost")}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0"
                    value={c.unitCost || ""}
                    onChange={(e) =>
                      setItem(i, { unitCost: Number(e.target.value) || 0 })
                    }
                  />
                  <span className="dpp-cost-total mono">
                    {formatLakh(lineTotal(c), locale)}
                  </span>
                  <button
                    type="button"
                    className="dpp-icon-btn"
                    aria-label={t(locale, "dpp_c_remove")}
                    title={t(locale, "dpp_c_remove")}
                    disabled={data.costItems.length === 1}
                    onClick={() =>
                      patch({
                        costItems: data.costItems.filter((_, j) => j !== i),
                      })
                    }
                  >
                    <Icon name="x" size={15} />
                  </button>
                </div>
              ))}
              <div className="dpp-cost-foot">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    patch({ costItems: [...data.costItems, { ...EMPTY_ITEM }] })
                  }
                >
                  {t(locale, "dpp_c_add")}
                </button>
                <div className="dpp-grand">
                  <span>{t(locale, "dpp_c_grand")}</span>
                  <b className="mono">
                    {formatLakh(total, locale)} {t(locale, "dpp_lakh")}
                  </b>
                </div>
              </div>
            </div>
          </section>

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_finance")}</h3>
            <div className="form-grid dpp-fund-grid">
              {money("fundGob", "dpp_fund_gob")}
              {money("fundOwn", "dpp_fund_own")}
              {money("fundOther", "dpp_fund_other")}
            </div>
            <div
              className={`dpp-balance${total > 0 && gap === 0 ? " ok" : ""}`}
            >
              <span>
                {t(locale, "dpp_fund_total")}:{" "}
                <b className="mono">{formatLakh(funded, locale)}</b> /{" "}
                <b className="mono">{formatLakh(total, locale)}</b>{" "}
                {t(locale, "dpp_lakh")}
              </span>
              {total > 0 && gap === 0 ? (
                <span>{t(locale, "dpp_fund_balanced")}</span>
              ) : (
                total > 0 && (
                  <>
                    <span>
                      {t(locale, "dpp_fund_gap").replace(
                        "{n}",
                        formatLakh(Math.abs(gap), locale),
                      )}
                    </span>
                    {gap > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() =>
                          patch({
                            fundGob:
                              Math.round((data.fundGob + gap) * 100) / 100,
                          })
                        }
                      >
                        {t(locale, "dpp_fund_fill_gob")}
                      </button>
                    )}
                  </>
                )
              )}
            </div>
          </section>

          <section className="dash-panel dpp-section">
            <h3>{t(locale, "dpp_sec_analysis")}</h3>
            <div className="form-grid">
              {text("feasibility", "dpp_f_feasibility", {
                area: true,
                rows: 3,
              })}
              {text("manpower", "dpp_f_manpower", { area: true, rows: 3 })}
              {text("risks", "dpp_f_risks", { area: true, rows: 3 })}
              {text("sustainability", "dpp_f_sustainability", {
                area: true,
                rows: 3,
              })}
            </div>
          </section>
        </fieldset>

        <aside className="dpp-aside">
          <div className="dash-panel dpp-check">
            <div className="dpp-check-head">
              <h3>{t(locale, "dpp_checklist_title")}</h3>
              <span className="kanban-count">
                {t(locale, "dpp_progress")
                  .replace("{done}", n(done))
                  .replace("{total}", n(checks.length))}
              </span>
            </div>
            <div className="dpp-meter" aria-hidden="true">
              <span style={{ width: `${(done / checks.length) * 100}%` }} />
            </div>
            <ul>
              {checks.map((c) => (
                <li key={c.key} className={c.ok ? "ok" : ""}>
                  <span className="dpp-check-mark" aria-hidden="true">{c.ok && <Icon name="check" size={12} strokeWidth={3} />}</span>
                  {t(locale, c.key)}
                </li>
              ))}
            </ul>
            <div className="dpp-sum">
              <span>{t(locale, "dpp_c_grand")}</span>
              <b className="mono">
                {formatLakh(total, locale)} {t(locale, "dpp_lakh")}
              </b>
            </div>

            <div className="dpp-actions">
              {locked ? (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={busy !== null}
                  onClick={reopen}
                >
                  {busy === "reopen"
                    ? t(locale, "processing")
                    : t(locale, "dpp_reopen")}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={busy !== null}
                    onClick={() => save(false)}
                  >
                    {busy === "save"
                      ? t(locale, "processing")
                      : t(locale, "dpp_save_draft")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-gold btn-sm"
                    disabled={busy !== null || done < checks.length}
                    onClick={() => save(true)}
                  >
                    {busy === "final"
                      ? t(locale, "processing")
                      : t(locale, "dpp_finalize")}
                  </button>
                </>
              )}
              {status && (
                <a
                  className="btn btn-outline btn-sm"
                  href={printHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="printer" size={16} /> {t(locale, "dpp_print")}
                </a>
              )}
            </div>
            {dirty && !msg && !locked && (
              <p className="dpp-dirty">● {t(locale, "dpp_unsaved")}</p>
            )}
            {msg && (
              <p
                className={`form-msg${msg.error ? " error" : ""}`}
                role="status"
              >
                {msg.text}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
