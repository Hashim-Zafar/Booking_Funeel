import { readinessTimelineProps } from "@/src/utils/types";
import { timelineBuckets } from "@/src/utils";
import { getBarShade } from "@/src/utils/helpers";
export default function ReadinessTimeline({
  startTimeline,
  totalRows,
}: readinessTimelineProps) {
  const bucketsWithPct = timelineBuckets.map(({ key, label }) => ({
    key,
    label,
    pct:
      totalRows === 0 ? 0 : Math.round((startTimeline[key] / totalRows) * 100),
  }));

  const topBucket = bucketsWithPct.reduce((prev, curr) =>
    curr.pct > prev.pct ? curr : prev,
  );

  return (
    <div className="insight-card">
      <h3 className="insight-card__title">Readiness Timeline</h3>

      {/* bar chart */}
      <div className="flex items-end justify-between gap-3 h-42">
        {bucketsWithPct.map(({ key, label, pct }) => {
          const isTop = key === topBucket.key;

          return (
            <div key={key} className="flex flex-col items-center gap-2 flex-1">
              {/* percentage above bar */}
              <span className={`text-xs font-bold  text-emerald-600  `}>
                {pct}%
              </span>

              {/* bar container — fixed height, bar grows from bottom */}
              <div
                className="w-full flex items-end bg-slate-100 rounded-lg overflow-hidden"
                style={{ height: "92px" }}
              >
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${getBarShade(
                    pct,
                  )}`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>

              {/* label below bar */}
              <span
                className={`text-[11px] font-semibold tracking-wide text-center leading-tight ${
                  isTop ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
