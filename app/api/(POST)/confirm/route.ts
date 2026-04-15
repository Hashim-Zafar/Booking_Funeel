import { NextResponse } from "next/server";
import { confirmRequestBody } from "@/src/lib/confirmRoute";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import { isUniqueVoilation } from "@/src/utils/helpers";

export async function POST(req: Request) {
  try {
    console.log("Confirm route Hit");
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
    console.log("Querying the database");
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
          { status: 404 },
        );
      }
      return NextResponse.json(
        { message: "Failed to look up confirmation token" },
        { status: 500 },
      );
    }

    console.log("Inserting data into db");
    //?insert data extracted from pending_appointments and insert it with in appointments
    const { data: appointment_data, error: appointment_error } =
      await supabaseAdmin.from("appointments").insert({
        invitee_name: pending_data.name,
        invitee_email: pending_data.email,
        start_time: pending_data.start_time,
        end_time: pending_data.end_time,
        timezone: pending_data.timezone,
        lead_id: pending_data.lead_id,
        meeting_link: pending_data.meeting_link,
        status: "Booked",
      });
    //!guard clause
    if (appointment_error) {
      console.error("Appointment error ", appointment_error);
      if (isUniqueVoilation(appointment_error)) {
        return NextResponse.json(
          { message: "Slot already booked" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        {
          message: "Failed to create appointment",
          error: appointment_error.message,
          details: appointment_error.details,
          hint: appointment_error.hint,
          code: appointment_error.code,
        },
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
