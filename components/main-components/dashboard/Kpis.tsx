"use client";

import { useEffect, useState } from "react";
import { KpiCardsProps, KpiData } from "@/src/utils/types";
import { KpiCard } from "@/components/helper_components/KpiCard";
import { LeadsIcon } from "@/components/helper_components/LeadsIcon";
import { BookedIcon } from "@/components/helper_components/BookedIcon";
import { QualifiedIcon } from "@/components/helper_components/QualifiedIcon";
import { AttendedIcon } from "@/components/helper_components/AttendedIcon";

// ------- main component -------
export default function KpiCards({ startDate }: KpiCardsProps) {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //call the API
  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard/KPIS?start_date=${startDate}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch KPIs");
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [startDate]);
  //calculate percentage
  const qualifiedPct = data
    ? data.totalLeads === 0
      ? "0%"
      : `${((data.qualifiedLeads / data.totalLeads) * 100).toFixed(0)}%`
    : "0%";

  const attendedPct = data
    ? data.totalAppointments === 0
      ? "0%"
      : `${((data.attendedAppointments / data.totalAppointments) * 100).toFixed(0)}%`
    : "0%";
  //define cards
  const cards = [
    { title: "Total Leads", value: data?.totalLeads ?? 0, icon: <LeadsIcon /> },
    { title: "Qualified %", value: qualifiedPct, icon: <QualifiedIcon /> },
    {
      title: "Booked Calls",
      value: data?.bookedAppointments ?? 0,
      icon: <BookedIcon />,
    },
    { title: "Attended %", value: attendedPct, icon: <AttendedIcon /> },
  ];
  //!guard clause
  if (error) {
    return <div className="kpi-error">Failed to load KPIs: {error}</div>;
  }
  //map over the cards and render the layout
  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          loading={loading}
        />
      ))}
    </div>
  );
}
