interface DecisionData {
  decisionMaker: number;
  needsToBringSomeone: number;
}

interface Props {
  decision: DecisionData;
  totalRows: number;
}

export default function DecisionMakerRate({ decision, totalRows }: Props) {
  const decisionPct =
    totalRows === 0
      ? 0
      : Math.round((decision.decisionMaker / totalRows) * 100);
  const nonDecisionPct = 100 - decisionPct;

  return (
    <div className="insight-card">
      <p className="insight-card__eyebrow">AUTHORITY ANALYSIS</p>
      <h3 className="insight-card__title">Decision Maker Rate</h3>

      <div className="decision-split">
        <div className="decision-split__block decision-split__block--primary">
          <span className="decision-split__pct">{decisionPct}%</span>
          <span className="decision-split__label">DECISION MAKERS</span>
        </div>
        <div className="decision-split__block decision-split__block--secondary">
          <span className="decision-split__pct decision-split__pct--muted">
            {nonDecisionPct}%
          </span>
          <span className="decision-split__label">NON-AUTHORITY</span>
        </div>
      </div>
    </div>
  );
}
