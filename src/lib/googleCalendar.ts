import "server-only";
import { google } from "googleapis";

export async function createMeetingEvent({
  summary,
  startTimeISO,
  endTimeISO,
  timezone,
  attendeeEmail,
}: {
  summary: string;
  startTimeISO: string;
  endTimeISO: string;
  timezone: string;
  attendeeEmail: string;
}) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!privateKey || !serviceAccountEmail || !calendarId) {
    throw new Error("Missing Google Calendar environment variables");
  }

  // authenticate as service account
  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,  // required to generate Meet link
    sendUpdates: "none",        // don't send Google's invite emails
    requestBody: {
      summary,
      start: {
        dateTime: startTimeISO,
        timeZone: timezone,
      },
      end: {
        dateTime: endTimeISO,
        timeZone: timezone,
      },
    
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),      // must be unique per request
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  // extract the Meet link
  const meetLink =
    event.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video"
    )?.uri;

  if (!meetLink) {
    throw new Error("Google did not return a Meet link");
  }

  return {
    meetLink,
    eventId: event.data.id ?? "",
  };
}