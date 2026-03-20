import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import { querySchema } from "@/src/lib/dashboardRoutesSchema";

export async function GET(req: NextRequest) {
  try {
    //fetch the data from the params
    const rawParams = {
      start_date: req.nextUrl.searchParams.get("start_date"),
      end_date:
        req.nextUrl.searchParams.get("end_date") ?? new Date().toISOString(),
    };

    const parsed = querySchema.safeParse(rawParams);
    //!guard clause
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    //destructure data
    const { start_date, end_date } = parsed.data;
    //call the postgre function we made
    const { data, error } = await supabaseAdmin.rpc("get_dashboard_kpis", {
      start_date,
      end_date,
    });
    //!guard clause
    if (error) throw new Error(error.message);

    const result = data?.[0];
    //!guard clause
    if (!result) {
      return NextResponse.json({ error: "No data returned" }, { status: 500 });
    }
    //return data
    return NextResponse.json(
      {
        totalLeads: result.total_leads,
        qualifiedLeads: result.qualified_leads,
        totalAppointments: result.total_appointments,
        bookedAppointments: result.booked_appointments,
        attendedAppointments: result.attended_appointments,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error" },
      { status: 500 },
    );
  }
}
