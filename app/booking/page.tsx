"use client";

import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema as schema } from "@/src/lib/leadSchema";
import type { FormValues } from "@/src/lib/leadSchema";
import { QUESTIONS } from "@/src/utils";
import ContactInfo from "@/components/main-components/funnel/ContactInfo";
import PillRadio from "@/components/helper_components/PillRadio";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setEmailTaken(false);

    // check for existing booking before submitting
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

    // proceed with lead submission
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const out = await res.json();

    if (!res.ok) {
      setSubmitError(out.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/booking/confirmDate&Time");
  };

  return (
    <section className="min-h-screen bg-[#f6f3ef]">
      <div className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ContactInfo />

          {/* RIGHT (FORM PANEL) */}
          <div className="rounded-2xl bg-transparent lg:h-[calc(100vh-8rem)] lg:min-h-0 lg:overflow-hidden">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-full min-h-0 flex-col"
            >
              {/* Scrollable content */}
              <div className="min-h-0 flex-1 space-y-8 lg:overflow-y-auto lg:pr-2">
                {/* Name */}
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

                {/* Email */}
                <div>
                  <input
                    {...register("email", {
                      onChange: () => {
                        // reset email taken state when user edits email
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

                {/* Questions (config-driven) */}
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

              {/* Sticky footer submit */}
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
  );
}
