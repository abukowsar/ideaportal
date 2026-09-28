"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";

export type BarDatum = { label: string; value: number; color: string };
export type TrendPoint = { label: string; value: number };

function BarList({
  title,
  data,
  showLegend,
  locale,
}: {
  title: string;
  data: BarDatum[];
  showLegend?: boolean;
  locale: Locale;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-card">
      <h4 className="chart-title">{title}</h4>
      {showLegend && (
        <div className="chart-legend">
          {data.map((d) => (
            <span className="chart-legend-item" key={d.label}>
              <i style={{ background: d.color }} aria-hidden="true" />
              {d.label}
            </span>
          ))}
        </div>
      )}
      <div className="bar-list">
        {data.map((d, i) => {
          const pct = max ? (d.value / max) * 100 : 0;
          const share = total ? Math.round((d.value / total) * 100) : 0;
          return (
            <div
              className={`bar-row${hover === i ? " hover" : ""}`}
              key={d.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            >
              <span className="bar-label">{d.label}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${pct}%`, background: d.color }} />
              </span>
              <span className="bar-value mono">{formatNumber(d.value, locale)}</span>
              {hover === i && total > 0 && (
                <span className="chart-tooltip">
                  {t(locale, "chart_bar_tooltip")
                    .replace("{label}", d.label)
                    .replace("{value}", formatNumber(d.value, locale))
                    .replace("{share}", formatNumber(share, locale))}
                </span>
              )}
            </div>
          );
        })}
        {data.length === 0 && <div className="kanban-empty">{t(locale, "chart_no_data")}</div>}
      </div>
    </div>
  );
}

function TrendChart({ data, locale }: { data: TrendPoint[]; locale: Locale }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = 220;
  const padL = 34;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: padL + step * i,
    y: padT + innerH - (d.value / max) * innerH,
    ...d,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${padT + innerH} L${points[0].x.toFixed(1)},${padT + innerH} Z`
      : "";
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));

  return (
    <div className="chart-card">
      <h4 className="chart-title">{t(locale, "chart_trend_title")}</h4>
      <div className="trend-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="trend-svg" role="img" aria-label={t(locale, "chart_trend_title")}>
          {ticks.map((tick, i) => {
            const y = padT + innerH - (tick / max) * innerH;
            return (
              <g key={i}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} className="grid-line" />
                <text x={padL - 8} y={y + 4} className="axis-text" textAnchor="end">
                  {formatNumber(tick, locale)}
                </text>
              </g>
            );
          })}
          {areaPath && <path d={areaPath} fill="#c9842022" stroke="none" />}
          <path d={linePath} fill="none" stroke="#c98420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hover === i ? 7 : 5}
                fill="#c98420"
                stroke="#fffdf7"
                strokeWidth="2"
                style={{ transition: "r .15s ease", cursor: "pointer" }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                style={{ cursor: "pointer" }}
              />
              <text x={p.x} y={H - 8} className="axis-text" textAnchor="middle">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        {hover !== null && (
          <div className="chart-tooltip trend-tooltip" style={{ left: `${(points[hover].x / W) * 100}%` }}>
            {t(locale, "chart_trend_tooltip")
              .replace("{label}", points[hover].label)
              .replace("{value}", formatNumber(points[hover].value, locale))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Charts({
  status,
  district,
  category,
  trend,
  locale,
}: {
  status: BarDatum[];
  district: BarDatum[];
  category: BarDatum[];
  trend: TrendPoint[];
  locale: Locale;
}) {
  return (
    <div className="viz-grid">
      <BarList title={t(locale, "chart_status_title")} data={status} showLegend locale={locale} />
      <TrendChart data={trend} locale={locale} />
      <BarList title={t(locale, "chart_district_title")} data={district} locale={locale} />
      <BarList title={t(locale, "chart_category_title")} data={category} locale={locale} />
    </div>
  );
}
