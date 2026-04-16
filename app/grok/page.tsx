"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Call {
  id: number;
  name: string;
  time: string;
  date: string;
  budget: string;
  decisionMaker: boolean;
  qualified: "qualified" | "attention";
  answers: { q: string; a: string }[];
  meetingLink: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const funnelData = [
  { label: "Visited Page", value: 1000, pct: null, color: "#6366f1" },
  { label: "Submitted Form", value: 450, pct: "45%", color: "#8b5cf6" },
  { label: "Qualified", value: 306, pct: "68%", color: "#a855f7" },
  { label: "Booked a Call", value: 200, pct: "65%", color: "#c084fc" },
  { label: "Confirmed via Email", value: 170, pct: "85%", color: "#d8b4fe" },
  { label: "Attended", value: 124, pct: "73%", color: "#e9d5ff" },
];

const budgetData = [
  { name: "$1k–$3k", value: 18 },
  { name: "$3k–$7k", value: 34 },
  { name: "$7k–$15k", value: 28 },
  { name: "$15k+", value: 20 },
];

const readyData = [
  { name: "Immediately", value: 42 },
  { name: "1–2 months", value: 31 },
  { name: "3–6 months", value: 19 },
  { name: "6+ months", value: 8 },
];

const needsData = [
  { name: "Lead Generation", value: 38 },
  { name: "Paid Ads", value: 27 },
  { name: "SEO / Content", value: 21 },
  { name: "Web Design", value: 14 },
];

const disqualReasons = [
  { reason: "Budget too low", count: 62, pct: 43 },
  { reason: "Not decision maker", count: 38, pct: 26 },
  { reason: "Wrong industry", count: 22, pct: 15 },
  { reason: "No urgency", count: 14, pct: 10 },
  { reason: "Competitor client", count: 8, pct: 6 },
];

const upcomingCalls: Call[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    time: "10:00 AM",
    date: "Today",
    budget: "$7k–$15k",
    decisionMaker: true,
    qualified: "qualified",
    answers: [
      { q: "Current MRR?", a: "$42k/month" },
      { q: "Main challenge?", a: "Lead quality is terrible" },
      { q: "Timeline?", a: "Want to start next week" },
    ],
    meetingLink: "#",
  },
  {
    id: 2,
    name: "James Kowalski",
    time: "12:30 PM",
    date: "Today",
    budget: "$3k–$7k",
    decisionMaker: false,
    qualified: "attention",
    answers: [
      { q: "Current MRR?", a: "$18k/month" },
      { q: "Main challenge?", a: "Scaling paid traffic" },
      { q: "Timeline?", a: "In 2–3 months" },
    ],
    meetingLink: "#",
  },
  {
    id: 3,
    name: "Priya Nair",
    time: "3:00 PM",
    date: "Today",
    budget: "$15k+",
    decisionMaker: true,
    qualified: "qualified",
    answers: [
      { q: "Current MRR?", a: "$110k/month" },
      { q: "Main challenge?", a: "Entering new market" },
      { q: "Timeline?", a: "Immediately" },
    ],
    meetingLink: "#",
  },
  {
    id: 4,
    name: "Leo Fernandez",
    time: "9:00 AM",
    date: "Tomorrow",
    budget: "$1k–$3k",
    decisionMaker: true,
    qualified: "attention",
    answers: [
      { q: "Current MRR?", a: "$6k/month" },
      { q: "Main challenge?", a: "Getting first 10 clients" },
      { q: "Timeline?", a: "3–6 months" },
    ],
    meetingLink: "#",
  },
];

