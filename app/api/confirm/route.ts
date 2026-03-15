import { NextResponse } from "next/server";
import { confirmRequestBody } from "@/src/lib/confirmRoute";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import { isUniqueVoilation } from "@/src/utils/helpers";
import { createMeetingEvent } from "@/src/lib/googleCalendar";

export async function POST(req: Request) {
  let meetLink: string;
let eventId: string;
  try {
    const request = await req.json();
    const parsed = confirmRequestBody.safeParse(request);
    //!guard clause
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Failed to parse the request",
        },
        {
          status: 400,
        },
      );
    }
    //?Query the pending_appointments table to get neccessary data
    const { data: pending_data, error: pending_error } = await supabaseAdmin
      .from("pending_appointments")
      .select(
        "id , email , start_time , end_time ,name ,lead_id , meeting_link, timezone",
      )
      .eq("token", parsed.data.token)
      .is("confirmed_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();
    //!guard clause
   if (pending_error) {
  // PGRST116 means no rows found — treat as expired/used
  if (pending_error.code === "PGRST116") {
    return NextResponse.json(
      { message: "Link expired or already used" },
      { status: 404 }
    );
  }
  return NextResponse.json(
    { message: "Failed to look up confirmation token" },
    { status: 500 }
  );
}

//generate the meeting link
try {
  const result = await createMeetingEvent({
    summary: `Call with ${pending_data.name}`,
    startTimeISO: pending_data.start_time,
    endTimeISO: pending_data.end_time,
    timezone: pending_data.timezone ?? "UTC",
    attendeeEmail: pending_data.email,
  });
  meetLink = result.meetLink;
  eventId = result.eventId;
} catch (err) {
  return NextResponse.json(
    { message: "Failed to generate meeting link", details: String(err) },
    { status: 500 }
  );
}
    //?insert data extracted from pending_appointments and insert it with in appointments
    const { data: appointment_data, error: appointment_error } =
      await supabaseAdmin.from("appointments").insert({
        invitee_name: pending_data.name,
        invitee_email: pending_data.email,
        start_time: pending_data.start_time,
        end_time: pending_data.end_time,
        timezone: pending_data.timezone,
        lead_id: pending_data.lead_id,
        meeting_link: meetLink,
        status: "confirmed",
        google_event_id: eventId,
      });
    //!guard clause
    if (appointment_error) {
      if (isUniqueVoilation(appointment_error)) {
        return NextResponse.json(
          { message: "Slot already booked" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { message: "Failed to create appointment" },
        { status: 500 },
      );
    }
    const { data, error } = await supabaseAdmin
      .from("pending_appointments")
      .update({
        confirmed_at: new Date().toISOString(),
      })
      .eq("token", parsed.data.token)
      .select();
      //!minor guard clause
   if (error) {
  console.error("Failed to stamp confirmed_at", error);
}
    return NextResponse.json(
      {
        data: appointment_data,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({
      message: ` An error occured while confirming your booking , ${err}`,
    });
  }
}
