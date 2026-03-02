import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/supabase/admin";
import { cookies } from "next/headers";
import {
  parseStartISO,
  computeEnd,
  isAlignedToSlot,
  isWithInAvailability,
  isUniqueVoilation,
} from "@/src/utils/helpers";
import { appointmentSchema } from "@/src/lib/appointmentSchema";

export async function POST(req: Request) {
  try {
    //initialize the cookie Store
    const cookieStore = await cookies();
    //fetch the lead_id
    const leadID = cookieStore.get("lead_id")?.value;
    //!guard clause
    if (!leadID) {
      return NextResponse.json(
        {
          error: "Missing Lead context (Lead_id)",
        },
        { status: 404 },
      );
    }
    //fetch the request
    const json = await req.json();
    console.log("incoming body", json);
    //safeParse to ensure that the request is the same as we expect
    const parsed = appointmentSchema.safeParse(json);

    //!guard clause
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    //fetch relevant data from the leads table
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .select("id,name,email,qualified")
      .eq("id", leadID)
      .single();
    //!guard clause
    if (!lead || leadError) {
      return NextResponse.json(
        {
          error: "Lead not found",
        },
        { status: 404 },
      );
    }
    //compute the start time
    const dtStart = parseStartISO(parsed.data.start_time);
    //!guard clause
    if (!dtStart) {
      return NextResponse.json(
        { error: "Invalid Start Time" },
        { status: 400 },
      );
    }
    //compute the end time
    const dtEnd = computeEnd(dtStart);

    //!guard clause
    if (!isAlignedToSlot(dtStart)) {
      return NextResponse.json(
        { error: "start_time must be aligned to 40-minute slots" },
        { status: 400 },
      );
    }
    if (!isWithInAvailability(dtStart, dtEnd)) {
      return NextResponse.json(
        { error: "Selected slot is outside availability" },
        { status: 400 },
      );
    }
    //convert the start and end time to database relevant format
    const startUTC = dtStart.toUTC().toISO();
    const endUTC = dtEnd.toUTC().toISO();
    //insert the data
    const { data: appointment, error: aptError } = await supabaseAdmin
      .from("appointments")
      .insert({
        lead_id: leadID,
        invitee_name: lead.name,
        invitee_email: lead.email,
        start_time: startUTC,
        end_time: endUTC,
        timezone: parsed.data.timezone ?? null,
      })
      .select("*")
      .single();

    //!guard clause
    if (aptError) {
      if (isUniqueVoilation(aptError)) {
        return NextResponse.json(
          {
            error: "Slot Already booked",
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        {
          error: "Insert Failed",
          details: aptError.message,
          code: aptError.code ?? null,
          hint: aptError.hint ?? null,
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}
