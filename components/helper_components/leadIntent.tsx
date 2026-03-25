interface NeedsData {
  adCreatives: number;
  ugc: number;
  brandVideo: number;
  notSure: number;
}

interface Props {
  needs: NeedsData;
  totalRows: number;
}

const intentBuckets = [
  { key: "adCreatives", label: "Ad Creatives" },
  { key: "ugc", label: "UGC Content" },
  { key: "brandVideo", label: "Brand Video" },
  { key: "notSure", label: "Not Sure" },
] as const;

export default function LeadIntent({ needs, totalRows }: Props) {
  // sort by count descending so highest intent shows first
  const sorted = [...intentBuckets].sort((a, b) => needs[b.key] - needs[a.key]);

  return (
    <div className="insight-card">
      <h3 className="insight-card__title">Lead Intent</h3>

      <div className="intent-list">
        {sorted.map(({ key, label }, i) => {
          const count = needs[key];
          const pct =
            totalRows === 0 ? 0 : Math.round((count / totalRows) * 100);
          const isTop = i === 0;

          return (
            <div
              key={key}
              className={`intent-row ${isTop ? "intent-row--active" : ""}`}
            >
              <span className="intent-row__label">{label}</span>
              <span className="intent-row__pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
