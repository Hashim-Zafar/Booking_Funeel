import { NextRequest, NextResponse } from "next/server";
import { querySchema } from "@/src/lib/dashboardRoutesSchema";
import { supabaseAdmin } from "@/src/supabaseClients/admin";

export async function GET(req: NextRequest) {
  try {
    //fetch the data from the params
    const rawParams = {
      start_date: req.nextUrl.searchParams.get("start_date"),
      end_date:
        req.nextUrl.searchParams.get("end_date") ?? new Date().toISOString(),
    };
    //safe parse using zod
    const parsed = querySchema.safeParse(rawParams);
    //!guard clause
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0].message,
        },
        { status: 400 },
      );
    }
    //destructure the data
    const { start_date, end_date } = parsed.data;
    //call the database function
    const { data, error } = await supabaseAdmin.rpc("get_lead_quality", {
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
    return NextResponse.json({
      totalRows: result.total_rows,

      budget: {
        lt300: result.budget_lt_300,
        b300_800: result.budget_300_800,
        b800_2000: result.budget_800_2000,
        b2000_5000: result.budget_2000_5000,
        b5000Plus: result.budget_5000_plus,
      },

      decision: {
        decisionMaker: result.decision_maker,
        needsToBringSomeone: result.needs_to_bring_someone,
      },

      adSpend: {
        zero: result.adspend_0,
        s1_500: result.adspend_1_500,
        s500_2000: result.adspend_500_2000,
        s2000_10000: result.adspend_2000_10000,
        s10000Plus: result.adspend_10000_plus,
      },

      startTimeline: {
        asap: result.start_asap,
        oneToTwoWeeks: result.start_1_2_weeks,
        thisMonth: result.start_this_month,
      },

      needs: {
        adCreatives: result.need_ad_creatives,
        ugc: result.need_ugc,
        brandVideo: result.need_brand_video,
        notSure: result.need_not_sure,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error" },
      { status: 500 },
    );
  }
}
