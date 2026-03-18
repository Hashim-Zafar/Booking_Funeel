"use client";
import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  DollarSign,
  Filter,
  PhoneCall,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Activity,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type KPI = {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
};

type FunnelStep = {
  step: string;
  value: number;
  conversion: string;
  width: string;
};

type ProgressItem = {
  label: string;
  value: number;
};

type BreakdownGroup = {
  title: string;
  items: ProgressItem[];
};

type CallAnswerKey =
  | "service"
  | "timeline"
  | "currentProblem"
  | "adSpend"
  | "need";

type UpcomingCall = {
  id: number;
  day: "Today" | "Tomorrow";
  time: string;
  name: string;
  budget: string;
  decision: string;
  status: "Qualified" | "Needs attention";
  indicator: "✅" | "⚠️";
  meetingLink: string;
  answers: Record<CallAnswerKey, string>;
};

type ActivityType = "success" | "info" | "danger";

type ActivityItem = {
  type: ActivityType;
  time: string;
  text: string;
};

type TrendPoint = {
  name: string;
  leads: number;
  qualified: number;
  bookings: number;
};

type TrendView = "daily" | "weekly" | "monthly";

type TrendData = Record<TrendView, TrendPoint[]>;

type GroupedCalls = Record<UpcomingCall["day"], UpcomingCall[]>;

type CardProps = {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

type MetricCardProps = KPI;

type ProgressRowsProps = {
  items: ProgressItem[];
};

const kpis: KPI[] = [
  {
    title: "Total Leads",
    value: "124",
    sub: "+12.4% vs last month",
    icon: Users,
  },
  {
    title: "Qualified %",
    value: "68%",
    sub: "306 of 450 submissions",
    icon: Target,
  },
  {
    title: "Booked Calls",
    value: "84",
    sub: "+9 booked this week",
    icon: PhoneCall,
  },
  {
    title: "Attended %",
    value: "73%",
    sub: "124 attended calls",
    icon: CheckCircle2,
  },
];

const funnel: FunnelStep[] = [
  { step: "Visited Page", value: 1000, conversion: "100%", width: "100%" },
  { step: "Submitted Form", value: 450, conversion: "45%", width: "72%" },
  {
    step: "Qualified",
    value: 306,
    conversion: "68% of submissions",
    width: "58%",
  },
  {
    step: "Booked a Call",
    value: 200,
    conversion: "65% of qualified",
    width: "44%",
  },
  {
    step: "Confirmed via Email",
    value: 170,
    conversion: "85% of booked",
    width: "34%",
  },
  {
    step: "Attended",
    value: 124,
    conversion: "73% of confirmed",
    width: "26%",
  },
];

const leadBreakdowns: BreakdownGroup[] = [
  {
    title: "Budget Distribution",
    items: [
      { label: "$1000+", value: 45 },
      { label: "$500-999", value: 30 },
      { label: "$200-499", value: 18 },
      { label: "Under 200", value: 7 },
    ],
  },
  {
    title: "Decision Maker Rate",
    items: [
      { label: "Is decision maker", value: 62 },
      { label: "Needs to bring someone", value: 38 },
    ],
  },
  {
    title: "Ad Spend",
    items: [
      { label: "$5000+/month", value: 42 },
      { label: "$1000-4999", value: 35 },
      { label: "Under $1000", value: 23 },
    ],
  },
  {
    title: "When Ready to Start",
    items: [
      { label: "Immediately", value: 48 },
      { label: "Within 1 month", value: 32 },
      { label: "3+ months", value: 20 },
    ],
  },
  {
    title: "What They Need",
    items: [
      { label: "More leads", value: 55 },
      { label: "Better creative", value: 35 },
      { label: "Full funnel", value: 10 },
    ],
  },
];

const disqualification: ProgressItem[] = [
  { label: "Budget too low", value: 45 },
  { label: "Not decision maker", value: 32 },
  { label: "Not ready to start", value: 18 },
  { label: "No clear need", value: 5 },
];

const upcomingCalls: UpcomingCall[] = [
  {
    id: 1,
    day: "Today",
    time: "10:00 AM",
    name: "John Smith",
    budget: "$5000 budget",
    decision: "Decision maker",
    status: "Qualified",
    indicator: "✅",
    meetingLink: "https://meet.google.com/demo-call-1",
    answers: {
      service: "Meta ads booking funnel",
      timeline: "Immediately",
      currentProblem: "Low quality leads from existing ads",
      adSpend: "$5,000+/month",
      need: "More leads + stronger follow-up",
    },
  },
  {
    id: 2,
    day: "Today",
    time: "02:00 PM",
    name: "Sarah Ahmed",
    budget: "$2000 budget",
    decision: "Needs partner",
    status: "Needs attention",
    indicator: "⚠️",
    meetingLink: "https://meet.google.com/demo-call-2",
    answers: {
      service: "Lead generation system",
      timeline: "Within 1 month",
      currentProblem: "Leads are not booking calls",
      adSpend: "$1,000-4,999",
      need: "Full funnel help",
    },
  },
  {
    id: 3,
    day: "Tomorrow",
    time: "11:00 AM",
    name: "Mike Johnson",
    budget: "$8000 budget",
    decision: "Decision maker",
    status: "Qualified",
    indicator: "✅",
    meetingLink: "https://meet.google.com/demo-call-3",
    answers: {
      service: "Booked calls optimization",
      timeline: "Immediately",
      currentProblem: "High CPL, low attendance",
      adSpend: "$5,000+/month",
      need: "More leads + better creative",
    },
  },
];

const activityFeed: ActivityItem[] = [
  {
    type: "success",
    time: "2 mins ago",
    text: "Ali Hassan confirmed their booking for Mar 20",
  },
  {
    type: "info",
    time: "15 mins ago",
    text: "Sarah Ahmed submitted lead form",
  },
  {
    type: "danger",
    time: "1 hour ago",
    text: "No-show: John Smith missed his call",
  },
  {
    type: "success",
    time: "2 hours ago",
    text: "Usman Khan attended his call",
  },
];

const outcomes: ProgressItem[] = [
  { label: "Attended", value: 73 },
  { label: "No-show", value: 22 },
  { label: "Cancelled", value: 5 },
];

const trendData: TrendData = {
  daily: [
    { name: "Mon", leads: 20, qualified: 13, bookings: 8 },
    { name: "Tue", leads: 24, qualified: 15, bookings: 10 },
    { name: "Wed", leads: 19, qualified: 12, bookings: 7 },
    { name: "Thu", leads: 28, qualified: 18, bookings: 11 },
    { name: "Fri", leads: 31, qualified: 21, bookings: 13 },
    { name: "Sat", leads: 16, qualified: 9, bookings: 5 },
    { name: "Sun", leads: 12, qualified: 7, bookings: 4 },
  ],
  weekly: [
    { name: "W1", leads: 95, qualified: 61, bookings: 39 },
    { name: "W2", leads: 108, qualified: 69, bookings: 43 },
    { name: "W3", leads: 121, qualified: 77, bookings: 48 },
    { name: "W4", leads: 134, qualified: 88, bookings: 54 },
  ],
  monthly: [
    { name: "Jan", leads: 320, qualified: 204, bookings: 124 },
    { name: "Feb", leads: 368, qualified: 238, bookings: 146 },
    { name: "Mar", leads: 410, qualified: 270, bookings: 168 },
    { name: "Apr", leads: 448, qualified: 306, bookings: 200 },
  ],
};

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatAnswerKey(key: CallAnswerKey): string {
  const labels: Record<CallAnswerKey, string> = {
    service: "Service",
    timeline: "Timeline",
    currentProblem: "Current Problem",
    adSpend: "Ad Spend",
    need: "Need",
  };

  return labels[key];
}

function Card({ title, icon: Icon, children, actions }: CardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-2.5">
              <Icon className="h-5 w-5 text-white/90" />
            </div>
          ) : null}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              {title}
            </h3>
          </div>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/65">{title}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {value}
          </h2>
          <p className="mt-2 text-xs text-emerald-300/90">{sub}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon className="h-5 w-5 text-white/90" />
        </div>
      </div>
    </div>
  );
}

