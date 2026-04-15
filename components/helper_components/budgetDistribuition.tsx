import { getBarShade } from "@/src/utils/helpers";
import { budgetDistribuitionProps } from "@/src/utils/types";
import { buckets, tierTextColor, tierLabel, calloutBg } from "@/src/utils";

export default function BudgetDistribution({
  budget,
  totalRows,
}: budgetDistribuitionProps) {
  const bucketsWithPct = buckets.map((b) => ({
    ...b,
    count: budget[b.key],
    pct: totalRows === 0 ? 0 : Math.round((budget[b.key] / totalRows) * 100),
  }));
  const topBucket = bucketsWithPct.reduce((prev, curr) =>
    curr.pct > prev.pct ? curr : prev,
  );

  return (
    <div className="insight-card">
      <p className="insight-card__eyebrow">FINANCIAL TIERING</p>

      <div className="insight-card__header-row">
        <h3 className="insight-card__title">Budget Distribution</h3>
        <div className="insight-card__highlight">
          <span
            className="insight-card__highlight-pct"
            style={{ color: tierTextColor[topBucket.tier] }}
          >
            {topBucket.pct}%
          </span>
          <span className="insight-card__highlight-label">
            {tierLabel[topBucket.tier]}
          </span>
        </div>
      </div>

      <div className="budget-bars">
        {bucketsWithPct.map(({ key, label, pct }) => (
          <div key={key} className="budget-bar__item">
            <div className="budget-bar__top-row">
              <span className="budget-bar__label">{label}</span>
              <span className="budget-bar__pct">{pct}%</span>
            </div>
            <div className="budget-bar__track">
              <div
                className={`budget-bar__fill ${getBarShade(pct)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="insight-card__callout"
        style={{
          color: tierTextColor[topBucket.tier],
          background: calloutBg[topBucket.tier],
        }}
      >
        <span className="insight-card__callout-icon">↗</span>
        <span>
          {topBucket.pct}% of leads have a budget in the{" "}
          <strong>{topBucket.label}</strong> range
        </span>
      </div>
    </div>
  );
}
