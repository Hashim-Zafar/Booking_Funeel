import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Resend } from "npm:resend";

// time windows in minutes
const WINDOWS: Record<string, { lower: number; upper: number }> = {
  "24h": { lower: 23 * 60 + 50, upper: 24 * 60 + 10 },
  "3h":  { lower: 2 * 60 + 50,  upper: 3 * 60 + 10  },
  "30m": { lower: 20,            upper: 40            },
};

Deno.serve(async (req) => {
  try {
    // Step 1: parse and validate the label
    const { label } = await req.json();
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
//!guard clause
if (!supabaseUrl || !serviceKey) {
  return new Response(
    JSON.stringify({ error: "Missing environment variables" }),
    { status: 500, headers: { "Content-Type": "application/json" } },
  );
}

    // Step 2: initialize clients
 const supabase = createClient(supabaseUrl, serviceKey);
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
    const resendFrom = Deno.env.get("RESEND_FROM")!;

    // Step 3: compute time window
    const now = new Date();
    const lower = new Date(now.getTime() + WINDOWS[label].lower * 60 * 1000);
    const upper = new Date(now.getTime() + WINDOWS[label].upper * 60 * 1000);

    // Step 4: query appointments that need this reminder
    const { data: appointments, error: queryError } = await supabase
      .from("appointments")
      .select("id, invitee_name, invitee_email, start_time, timezone, reminders_sent")
      .gte("start_time", lower.toISOString())
      .lte("start_time", upper.toISOString())
      .neq("status", "canceled")
      .not("reminders_sent", "cs", `{"${label}"}`);

    if (queryError) {
      return new Response(
        JSON.stringify({ error: "Failed to query appointments", details: queryError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ message: "No reminders to send" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Step 5: send email and mark reminder as sent for each appointment
    const results = await Promise.allSettled(
      appointments.map(async (apt) => {
        // format the meeting time in the lead's timezone
        const meetingTime = new Date(apt.start_time).toLocaleString("en-US", {
          timeZone: apt.timezone ?? "UTC",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const labelText = {
          "24h": "24 hours",
          "3h": "3 hours",
          "30m": "30 minutes",
        }[label];

        // send reminder email
        await resend.emails.send({
          from: resendFrom,
          to: apt.invitee_email,
          subject: `Reminder: Your call is in ${labelText}`,
          html: `
            <p>Hi ${apt.invitee_name},</p>
            <p>This is a reminder that your call is coming up in <strong>${labelText}</strong>.</p>
            <p><strong>When:</strong> ${meetingTime}</p>
            <p><strong>Meeting link:</strong> <a href="${apt.meeting_link}">${apt.meeting_link}</a></p>
            <p>See you soon!</p>
          `,
        });

        // mark reminder as sent
        const { error: updateError } = await supabase
          .from("appointments")
          .update({
            reminders_sent: [...(apt.reminders_sent ?? []), label],
          })
          .eq("id", apt.id);

        if (updateError) {
       
          console.error(`Failed to update reminders_sent for appointment ${apt.id}:`, updateError.message);
        }

        return apt.id;
      }),
    );

    // Step 6: summarize results
    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return new Response(
      JSON.stringify({
        message: `Processed ${appointments.length} appointments`,
        sent,
        failed,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});