function ProgressRows({ items }: ProgressRowsProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="text-white/80">{item.label}</span>
            <span className="font-semibold text-white">{item.value}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10">
            <div
              className="h-2.5 rounded-full bg-white"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookingFunnelDashboard() {
  const [expandedCallId, setExpandedCallId] = useState<number | null>(1);
  const [trendView, setTrendView] = useState<TrendView>("weekly");

  const groupedCalls = useMemo<GroupedCalls>(() => {
    return upcomingCalls.reduce<GroupedCalls>(
      (acc, call) => {
        acc[call.day].push(call);
        return acc;
      },
      { Today: [], Tomorrow: [] },
    );
  }, []);

  const activityColor: Record<ActivityType, string> = {
    success: "bg-emerald-400",
    info: "bg-sky-400",
    danger: "bg-rose-400",
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0d1b2a] via-[#0a1624] to-[#08111c] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">
              Meta Ads Booking Funnel
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Client Performance Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Simple responsive preview with dummy data for funnel performance,
              lead quality, bookings, outcomes, and trend tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              <CalendarDays className="h-4 w-4" />
              Last 30 Days
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <MetricCard key={item.title} {...item} />
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <Card title="Conversion Funnel" icon={TrendingUp}>
              <div className="space-y-4">
                {funnel.map((item, index) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-white/65">
                          Step {index + 1}
                        </p>
                        <h4 className="font-semibold text-white">
                          {item.step}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-cyan-300">
                          {item.conversion}
                        </p>
                      </div>
                    </div>
                    <div className="h-4 rounded-full bg-white/10">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="xl:col-span-5">
            <Card title="This Month's Call Outcomes" icon={BarChart3}>
              <ProgressRows items={outcomes} />
              <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/70">
                Attendance is healthy, but no-shows are still high enough to
                justify stronger email/SMS confirmation and reminder automation.
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <Card title="Lead Quality Breakdown" icon={DollarSign}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {leadBreakdowns.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <h4 className="mb-4 text-sm font-semibold text-white/90">
                      {group.title}
                    </h4>
                    <ProgressRows items={group.items} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="xl:col-span-4">
            <Card title="Top Disqualification Reasons" icon={XCircle}>
              <ProgressRows items={disqualification} />
            </Card>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <Card title="Upcoming Calls" icon={Clock3}>
              <div className="space-y-5">
                {Object.entries(groupedCalls).map(([day, calls]) => (
                  <div key={day}>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                      {day}
                    </h4>

                    <div className="space-y-3">
                      {calls.map((call) => {
                        const isOpen = expandedCallId === call.id;
                        return (
                          <div
                            key={call.id}
                            className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"
                          >
                            <button
                              onClick={() =>
                                setExpandedCallId(isOpen ? null : call.id)
                              }
                              className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div>
                                  <p className="text-xs text-white/50">Time</p>
                                  <p className="font-semibold text-white">
                                    {call.time}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/50">Lead</p>
                                  <p className="font-semibold text-white">
                                    {call.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/50">
                                    Budget
                                  </p>
                                  <p className="text-white/85">{call.budget}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/50">
                                    Decision
                                  </p>
                                  <p className="text-white/85">
                                    {call.decision}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "rounded-full px-3 py-1 text-xs font-semibold",
                                    call.status === "Qualified"
                                      ? "bg-emerald-400/15 text-emerald-300"
                                      : "bg-amber-400/15 text-amber-300",
                                  )}
                                >
                                  {call.indicator} {call.status}
                                </span>
                                {isOpen ? (
                                  <ChevronUp className="h-4 w-4 text-white/60" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-white/60" />
                                )}
                              </div>
                            </button>

                            {isOpen && (
                              <div className="border-t border-white/8 px-4 pb-4 pt-4">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  {(
                                    Object.entries(call.answers) as Array<
                                      [CallAnswerKey, string]
                                    >
                                  ).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="rounded-2xl bg-white/[0.04] p-3"
                                    >
                                      <p className="text-xs uppercase tracking-wide text-white/45">
                                        {formatAnswerKey(key)}
                                      </p>
                                      <p className="mt-1 text-sm text-white/90">
                                        {value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                  <a
                                    href={call.meetingLink}
                                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                                  >
                                    Open Meeting Link
                                  </a>
                                  <button className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                                    View Full Lead Profile
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="xl:col-span-4">
            <Card title="Recent Activity Feed" icon={Activity}>
              <div className="space-y-4">
                {activityFeed.map((item, index) => (
                  <div
                    key={`${item.time}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3"
                  >
                    <div
                      className={cn(
                        "mt-1 h-2.5 w-2.5 rounded-full",
                        activityColor[item.type],
                      )}
                    />
                    <div>
                      <p className="text-xs text-white/45">{item.time}</p>
                      <p className="mt-1 text-sm text-white/90">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-6">
          <Card
            title="Time-Based Trends"
            icon={TrendingUp}
            actions={
              <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
                {[
                  { key: "daily", label: "Day" },
                  { key: "weekly", label: "Week" },
                  { key: "monthly", label: "Month" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTrendView(item.key as TrendView)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                      trendView === item.key
                        ? "bg-white text-slate-900"
                        : "text-white/70",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <div className="h-[320px] w-full rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData[trendView]}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        vertical={false}
                      />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" />
                      <YAxis stroke="rgba(255,255,255,0.45)" />
                      <Tooltip
                        contentStyle={{
                          background: "#08111c",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        stroke="#67e8f9"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="qualified"
                        stroke="#818cf8"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#34d399"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="xl:col-span-4">
                <div className="h-[320px] rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData[trendView]}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        vertical={false}
                      />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" />
                      <YAxis stroke="rgba(255,255,255,0.45)" />
                      <Tooltip
                        contentStyle={{
                          background: "#08111c",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#ffffff"
                        fill="#ffffff"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-5">
            <p className="text-sm text-emerald-200/75">Strongest Signal</p>
            <h4 className="mt-2 text-lg font-semibold text-white">
              High-ticket intent is healthy
            </h4>
            <p className="mt-2 text-sm text-white/70">
              45% of leads report a budget above $1,000 and 42% already spend
              $5,000+ monthly on ads.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-400/15 bg-amber-400/10 p-5">
            <p className="text-sm text-amber-200/75">Main Bottleneck</p>
            <h4 className="mt-2 text-lg font-semibold text-white">
              Form to booked-call dropoff
            </h4>
            <p className="mt-2 text-sm text-white/70">
              The biggest leakage is between submission, qualification, and
              actual booking. That is where optimization should focus.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-400/15 bg-sky-400/10 p-5">
            <p className="text-sm text-sky-200/75">Suggested Next Step</p>
            <h4 className="mt-2 text-lg font-semibold text-white">
              Add stronger reminder flow
            </h4>
            <p className="mt-2 text-sm text-white/70">
              Confirmation and attendance can likely improve with SMS + email
              reminders, reschedule links, and no-show follow-up automation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
