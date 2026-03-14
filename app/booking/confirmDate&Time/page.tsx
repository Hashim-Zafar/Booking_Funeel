"use client";

import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

function parseYMD(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatTimeLabel(iso: string, tz: string) {
  const dt = DateTime.fromISO(iso, { zone: "utc" }).setZone(tz);
  return dt.isValid ? dt.toFormat("HH:mm") : "-";
}

export default function BookingCallsUI() {
  const tz = "Asia/Karachi";

  //?By default we need to set the selectedDate value to current date this is why we use "useMemo" to pass it to the "toYMD" function which converts the current date to "yy-mm-dd" format
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const router = useRouter();
  const [selectedDateYMD, setSelectedDateYMD] = useState<string>(toYMD(today));
  const [visibleMonthStart, setVisibleMonthStart] = useState<Date>(() => {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<SlotISO[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotISO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const monthLabel = useMemo(() => {
    return visibleMonthStart.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [visibleMonthStart]);

  const canGoPrevMonth = useMemo(() => {
    const prevMonthEnd = new Date(
      visibleMonthStart.getFullYear(),
      visibleMonthStart.getMonth(),
      0,
    );
    prevMonthEnd.setHours(0, 0, 0, 0);
    return prevMonthEnd >= today;
  }, [today, visibleMonthStart]);

  const calendarCells = useMemo(() => {
    const monthStart = new Date(
      visibleMonthStart.getFullYear(),
      visibleMonthStart.getMonth(),
      1,
    );
    monthStart.setHours(0, 0, 0, 0);

    const startWeekday = monthStart.getDay();
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - startWeekday);

    return Array.from({ length: 42 }, (_, idx) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + idx);
      date.setHours(0, 0, 0, 0);

      return {
        date,
        ymd: toYMD(date),
        isCurrentMonth: date.getMonth() === visibleMonthStart.getMonth(),
        isPast: date < today,
      };
    });
  }, [today, visibleMonthStart]);

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        date: selectedDateYMD,
        timezone: tz,
      });

      const response = await fetch(`/api/availability?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body?.error ?? body?.message ?? "Failed to fetch slots",
        );
      }

      const nextSlots: SlotISO[] = Array.isArray(body?.slots) ? body.slots : [];
      setSlots(nextSlots);
      setSelectedSlot((prev) =>
        prev && nextSlots.includes(prev) ? prev : null,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading slots";
      setSlots([]);
      setSelectedSlot(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedDateYMD, tz]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleConfirmBooking = useCallback(async () => {
    if (!selectedSlot) return;

    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(null);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          start_time: selectedSlot,
          timezone: tz,
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body?.error ?? body?.message ?? "Failed to confirm booking",
        );
      }

      setBookingSuccess("Booking confirmed successfully.");
      setSelectedSlot(null);
      await fetchSlots();
      router.push("/confirm-email");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to confirm booking";
      setBookingError(message);
    } finally {
      setBookingLoading(false);
    }
  }, [fetchSlots, selectedSlot, tz]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Book a Call
          </h1>
          <p className="text-sm text-black/60">
            Select a date, then choose an available time ({tz}).
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          {/* Left: Date picker */}
          <div className="rounded-2xl border border-black/10 p-4">
            <label className="text-sm font-medium">Date</label>
            <div className="mt-2 rounded-xl border border-black/15 p-3">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  disabled={!canGoPrevMonth}
                  onClick={() =>
                    setVisibleMonthStart(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                    )
                  }
                  className={[
                    "rounded-lg border px-2 py-1 text-xs transition",
                    canGoPrevMonth
                      ? "border-black/20 hover:border-black/35 hover:bg-black/[0.03]"
                      : "cursor-not-allowed border-black/10 text-black/30",
                  ].join(" ")}
                >
                  Prev
                </button>
                <div className="text-sm font-medium">{monthLabel}</div>
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonthStart(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                    )
                  }
                  className="rounded-lg border border-black/20 px-2 py-1 text-xs transition hover:border-black/35 hover:bg-black/[0.03]"
                >
                  Next
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-black/60">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day}>{day}</div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell) => {
                  const isSelected = selectedDateYMD === cell.ymd;
                  return (
                    <button
                      key={cell.ymd}
                      type="button"
                      disabled={cell.isPast}
                      onClick={() => {
                        setSelectedDateYMD(cell.ymd);
                        const selectedDate = parseYMD(cell.ymd);
                        if (selectedDate) {
                          setVisibleMonthStart(
                            new Date(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth(),
                              1,
                            ),
                          );
                        }
                      }}
                      className={[
                        "h-8 rounded-md text-xs transition",
                        "focus:outline-none focus:ring-2 focus:ring-black/10",
                        cell.isPast
                          ? "cursor-not-allowed text-black/25"
                          : isSelected
                            ? "bg-black font-semibold text-white"
                            : cell.isCurrentMonth
                              ? "text-black hover:bg-black/[0.06]"
                              : "text-black/40 hover:bg-black/[0.04]",
                      ].join(" ")}
                      aria-pressed={isSelected}
                    >
                      {cell.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-black/5 p-3 text-xs text-black/70">
              <div className="flex items-center justify-between">
                <span className="font-medium">Timezone</span>
                <span className="font-mono">{tz}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchSlots}
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
                <div className="text-xs text-black/60">Loading...</div>
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
            {bookingError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {bookingError}
              </div>
            )}
            {bookingSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {bookingSuccess}
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
                        {formatTimeLabel(iso, tz)}
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
                        {formatTimeLabel(selectedSlot, tz)}
                      </span>
                    </>
                  ) : (
                    "No time selected"
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={!selectedSlot || bookingLoading}
                onClick={handleConfirmBooking}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-black/10",
                  selectedSlot && !bookingLoading
                    ? "bg-black text-white hover:bg-black/90"
                    : "cursor-not-allowed bg-black/10 text-black/40",
                ].join(" ")}
              >
                {bookingLoading ? "Confirming..." : "Confirm booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
