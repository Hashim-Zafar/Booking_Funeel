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

export interface LeadQualityData {
  totalRows: number;
  budget: {
    lt300: number;
    b300_800: number;
    b800_2000: number;
    b2000_5000: number;
    b5000Plus: number;
  };
  decision: {
    decisionMaker: number;
    needsToBringSomeone: number;
  };
  adSpend: {
    zero: number;
    s1_500: number;
    s500_2000: number;
    s2000_10000: number;
    s10000Plus: number;
  };
  startTimeline: {
    asap: number;
    oneToTwoWeeks: number;
    thisMonth: number;
  };
  needs: {
    adCreatives: number;
    ugc: number;
    brandVideo: number;
    notSure: number;
  };
}

export interface leadInsightProps {
  startDate: string;
}

export interface BudgetData {
  lt300: number;
  b300_800: number;
  b800_2000: number;
  b2000_5000: number;
  b5000Plus: number;
}

export interface budgetDistribuitionProps {
  budget: BudgetData;
  totalRows: number;
}

export interface error {
  success: boolean;
  error: string;
}

export interface DecisionData {
  decisionMaker: number;
  needsToBringSomeone: number;
}

export interface decisionMakerProps {
  decision: DecisionData;
  totalRows: number;
}

export interface NeedsData {
  adCreatives: number;
  ugc: number;
  brandVideo: number;
  notSure: number;
}

export interface leadIntentProps {
  needs: NeedsData;
  totalRows: number;
}

export interface TimelineData {
  asap: number;
  oneToTwoWeeks: number;
  thisMonth: number;
}

export interface readinessTimelineProps {
  startTimeline: TimelineData;
  totalRows: number;
}

export interface AdSpendData {
  zero: number;
  s1_500: number;
  s500_2000: number;
  s2000_10000: number;
  s10000Plus: number;
}

export interface adSpendDistributionProps {
  adSpend: AdSpendData;
  totalRows: number;
}
