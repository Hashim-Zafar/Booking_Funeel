"use client";

import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema as schema } from "@/src/lib/leadSchema";
import type { FormValues } from "@/src/lib/leadSchema";
import { QUESTIONS, ALLOWED_NEEDS, REQUIRE_PROOF_OF_DEMAND } from "@/src/utils";
import ContactInfo from "@/components/main-components/funnel/ContactInfo";
import PillRadio from "@/components/helper_components/PillRadio";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  isAdSpendQualified,
  isCreativeBudgetQualified,
} from "@/src/utils/helpers";

// --- qualification checker ---
function getDisqualificationReasons(data: FormValues): string[] {
  const reasons: string[] = [];

  if (
    data.decisionMaker === "No" &&
    data.bringDecisionMaker !== undefined &&
    !(data.bringDecisionMaker as string).includes("Yes")
  ) {
    reasons.push("We can only proceed if the decision maker joins the call.");
  }
  if (data.adSpend && !isAdSpendQualified(data.adSpend)) {
    reasons.push(
      "We're currently a fit for brands spending $500+/month on ads.",
    );
  }
  if (data.creativeBudget && !isCreativeBudgetQualified(data.creativeBudget)) {
    reasons.push(
      "We're currently a fit for budgets of $800+/month for creative production.",
    );
  }
  if (data.need && !ALLOWED_NEEDS.includes(data.need as any)) {
    reasons.push("We're not the best fit for that request right now.");
  }
  if (data.startWhen === "Just researching") {
    reasons.push("Please reach out when you're closer to starting.");
  }
  if (REQUIRE_PROOF_OF_DEMAND && data.demand === "Not yet") {
    reasons.push(
      "We prioritize brands with an offer already converting (sales/leads).",
    );
  }

  return reasons;
}

// --- disqualification modal ---
function DisqualificationModal({
  reasons,
  onClose,
}: {
  reasons: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <span className="text-lg text-red-600">✕</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Not a fit right now
          </h2>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          Based on your answers, here's why we may not be the best match at this
          time:
        </p>

        <ul className="mb-6 space-y-2">
          {reasons.map((reason, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="mt-0.5 text-red-400">•</span>
              {reason}
            </li>
          ))}
        </ul>

        <p className="mb-6 text-sm text-gray-400">
          Your information has been saved. We'll reach out if anything changes.
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function ContactSplitLayout() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      decisionMaker: undefined,
      bringDecisionMaker: undefined,
      adSpend: undefined,
      creativeBudget: undefined,
      need: undefined,
      startWhen: undefined,
      demand: undefined,
      assets: undefined,
      whatsapp: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const values = watch();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [dqReasons, setDqReasons] = useState<string[]>([]);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setEmailTaken(false);

    // check for existing booking
    const checkRes = await fetch(
      `/api/funnel/check-booking?email=${encodeURIComponent(data.email)}`,
    );
    const checkData = await checkRes.json();

    if (checkData.exists) {
      setEmailTaken(true);
      setSubmitError(
        "An appointment already exists for this email. Please contact us if you need to reschedule.",
      );
      return;
    }

    // check qualification — but don't block submission
    const reasons = getDisqualificationReasons(data);
    const qualified = reasons.length === 0;

    // always submit — pass qualified flag to the API
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, qualified }),
    });
    const out = await res.json();

    if (!res.ok) {
      setSubmitError(out.error ?? "Something went wrong. Please try again.");
      return;
    }

    if (!qualified) {
      // show disqualification modal instead of redirecting
      setDqReasons(reasons);
      return;
    }

    // qualified — proceed as normal
    router.push("/booking/confirmDate&Time");
  };

  return (
    <>
      {dqReasons.length > 0 && (
        <DisqualificationModal
          reasons={dqReasons}
          onClose={() => setDqReasons([])}
        />
      )}

      <section className="min-h-screen bg-[#f6f3ef]">
        <div className="px-5 py-12 lg:px-10 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <ContactInfo />

            <div className="rounded-2xl bg-transparent lg:h-[calc(100vh-8rem)] lg:min-h-0 lg:overflow-hidden">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex h-full min-h-0 flex-col"
              >
                <div className="min-h-0 flex-1 space-y-8 lg:overflow-y-auto lg:pr-2">
                  <div>
                    <input
                      {...register("name")}
                      className="mt-2 w-full border-b border-black/10 bg-transparent py-3 text-base outline-none placeholder:text-black/30 focus:border-black/30"
                      placeholder="Name *"
                    />
                    {errors.name?.message && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("email", {
                        onChange: () => {
                          setEmailTaken(false);
                          setSubmitError(null);
                        },
                      })}
                      className="mt-2 w-full border-b border-black/10 bg-transparent py-3 text-base outline-none placeholder:text-black/30 focus:border-black/30"
                      placeholder="Email *"
                    />
                    {errors.email?.message && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {QUESTIONS.map((q) => {
                    const shouldShow = q.showWhen ? q.showWhen(values) : true;
                    if (!shouldShow) return null;

                    const fieldName = q.field as Path<FormValues>;
                    const fieldValue = (values as any)[q.field];
                    const fieldError = (errors as any)?.[q.field]?.message as
                      | string
                      | undefined;

                    return (
                      <div key={q.key}>
                        <p className="text-sm font-medium text-black/70">
                          {q.label}
                        </p>
                        <div className="mt-3">
                          <PillRadio
                            name={q.field}
                            options={q.options as any}
                            value={fieldValue}
                            onChange={(v) => {
                              setValue(fieldName, v as any, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                          />
                        </div>
                        {fieldError && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldError}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="h-8" />
                </div>

                <div className="sticky bottom-0 bg-[#f6f3ef] pt-4">
                  {submitError && (
                    <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting || emailTaken}
                    className={[
                      "w-full rounded-full px-6 py-3 text-sm font-medium transition",
                      !isValid || isSubmitting || emailTaken
                        ? "cursor-not-allowed bg-black/20 text-black/50"
                        : "bg-black text-white hover:bg-black/90",
                    ].join(" ")}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
