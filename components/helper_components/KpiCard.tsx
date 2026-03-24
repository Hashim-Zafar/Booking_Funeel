import { CardProps } from "@/src/utils/types";
export const KpiCard = ({ title, value, icon, loading }: CardProps) => (
  <div className="kpi-card">
    <div className="kpi-card__header">
      <span className="kpi-card__title">{title}</span>
      <div className="kpi-card__icon">{icon}</div>
    </div>
    {loading ? (
      <div className="kpi-card__skeleton" />
    ) : (
      <span className="kpi-card__value">{value}</span>
    )}
  </div>
);
