import { NextRequest } from "next/server";
import { DateTime } from "luxon";
import { timezone } from "@/src/utils/availibility";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import { NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const startDay = DateTime.now()
      .setZone(timezone)
      .startOf("day")
      .toUTC()
      .toISO();
    const endDay = DateTime.now()
      .setZone(timezone)
      .plus({ days: 4 })
      .endOf("day")
      .toUTC()
      .toISO();
    console.log(startDay, endDay);
    if (!startDay || !endDay) {
      throw new Error("Failed to generate ISO dates");
    }

    const { data, error } = await supabaseAdmin.rpc("get_lead_data", {
      start_day: startDay,
      end_day: endDay,
    });
    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
