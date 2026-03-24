import KpiCards from "@/components/main-components/dashboard/Kpis";
import UpcomingCalls from "@/components/main-components/dashboard/upcomingCalls";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto mt-10">
      <UpcomingCalls />
    </div>
  );
}
