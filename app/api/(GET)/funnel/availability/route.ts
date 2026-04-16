//! in the database date is stored as 2026-03-02 04:53:18.806461+00
//? This API endpoint will be used by the lead so timezone can differ for each lead
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import {
  isValidDate,
  isValidTimeZone,
  dayRangeUTCFromLocalDate,
  hmToParts,
  isFutureSlot,
} from "@/src/utils/helpers";
import { DateTime } from "luxon";
import { call_slot_minutes, WEEKLY_WINDOWS } from "@/src/utils/availibility";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date: string | null = searchParams.get("date"); // YYYY-MM-DD format
    const timeZone: string | null = searchParams.get("timezone"); //example "Asia/Karachi"

    //!guard clause
    if (!date || !timeZone) {
      return NextResponse.json(
        {
          error: "Missing necessary parameters",
        },
        { status: 400 },
      );
    }
    //? 1). validate date and time zone
    if (!isValidDate(date)) {
      return NextResponse.json(
        {
          message: "Invalid Date format",
        },
        { status: 400 },
      );
    }
    if (!isValidTimeZone(timeZone)) {
      return NextResponse.json(
        {
          message: "Invalid TimeZone",
        },
        { status: 400 },
      );
    }

    //? 2). local day in lead tz
    const { startUTC, endUTC } = dayRangeUTCFromLocalDate(date, timeZone);
    //? 3) .query supabase using that time range
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("start_time,end_time")
      .gte("start_time", startUTC)
      .lt("start_time", endUTC);
    //!guard clause
    if (error) throw new Error("Query Failed");

    //? 4) build candidate slots for the selected local day
    const localDay = DateTime.fromISO(date, { zone: timeZone });
    const dayWindow = WEEKLY_WINDOWS.find(
      (w) => w.weekday === localDay.weekday,
    );
    //!guard clause
    if (!dayWindow) {
      return NextResponse.json({ slots: [] });
    }

    const { hour: startHour, minute: startMinute } = hmToParts(
      dayWindow.startHM,
    );
    const { hour: endHour, minute: endMinute } = hmToParts(dayWindow.endHM);
    const openLocal = localDay.set({
      hour: startHour,
      minute: startMinute,
      second: 0,
      millisecond: 0,
    });
    const closeLocal = localDay.set({
      hour: endHour,
      minute: endMinute,
      second: 0,
      millisecond: 0,
    });
    //this set contains all the booked slot start times
    const bookedStartUTC = new Set(
      (data ?? [])
        .map((row) => DateTime.fromISO(row.start_time, { zone: "utc" }).toISO())
        .filter(Boolean),
    );

    //query the pending_appointments table and check for the pending slots so we dont show them as available slots
    const { data: pending, error: pendingError } = await supabaseAdmin
      .from("pending_appointments")
      .select("start_time")
      .is("confirmed_at", null)
      .gt("expires_at", new Date().toISOString());
    //!guard clause
    if (!pending) {
      throw new Error(
        `Failed to fetch pending Slots , we came across the following error ${pendingError}`,
      );
    }

    const pendingStartTimes = new Set(
      pending
        ?.map((p) => DateTime.fromISO(p.start_time, { zone: "utc" }).toISO())
        .filter(Boolean) ?? [],
    );
    const slots: string[] = [];
    let cursor = openLocal;
    while (cursor < closeLocal) {
      const slotEnd = cursor.plus({ minutes: call_slot_minutes });
      if (slotEnd <= closeLocal) {
        const slotStart = cursor.toUTC();
        const slotStartUTC = slotStart.toISO();
        if (
          isFutureSlot(slotStart) &&
          slotStartUTC &&
          !bookedStartUTC.has(slotStartUTC) &&
          !pendingStartTimes.has(slotStartUTC)
        ) {
          slots.push(slotStartUTC);
        }
      }
      cursor = cursor.plus({ minutes: call_slot_minutes });
    }

    //? 5) Return Response
    return NextResponse.json({ slots });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