const activityFeed = [
  {
    id: 1,
    icon: "📋",
    text: "New form submission from Marcus Reid",
    time: "2m ago",
    type: "form",
  },
  {
    id: 2,
    icon: "✅",
    text: "Sarah Mitchell confirmed her call",
    time: "14m ago",
    type: "confirm",
  },
  {
    id: 3,
    icon: "❌",
    text: "Lead disqualified — budget too low",
    time: "31m ago",
    type: "disq",
  },
  {
    id: 4,
    icon: "📞",
    text: "Call with Priya Nair marked as Attended",
    time: "1h ago",
    type: "call",
  },
  {
    id: 5,
    icon: "📅",
    text: "James Kowalski booked a call for today",
    time: "2h ago",
    type: "book",
  },
  {
    id: 6,
    icon: "🚫",
    text: "No-show: Derek Tan didn't attend",
    time: "3h ago",
    type: "noshow",
  },
];

const trendData = [
  { label: "Mon", leads: 38, qualified: 24, bookings: 12 },
  { label: "Tue", leads: 52, qualified: 31, bookings: 18 },
  { label: "Wed", leads: 45, qualified: 28, bookings: 15 },
  { label: "Thu", leads: 61, qualified: 40, bookings: 22 },
  { label: "Fri", leads: 55, qualified: 35, bookings: 19 },
  { label: "Sat", leads: 29, qualified: 18, bookings: 9 },
  { label: "Sun", leads: 21, qualified: 13, bookings: 6 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#94a3b8",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: "#f1f5f9",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 13, color: accent }}>{sub}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#cbd5e1",
        }}
      >
        {children}
      </h2>
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
      />
    </div>
  );
}

function HorizBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 4,
        height: 6,
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 1s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

