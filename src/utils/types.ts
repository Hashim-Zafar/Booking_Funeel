export type WeeklyWindow = {
  weekday: number; // Luxon: 1=Mon ... 7=Sun
  startHM: string; // "10:00"
  endHM: string; // "18:00"
};

export interface KpiData {
  totalLeads: number;
  qualifiedLeads: number;
  totalAppointments: number;
  bookedAppointments: number;
  attendedAppointments: number;
}

export interface KpiCardsProps {
  startDate: string;
}

export interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}
