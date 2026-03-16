import "server-only";

export async function createDailyRoom(endTimeISO: string): Promise<string> {
  const apiKey = process.env.DAILY_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DAILY_API_KEY environment variable");
  }

  // room expires 1 hour after the meeting ends
  const exp = Math.floor(new Date(endTimeISO).getTime() / 1000) + 60 * 60;

  const response = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        exp,
        enable_chat: true,
        enable_screenshare: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Daily.co API error: ${JSON.stringify(error)}`);
  }

  const room = await response.json();
  console.log(room.url)
  return room.url;
}