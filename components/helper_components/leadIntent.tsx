import { leadIntentProps } from "@/src/utils/types";
import { intentBuckets } from "@/src/utils";
import { getBarShade } from "@/src/utils/helpers";

export default function LeadIntent({ needs, totalRows }: leadIntentProps) {
  const sorted = [...intentBuckets].sort((a, b) => needs[b.key] - needs[a.key]);

  return (
    <div className="insight-card">
      <h3 className="insight-card__title">Lead Intent</h3>

      <div className="flex flex-col gap-2">
        {sorted.map(({ key, label }, i) => {
          const count = needs[key];
          const pct =
            totalRows === 0 ? 0 : Math.round((count / totalRows) * 100);
          const isTop = i === 0;

          return (
            <div
              key={key}
              className="relative w-full rounded-lg overflow-hidden"
              style={{ height: "44px" }}
            >
              {/* background track */}
              <div className="progress-bar_bg" />
              {/* fill bar — z-index 0 */}
              <div
                className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-500 z-0 ${
                  getBarShade(pct) ?? "bg-slate-700"
                }`}
                style={{ width: `${pct}%` }}
              />

              {/* label + pct — z-index 10 so it always sits above the fill */}
              <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
                <span className={`text-[13px] font-semibold text-slate-800`}>
                  {label}
                </span>
                <span
                  className={`text-[13px] font-bold ${isTop ? "text-slate-800" : "text-slate-700"}`}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
