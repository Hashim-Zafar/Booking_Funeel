import BudgetDistribution from "@/components/helper_components/budgetDistribuition";
import DecisionMakerRate from "@/components/helper_components/decisionMakerRate";
import LeadIntent from "@/components/helper_components/leadIntent";
import ReadinessTimeline from "@/components/helper_components/readinessTimeline";

import { LeadQualityData, leadInsightProps, error } from "@/src/utils/types";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
import { isErrorResponse } from "@/src/utils/helpers";
import AdSpendDistribution from "@/components/helper_components/adSpend";

//fetch data from the database
async function getLeadQualityData(
  startDate: string,
): Promise<LeadQualityData | error> {
  //call the function
  const { data, error: supabaseError } = await supabaseAdmin.rpc(
    "get_lead_quality",
    {
      start_date: startDate,
      end_date: new Date().toISOString(),
    },
  );

  // !Database/system error
  if (supabaseError) {
    console.error("Supabase error:", supabaseError);
    return { success: false, error: supabaseError.message };
  }

  // !No data returned
  if (!data || data.length === 0) {
    return { success: false, error: "No leads found" };
  }

  const raw = data[0];

  return {
    totalRows: raw.total_rows,
    budget: {
      lt300: raw.budget_lt_300,
      b300_800: raw.budget_300_800,
      b800_2000: raw.budget_800_2000,
      b2000_5000: raw.budget_2000_5000,
      b5000Plus: raw.budget_5000_plus,
    },
    decision: {
      decisionMaker: raw.decision_maker,
      needsToBringSomeone: raw.needs_to_bring_someone,
    },
    adSpend: {
      zero: raw.adspend_0,
      s1_500: raw.adspend_1_500,
      s500_2000: raw.adspend_500_2000,
      s2000_10000: raw.adspend_2000_10000,
      s10000Plus: raw.adspend_10000_plus,
    },
    startTimeline: {
      asap: raw.start_asap,
      oneToTwoWeeks: raw.start_1_2_weeks,
      thisMonth: raw.start_this_month,
    },
    needs: {
      adCreatives: raw.need_ad_creatives,
      ugc: raw.need_ugc,
      brandVideo: raw.need_brand_video,
      notSure: raw.need_not_sure,
    },
  };
}

export default async function LeadInsights({ startDate }: leadInsightProps) {
  const data = await getLeadQualityData(startDate);

  // Type narrowing with guard
  if (isErrorResponse(data)) {
    return (
      <div className="kpi-error">
        Failed to load lead insights: {data.error}
      </div>
    );
  }

  // Now TypeScript knows `data` is LeadQualityData
  return (
    <div className="lead-insights">
      <div className="lead-insights__header">
        <div>
          <h2 className="lead-insights__title">Lead Profile Insights</h2>
          <p className="lead-insights__subtitle">
            AGGREGATED PERFORMANCE METRICS &amp; AUDIENCE SEGMENTATION
          </p>
        </div>
      </div>

      <div className="lead-insights__grid">
        <div className="lead-insights__col">
          <BudgetDistribution budget={data.budget} totalRows={data.totalRows} />
          <DecisionMakerRate
            decision={data.decision}
            totalRows={data.totalRows}
          />
          <div className="lead-insights__dq-placeholder" />
        </div>

        <div className="lead-insights__col">
          <LeadIntent needs={data.needs} totalRows={data.totalRows} />
          <AdSpendDistribution
            adSpend={data.adSpend}
            totalRows={data.totalRows}
          />
          <ReadinessTimeline
            startTimeline={data.startTimeline}
            totalRows={data.totalRows}
          />
        </div>
      </div>
    </div>
  );
}
