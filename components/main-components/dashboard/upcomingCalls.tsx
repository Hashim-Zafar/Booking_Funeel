"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { timezone } from "@/src/utils/availibility";

interface Call {
  name: string;
  service: string;
  budget: string;
  decision_maker: string;
  start_time: string;
  status: string;
}

// derive initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// format start_time to "10:30 AM"
function formatTime(iso: string) {
  return DateTime.fromISO(iso).setZone(timezone).toFormat("hh:mm a");
}

// filter to only today's calls
function isTodayPKT(iso: string) {
  const callDay = DateTime.fromISO(iso).setZone(timezone).startOf("day");
  const today = DateTime.now().setZone(timezone).startOf("day");
  return callDay.equals(today);
}

const CallRow = ({ call }: { call: Call }) => {
  const isPending = call.status?.toLowerCase() === "pending";
  const initials = getInitials(call.name);
  const time = formatTime(call.start_time);

  return (
    <div className={`call-row ${isPending ? "call-row--pending" : ""}`}>
      <div className="call-row__avatar">{initials}</div>
      <div className="call-row__info">
        <span className="call-row__name">{call.name}</span>
        <span className="call-row__meta">
          {time} &bull; {call.service ?? "—"}
        </span>
      </div>
      <span
        className={`call-row__badge ${
          isPending ? "call-row__badge--pending" : "call-row__badge--confirmed"
        }`}
      >
        {isPending ? "PENDING" : "CONFIRMED"}
      </span>
    </div>
  );
};

export default function UpcomingCalls() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/upcomingCalls");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch calls");

        // filter to today only on the frontend
        const todayCalls = (json.data as Call[]).filter((c) =>
          isTodayPKT(c.start_time),
        );
        setCalls(todayCalls);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  return (
    <div className="calls-card">
      <div className="calls-card__header">
        <span className="calls-card__title">Upcoming Calls</span>
        <span className="calls-card__today-badge">TODAY</span>
      </div>

      {loading && (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="call-row">
              <div
                className="kpi-card__skeleton"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              <div className="call-row__info">
                <div
                  className="kpi-card__skeleton"
                  style={{ width: "120px", height: "14px" }}
                />
                <div
                  className="kpi-card__skeleton"
                  style={{ width: "80px", height: "12px", marginTop: "4px" }}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {!loading && error && (
        <div className="kpi-error">Failed to load calls: {error}</div>
      )}

      {!loading && !error && calls.length === 0 && (
        <p className="calls-empty">No calls scheduled for today.</p>
      )}

      {!loading &&
        !error &&
        calls.map((call, i) => <CallRow key={i} call={call} />)}

      <button className="calls-card__schedule-btn">VIEW FULL SCHEDULE</button>
    </div>
  );
}
