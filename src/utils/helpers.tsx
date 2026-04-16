import { adSpendOptions, creativeBudgetOptions } from ".";
import { DateTime } from "luxon";
import { call_slot_minutes, timezone, WEEKLY_WINDOWS } from "./availibility";
import { IANAZone } from "luxon";
import { LeadQualityData, error } from "./types";

//!Form validation helpers
export const isAdSpendQualified = (v: (typeof adSpendOptions)[number]) => {
  // Rule: must be 500+
  return v === "500–2,000" || v === "2,000–10,000" || v === "10,000+";
};

export const isCreativeBudgetQualified = (
  v: (typeof creativeBudgetOptions)[number],
) => {
  // Rule: must be 800+
  return v === "800–2,000" || v === "2,000–5,000" || v === "5,000+";
};

export const isValidWhatsApp = (raw: string) => {
  const value = raw.trim();
  if (!value) return false;

  // allow spaces/dashes, but enforce digits length
  const digits = value.replace(/[^\d]/g, "");

  // must be 10–15 digits (E.164 max is 15)
  if (digits.length < 10 || digits.length > 15) return false;

  // if they included +, ensure it's at the start
  if (value.includes("+") && !value.startsWith("+")) return false;

  return true;
};

//!appointments route helpers
export function hmToParts(hm: string) {
  const [h, m] = hm.split(":").map(Number);
  return { hour: h, minute: m };
}

export function parseStartISO(startISO: string) {
  const dt = DateTime.fromISO(startISO, { setZone: true });
  return dt.isValid ? dt : null;
}

export function computeEnd(dtStart: DateTime) {
  return dtStart.plus({ minutes: call_slot_minutes });
}

export function isAlignedToSlot(dtStart: DateTime) {
  const startLocal = dtStart.setZone(timezone);
  const window = WEEKLY_WINDOWS.find((w) => w.weekday === startLocal.weekday);
  if (!window) return false;

  const { hour: sh, minute: sm } = hmToParts(window.startHM);
  const open = startLocal.set({
    hour: sh,
    minute: sm,
    second: 0,
    millisecond: 0,
  });

  const diffMinutes = Math.round(startLocal.diff(open, "minutes").minutes);
  return diffMinutes >= 0 && diffMinutes % call_slot_minutes === 0;
}

export function isWithInAvailability(dtStart: DateTime, dtEnd: DateTime) {
  //convert in local timezone
  const start_local = dtStart.setZone(timezone);
  const end_local = dtEnd.setZone(timezone);

  //guard clause appointments can not be spaned across time period of 2 days
  if (start_local.toISODate() !== end_local.toISODate()) return false;

  const window = WEEKLY_WINDOWS.find((w) => w.weekday == start_local.weekday);
  if (!window) return false;

  const { hour: sh, minute: sm } = hmToParts(window.startHM);
  const { hour: eh, minute: em } = hmToParts(window.endHM);

  const open = start_local.set({
    hour: sh,
    minute: sm,
    second: 0,
    millisecond: 0,
  });
  const close = start_local.set({
    hour: eh,
    minute: em,
    second: 0,
    millisecond: 0,
  });

  return start_local >= open && end_local <= close;
}

export function isFutureSlot(dtStart: DateTime) {
  return dtStart.toUTC() > DateTime.utc();
}

export function isUniqueVoilation(error: any) {
  return error?.code === "23505";
}
//!Availibility api route
export function dayRangeUTCFromLocalDate(date: string, tz: string) {
  const startUTC = DateTime.fromISO(date, { zone: tz }).startOf("day").toUTC();
  const endUTC = startUTC.plus({ days: 1 });

  return {
    startUTC: startUTC.toISO(),
    endUTC: endUTC.toISO(),
  };
}

export function isValidDate(date: string) {
  const formatcheck = /^\d{4}-\d{2}-\d{2}$/;

  if (!formatcheck.test(date)) return false;

  //check if its a real calendar date
  const dt = DateTime.fromFormat(date, "yyyy-MM-dd", { zone: "utc" });
  return dt.isValid;
}

export function isValidTimeZone(zone: string) {
  return IANAZone.isValidZone(zone);
}

export function getBarShade(pct: number): string {
  if (pct < 30) return "bg-[var(--dash-progress-ultra-low)]";
  if (pct < 50) return "bg-[var(--dash-progress-low)]";
  if (pct < 70) return "bg-[var(--dash-progress-medium)]";
  if (pct < 90) return "bg-[var(--dash-progress-strong)]";
  return "bg-[var(--dash-progress-medium)]";
}

export function isErrorResponse(res: LeadQualityData | error): res is error {
  //when the function returns true type script will assume it is an error
  return "success" in res && res.success === false; //checks if the object has a property called success , and if it does check if success === false?
}
