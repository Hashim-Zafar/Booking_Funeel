import { decisionMakerProps } from "@/src/utils/types";

export default function DecisionMakerRate({
  decision,
  totalRows,
}: decisionMakerProps) {
  const decisionPct =
    totalRows === 0
      ? 0
      : Math.round((decision.decisionMaker / totalRows) * 100);

  const isGood = decisionPct >= 50;

  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (decisionPct / 100) * circumference;

  return (
    <div className="insight-card">
      {/* Header */}
      <div className="w-full">
        <p className="text-[10px] tracking-widest font-semibold text-gray-400 uppercase">
          Authority Analysis
        </p>
        <h3 className="text-lg font-semibold text-gray-900 mt-1">
          Decision Maker Rate
        </h3>
      </div>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2}>
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress circle */}
          <circle
            stroke={isGood ? "#10b981" : "#ef4444"}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              transition: "stroke-dashoffset 0.6s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center">
          <span
            className={`text-3xl font-bold ${
              isGood ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {decisionPct}%
          </span>
          <span className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
            Decision Makers
          </span>
        </div>
      </div>

      {/* Insight */}
      <p className="text-sm text-gray-500 text-center">
        {isGood ? "↑ Strong authority presence" : "↓ Low decision authority"}
      </p>
    </div>
  );
}
