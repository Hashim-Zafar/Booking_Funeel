import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import { cookies } from "next/headers";
import {
  parseStartISO,
  computeEnd,
  isAlignedToSlot,
  isWithInAvailability,
  isFutureSlot,
  isUniqueVoilation,
} from "@/src/utils/helpers";
import { appointmentSchema } from "@/src/lib/appointmentSchema";
import { sendConfirmationEmail } from "@/src/lib/resend";

export async function POST(req: Request) {
  try {
    // initialize the cookie store
    const cookieStore = await cookies();
    const leadID = cookieStore.get("lead_id")?.value;

    //! guard clause
    if (!leadID) {
      return NextResponse.json(
        { error: "Missing Lead context (Lead_id)" },
        { status: 404 },
      );
    }

    const json = await req.json();
    const parsed = appointmentSchema.safeParse(json);

    //! guard clause
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    // fetch lead data
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .select("id,name,email,qualified")
      .eq("id", leadID)
      .single();

    //! guard clause
    if (!lead || leadError) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // compute and validate times
    const dtStart = parseStartISO(parsed.data.start_time);

    //! guard clause
    if (!dtStart) {
      return NextResponse.json(
        { error: "Invalid Start Time" },
        { status: 400 },
      );
    }

    const dtEnd = computeEnd(dtStart);

    //! guard clause
    if (!isAlignedToSlot(dtStart)) {
      return NextResponse.json(
        { error: "start_time must be aligned to 40-minute slots" },
        { status: 400 },
      );
    }

    //! guard clause
    if (!isWithInAvailability(dtStart, dtEnd)) {
      return NextResponse.json(
        { error: "Selected slot is outside availability" },
        { status: 400 },
      );
    }

    if (!isFutureSlot(dtStart)) {
      return NextResponse.json(
        { error: "Selected slot is in the past" },
        { status: 400 },
      );
    }

    const startUTC = dtStart.toUTC().toISO();
    const endUTC = dtEnd.toUTC().toISO();

    //! guard clause
    if (!startUTC || !endUTC) {
      return NextResponse.json(
        { error: "Could not normalize appointment time" },
        { status: 400 },
      );
    }

    // check if slot is already pending
    const { data: pending, error: pendingError } = await supabaseAdmin
      .from("pending_appointments")
      .select("id")
      .eq("start_time", startUTC)
      .is("confirmed_at", null)
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    //! guard clause
    if (pendingError) {
      return NextResponse.json(
        { error: "Failed to check pending slots" },
        { status: 500 },
      );
    }

    //! guard clause
    if (pending && pending.length > 0) {
      return NextResponse.json(
        { error: "Slot is already pending confirmation" },
        { status: 409 },
      );
    }

    // generate token and expiry
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // insert into pending_appointments
    const { error: insertError } = await supabaseAdmin
      .from("pending_appointments")
      .insert({
        token,
        name: lead.name,
        email: lead.email,
        lead_id: lead.id,
        timezone: parsed.data.timezone ?? "UTC",
        expires_at: expiresAt,
        start_time: startUTC,
        end_time: endUTC,
      });

      console.log("INSERT ERROR:", JSON.stringify(insertError, null, 2));


    //! guard clause
    if (insertError) {
      if (isUniqueVoilation(insertError)) {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        {
          error: "Failed to hold slot",
          details: insertError.message,
          code: insertError.code,
        },
        { status: 500 },
      );
    }

    // send confirmation email — rollback pending row if it fails
    try {
      await sendConfirmationEmail({
        to: lead.email,
        name: lead.name,
        startTimeISO: startUTC,
        timezone: parsed.data.timezone ?? "UTC",
        token,
      });
    } catch (error) {
      console.error("Failed to send confirmation email", error);
      await supabaseAdmin
        .from("pending_appointments")
        .delete()
        .eq("token", token);

      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Confirmation email sent. Please check your inbox." },
      { status: 202 },
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