function MiniBarChart({
  data,
  color,
}: {
  data: { name: string; value: number }[];
  color: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d) => (
        <div
          key={d.name}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              width: 100,
              flexShrink: 0,
            }}
          >
            {d.name}
          </span>
          <HorizBar pct={(d.value / max) * 100} color={color} />
          <span
            style={{
              fontSize: 12,
              color: "#e2e8f0",
              fontFamily: "'DM Mono', monospace",
              width: 32,
              textAlign: "right",
            }}
          >
            {d.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

function CallRow({ call }: { call: Call }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 10,
      }}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 18px",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 80 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>{call.date}</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#f1f5f9",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {call.time}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>
            {call.name}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            background: "rgba(99,102,241,0.18)",
            color: "#a5b4fc",
            borderRadius: 6,
            padding: "3px 9px",
          }}
        >
          {call.budget}
        </span>
        <span
          style={{
            fontSize: 12,
            color: call.decisionMaker ? "#4ade80" : "#fb923c",
          }}
        >
          {call.decisionMaker ? "✓ DM" : "✗ Not DM"}
        </span>
        <span style={{ fontSize: 16 }}>
          {call.qualified === "qualified" ? "✅" : "⚠️"}
        </span>
        <span style={{ fontSize: 12, color: "#475569", marginLeft: 4 }}>
          {open ? "▲" : "▼"}
        </span>
      </div>
      {open && (
        <div
          style={{
            padding: "0 18px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 12,
            }}
          >
            {call.answers.map((a) => (
              <div key={a.q} style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    width: 130,
                    flexShrink: 0,
                  }}
                >
                  {a.q}
                </span>
                <span style={{ fontSize: 12, color: "#e2e8f0" }}>{a.a}</span>
              </div>
            ))}
          </div>
          <a
            href={call.meetingLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 14,
              fontSize: 13,
              fontWeight: 600,
              color: "#818cf8",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 8,
              padding: "7px 14px",
              textDecoration: "none",
            }}
          >
            🔗 Join Meeting
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function LeadDashboard() {
  const [trendKey, setTrendKey] = useState<"weekly" | "monthly">("weekly");

  const col2 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  } as React.CSSProperties;
  const col3 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 20,
  } as React.CSSProperties;
  const col4 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: 16,
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-[#080c14] px-6 text-center lg:hidden">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-violet-300">
            Dashboard Preview
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            This dashboard is only available on larger devices.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Open this route on a laptop or desktop to view the full lead
            pipeline and reporting layout.
          </p>
        </div>
      </div>

      <div
        className="hidden lg:block"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #080c14 0%, #0d1220 50%, #080c14 100%)",
          fontFamily: "'Manrope', sans-serif",
          color: "#e2e8f0",
          padding: "32px 40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 36,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: "-0.02em",
              }}
            >
              Lead Pipeline
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "linear-gradient(90deg,#6366f1,#a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LIVE
              </span>
            </h1>
            <p style={{ marginTop: 4, fontSize: 13, color: "#475569" }}>
              Last updated: Today at 9:41 AM · March 2025
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["This Week", "This Month", "All Time"].map((l) => (
              <button
                key={l}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    l === "This Month"
                      ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                      : "rgba(255,255,255,0.05)",
                  color: l === "This Month" ? "#fff" : "#64748b",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 1: KPIs ── */}
        <SectionTitle>Top-Level KPIs</SectionTitle>
        <div style={col4}>
          <KpiCard
            label="Total Leads"
            value="1,000"
            sub="↑ 12% vs last month"
            accent="#4ade80"
          />
          <KpiCard
            label="Qualified Rate"
            value="30.6%"
            sub="306 of 1,000 leads"
            accent="#818cf8"
          />
          <KpiCard
            label="Booking Rate"
            value="65%"
            sub="200 calls booked"
            accent="#fb923c"
          />
          <KpiCard
            label="Show Rate"
            value="73%"
            sub="124 of 170 attended"
            accent="#34d399"
          />
        </div>
        <div style={{ ...col4, marginTop: 16 }}>
          <KpiCard
            label="Ad Spend"
            value="$8,400"
            sub="$42 cost per lead"
            accent="#f472b6"
          />
          <KpiCard
            label="Cost per Booking"
            value="$210"
            sub="↓ 8% vs last month"
            accent="#4ade80"
          />
          <KpiCard
            label="Decision Makers"
            value="64%"
            sub="640 of 1,000 leads"
            accent="#818cf8"
          />
          <KpiCard
            label="Revenue Pipeline"
            value="$61,200"
            sub="Estimated from attended"
            accent="#fbbf24"
          />
        </div>

        {/* ── Section 2: Funnel ── */}
        <div style={{ marginTop: 40 }}>
          <SectionTitle>Conversion Funnel</SectionTitle>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "28px 32px",
            }}
          >
            {funnelData.map((step, i) => {
              const width = `${(step.value / 1000) * 100}%`;
              return (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: i < funnelData.length - 1 ? 12 : 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      width: 160,
                      flexShrink: 0,
                    }}
                  >
                    {step.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 6,
                      height: 32,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width,
                        height: "100%",
                        background: `linear-gradient(90deg, ${step.color}99, ${step.color}55)`,
                        borderRadius: 6,
                        transition: "width 1s",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {step.value.toLocaleString()}
                    </span>
                  </div>
                  {step.pct && (
                    <span
                      style={{
                        fontSize: 13,
                        color: step.color,
                        fontFamily: "'DM Mono', monospace",
                        width: 44,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {step.pct}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 3: Lead Quality ── */}
        <div style={{ marginTop: 40 }}>
          <SectionTitle>Lead Quality Breakdown</SectionTitle>
          <div style={col4}>
            {/* Budget */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#6366f1",
                  marginBottom: 16,
                }}
              >
                Budget Distribution
              </p>
              <MiniBarChart data={budgetData} color="#6366f1" />
            </div>
            {/* Decision Maker */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#a855f7",
                  marginBottom: 16,
                }}
              >
                Decision Maker Rate
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ position: "relative", width: 100, height: 100 }}>
                  <svg
                    viewBox="0 0 36 36"
                    style={{
                      width: 100,
                      height: 100,
                      transform: "rotate(-90deg)",
                    }}
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="4"
                      strokeDasharray="57 88"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#f1f5f9",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      64%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#4ade80",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    640
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>DMs</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#fb923c",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    360
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Non-DMs</div>
                </div>
              </div>
            </div>
            {/* Ready to Start */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#34d399",
                  marginBottom: 16,
                }}
              >
                Ready to Start
              </p>
              <MiniBarChart data={readyData} color="#34d399" />
            </div>
            {/* What They Need */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#fbbf24",
                  marginBottom: 16,
                }}
              >
                What They Need
              </p>
              <MiniBarChart data={needsData} color="#fbbf24" />
            </div>
          </div>
        </div>

        {/* ── Section 4 + 6 side-by-side ── */}
        <div style={{ ...col2, marginTop: 40 }}>
          {/* Section 4: Disqualification */}
          <div>
            <SectionTitle>Disqualification Analysis</SectionTitle>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              {disqualReasons.map((r) => (
                <div
                  key={r.reason}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      width: 160,
                      flexShrink: 0,
                    }}
                  >
                    {r.reason}
                  </span>
                  <HorizBar pct={r.pct} color="#ef4444" />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#fca5a5",
                      fontFamily: "'DM Mono', monospace",
                      width: 52,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {r.count} · {r.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Activity Feed */}
          <div>
            <SectionTitle>Recent Activity</SectionTitle>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#cbd5e1",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.text}
                    </p>
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: Upcoming Calls ── */}
        <div style={{ marginTop: 40 }}>
          <SectionTitle>Upcoming Calls</SectionTitle>
          {upcomingCalls.map((c) => (
            <CallRow key={c.id} call={c} />
          ))}
        </div>

        {/* ── Section 7 + 8 ── */}
        <div style={{ ...col2, marginTop: 40 }}>
          {/* Section 7: Call Outcomes */}
          <div>
            <SectionTitle>This Month&apos;s Call Outcomes</SectionTitle>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 28,
              }}
            >
              {[
                { label: "Attended", pct: 73, color: "#4ade80" },
                { label: "No-show", pct: 22, color: "#fb923c" },
                { label: "Cancelled", pct: 5, color: "#64748b" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      width: 100,
                      flexShrink: 0,
                    }}
                  >
                    {item.label}
                  </span>
                  <HorizBar pct={item.pct} color={item.color} />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: item.color,
                      fontFamily: "'DM Mono', monospace",
                      width: 40,
                      textAlign: "right",
                    }}
                  >
                    {item.pct}%
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  gap: 16,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  paddingTop: 20,
                }}
              >
                {[
                  ["124", "Attended"],
                  ["30", "No-show"],
                  ["7", "Cancelled"],
                ].map(([val, lbl]) => (
                  <div key={lbl} style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#f1f5f9",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#475569", marginTop: 2 }}
                    >
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8: Trends */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#cbd5e1",
                  }}
                >
                  Time-Based Trends
                </h2>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["weekly", "monthly"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTrendKey(k)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background:
                        trendKey === k
                          ? "rgba(99,102,241,0.25)"
                          : "rgba(255,255,255,0.04)",
                      color: trendKey === k ? "#818cf8" : "#64748b",
                      border:
                        "1px solid " +
                        (trendKey === k
                          ? "rgba(99,102,241,0.4)"
                          : "rgba(255,255,255,0.07)"),
                      borderRadius: 7,
                      padding: "5px 12px",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                {[
                  ["#6366f1", "Leads"],
                  ["#a855f7", "Qualified"],
                  ["#34d399", "Bookings"],
                ].map(([color, label]) => (
                  <div
                    key={label}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={trendData}
                  margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0d1220",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#e2e8f0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#6366f1" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qualified"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#a855f7" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#34d399" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 48,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#334155" }}>
            Lead Pipeline Dashboard · March 2025
          </span>
          <span style={{ fontSize: 12, color: "#334155" }}>
            Auto-refreshes every 5 min
          </span>
        </div>
      </div>
    </>
  );
}
