"use client";

import { dayRangeUTCFromLocalDate } from "@/src/utils/helpers";
import { useEffect, useMemo, useState } from "react";

type SlotISO = string;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());

  return `${y}-${m}-${day}`;
}

function formatTimeLabel(iso: string) {
  // UI-only: parse just HH:MM from the string
  const timePart = iso.split("T")[1] ?? "";
  const hhmm = timePart.slice(0, 5);
  return hhmm || "—";
}

export default function BookingCallsUI() {
  const tz = "Asia/Karachi";
  useEffect(() => {
    dayRangeUTCFromLocalDate("2026-03-02", "Asia/Karachi");
  }, []);
  //?By default we need to set the selectedDate value to current date this is why we use "useMemo" to pass it to the "toYMD" function which converts the current date to "yy-mm-dd" format
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDateYMD, setSelectedDateYMD] = useState<string>(toYMD(today));
  const [loading, setLoading] = useState(false); // todo yet to figure out how this works
  const [slots, setSlots] = useState<SlotISO[]>([]); // todo yet to figure out how this works
  const [selectedSlot, setSelectedSlot] = useState<SlotISO | null>(null); // todo yet to figure out how this works
  const [error, setError] = useState<string | null>(null); // todo yet to figure out how this works

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Book a Call
          </h1>
          <p className="text-sm text-black/60">
            Select a date, then choose an available time ({tz}). UI only — no
            booking logic.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          {/* Left: Date picker */}
          <div className="rounded-2xl border border-black/10 p-4">
            <label className="text-sm font-medium">Date</label>
            <div className="mt-2">
              <input
                type="date"
                value={selectedDateYMD} // ?default value is set to todays value
                min={toYMD(today)} // ?All dates before the current date are disabled
                onChange={(e) => {
                  setSelectedDateYMD(e.target.value);
                }}
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="mt-4 rounded-xl bg-black/5 p-3 text-xs text-black/70">
              <div className="flex items-center justify-between">
                <span className="font-medium">Timezone</span>
                <span className="font-mono">{tz}</span>
              </div>
              <div className="mt-2 text-black/60">
                When you connect your real API, pass{" "}
                <span className="font-mono">date</span> +{" "}
                <span className="font-mono">tz</span>.
              </div>
            </div>

            <button
              type="button"
              onClick={() => console.log("Refresh Button clicked")}
              className="mt-4 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium transition hover:border-black/25 hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              Refresh times
            </button>
          </div>

          {/* Right: Slots */}
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Available times</div>
                <div className="text-xs text-black/60">
                  for {selectedDateYMD}
                </div>
              </div>

              {loading ? (
                <div className="text-xs text-black/60">Loading…</div>
              ) : (
                <div className="text-xs text-black/50">
                  {slots.length} slots
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 animate-pulse rounded-xl border border-black/10 bg-black/5"
                    />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-xl bg-black/5 p-4 text-sm text-black/60">
                  No available times for this date.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {slots.map((iso) => {
                    const active = selectedSlot === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setSelectedSlot(iso)}
                        className={[
                          "rounded-xl border px-3 py-2 text-sm font-medium transition",
                          "focus:outline-none focus:ring-2 focus:ring-black/10",
                          active
                            ? "border-black bg-black text-white"
                            : "border-black/15 bg-white text-black hover:border-black/25 hover:bg-black/[0.02]",
                        ].join(" ")}
                        aria-pressed={active}
                      >
                        {formatTimeLabel(iso)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <div className="font-medium">Selected</div>
                <div className="text-black/60">
                  {selectedSlot ? (
                    <>
                      <span className="font-mono">{selectedDateYMD}</span> @{" "}
                      <span className="font-mono">
                        {formatTimeLabel(selectedSlot)}
                      </span>
                    </>
                  ) : (
                    "No time selected"
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={!selectedSlot}
                onClick={() => {
                  // UI-only action
                  alert(
                    selectedSlot
                      ? `UI only:\nDate: ${selectedDateYMD}\nTime: ${formatTimeLabel(selectedSlot)}\nTZ: ${tz}`
                      : "Pick a time first",
                  );
                }}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-black/10",
                  selectedSlot
                    ? "bg-black text-white hover:bg-black/90"
                    : "cursor-not-allowed bg-black/10 text-black/40",
                ].join(" ")}
              >
                Confirm booking
              </button>
            </div>

            <div className="mt-3 text-xs text-black/50">
              Next step: swap the mock fetch with your real{" "}
              <span className="font-mono">/api/slots</span> route and keep the
              UI unchanged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
