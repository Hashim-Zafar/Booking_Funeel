import "server-only";
import { Resend } from "resend";
import { DateTime } from "luxon";

export async function sendConfirmationEmail({
  to,
  name,
  startTimeISO,
  timezone,
  token,
}: {
  to: string;
  name: string;
  startTimeISO: string;
  timezone: string;
  token: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  const appUrl =
    process.env.APP_URL?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!apiKey || !from || !appUrl) {
    throw new Error("Missing Resend environment variables");
  }

  const resend = new Resend(apiKey);

  const formatted = DateTime.fromISO(startTimeISO, { zone: "utc" })
    .setZone(timezone)
    .toFormat("cccc, LLLL d yyyy 'at' h:mm a ZZZZ");

  const confirmUrl = new URL(
    `/confirm-booking?token=${token}`,
    appUrl,
  ).toString();

  const result = await resend.emails.send({
    from,
    to,
    subject: "Confirm your booking",
    html: `
      <p>Hi ${name},</p>
      <p>You requested a call for <strong>${formatted}</strong>.</p>
      <p>Click the button below to confirm your booking:</p>
      <a href="${confirmUrl}" 
         style="display:inline-block;padding:12px 24px;background:#000;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
        Confirm Booking
      </a>
      <p>This link expires in 1 hour.</p>
    `,
  });

  if (result.error) {
    throw new Error(
      `Resend failed: ${result.error.name} (${result.error.statusCode ?? "unknown"}) ${result.error.message}`,
    );
  }
}
