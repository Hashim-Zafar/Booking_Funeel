// app/dashboard/page.tsx
import { Suspense } from "react";
import LeadInsights from "@/components/main-components/dashboard/leadInsight";
import Skeleton from "@/components/helper_components/skeleton";
import KpiCards from "@/components/main-components/dashboard/Kpis";
import UpcomingCalls from "@/components/main-components/dashboard/upcomingCalls";

export default function DashboardPage() {
  const start_Date = "2026-02-22T00:00:00.000Z";

  return (
    <div className="dash-page">
      <Suspense fallback={<Skeleton />}>
        <KpiCards startDate={start_Date} />
        <UpcomingCalls />
        <LeadInsights startDate={start_Date} />
      </Suspense>
    </div>
  );
}
