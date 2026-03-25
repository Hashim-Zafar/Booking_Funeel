interface TimelineData {
  asap: number;
  oneToTwoWeeks: number;
  thisMonth: number;
}

interface Props {
  startTimeline: TimelineData;
  totalRows: number;
}

const timelineBuckets = [
  { key: "asap", label: "IMMEDIATE" },
  { key: "oneToTwoWeeks", label: "1–3 MONTHS" },
  { key: "thisMonth", label: "3+ MONTHS" },
] as const;

export default function ReadinessTimeline({ startTimeline, totalRows }: Props) {
  return (
    <div className="insight-card">
      <h3 className="insight-card__title">Readiness Timeline</h3>

      <div className="timeline-bars">
        {timelineBuckets.map(({ key, label }, i) => {
          const count = startTimeline[key];
          const pct =
            totalRows === 0 ? 0 : Math.round((count / totalRows) * 100);
          const isFirst = i === 0;

          return (
            <div key={key} className="timeline-col">
              <div className="timeline-col__track">
                <div
                  className={`timeline-col__fill ${isFirst ? "timeline-col__fill--active" : ""}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="timeline-col__label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
