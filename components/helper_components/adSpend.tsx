import { getBarShade } from "@/src/utils/helpers";
import { adSpendDistributionProps } from "@/src/utils/types";

const adSpendBuckets = [
  { key: "s10000Plus", label: "$10,000+", tier: 1 },
  { key: "s2000_10000", label: "$2,000 – $10,000", tier: 2 },
  { key: "s500_2000", label: "$500 – $2,000", tier: 3 },
  { key: "s1_500", label: "$1 – $500", tier: 4 },
  { key: "zero", label: "No Spend", tier: 5 },
] as const;

const tierTextColor: Record<number, string> = {
  1: "var(--dash-success)",
  2: "#3b82f6",
  3: "#f59e0b",
  4: "#f59e0b",
  5: "#ef4444",
};

const tierLabel: Record<number, string> = {
  1: "TIER 1 RATIO",
  2: "TIER 2 RATIO",
  3: "TIER 3 RATIO",
  4: "TIER 4 RATIO",
  5: "TIER 5 RATIO",
};

const calloutBg: Record<number, string> = {
  1: "#d1fae5",
  2: "#dbeafe",
  3: "#fef3c7",
  4: "#fef3c7",
  5: "#fee2e2",
};

export default function AdSpendDistribution({
  adSpend,
  totalRows,
}: adSpendDistributionProps) {
  const bucketsWithPct = adSpendBuckets.map((b) => ({
    ...b,
    count: adSpend[b.key],
    pct: totalRows === 0 ? 0 : Math.round((adSpend[b.key] / totalRows) * 100),
  }));

  const topBucket = bucketsWithPct.reduce((prev, curr) =>
    curr.pct > prev.pct ? curr : prev,
  );

  return (
    <div className="insight-card">
      <p className="insight-card__eyebrow">AD SPEND ANALYSIS</p>

      <div className="insight-card__header-row">
        <h3 className="insight-card__title">Ad Spend Distribution</h3>
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
          {topBucket.pct}% of leads spend in the{" "}
          <strong>{topBucket.label}</strong> range
        </span>
      </div>
    </div>
  );
}
