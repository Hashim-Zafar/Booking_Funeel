"use client";

import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema as schema } from "@/src/lib/leadSchema";
import type { FormValues } from "@/src/lib/leadSchema";
import { QUESTIONS } from "@/src/utils";
import ContactInfo from "@/components/ContactInfo";
import PillRadio from "@/components/PillRadio";
import { useRouter } from "next/navigation";
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
      reminderChannel: "Email",
      whatsapp: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const router = useRouter();
  const values = watch();

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/leads", {
      method: "POST", //be default method is GET so we explicitly need to tell the browser that this is a POST
      headers: { "Content-Type": "application/json" }, //tell the browser content type of your POST request
      body: JSON.stringify(data), //fetch can not send plain JSON objects thats why we convert it into a string
    });
    const out = await res.json();

    if (!res.ok) {
      console.error(out);
      return;
    }
    router.push("/booking/confirmDate&Time");

    console.log("Inserted Row", out.lead);
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
                    {...register("email")}
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
                            // Always set the selected value
                            setValue(fieldName, v as any, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            // Special logic ONLY for reminderChannel
                            if (q.field === "reminderChannel") {
                              if (v !== "WhatsApp") {
                                // Clear whatsapp value when switching away
                                setValue("whatsapp", "", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }
                            }
                          }}
                        />
                      </div>

                      {fieldError && (
                        <p className="mt-2 text-sm text-red-600">
                          {fieldError}
                        </p>
                      )}

                      {/* Special case: WhatsApp input */}
                      {q.field === "reminderChannel" &&
                        values.reminderChannel === "WhatsApp" && (
                          <div className="mt-4">
                            <input
                              {...register("whatsapp", {
                                onChange: () => {
                                  // forces RHF to re-check schema as they type
                                  // (works with mode:onChange as well, but this makes it extra reliable)
                                },
                              })}
                              className="mt-2 w-full border-b border-black/10 bg-transparent py-3 text-base outline-none placeholder:text-black/30 focus:border-black/30"
                              placeholder="WhatsApp number (e.g. +92...) *"
                            />
                            {errors.whatsapp?.message && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.whatsapp.message}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}

                <div className="h-8" />
              </div>

              {/* Sticky footer submit */}
              <div className="sticky bottom-0 bg-[#f6f3ef] pt-4">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={[
                    "w-full rounded-full px-6 py-3 text-sm font-medium transition",
                    !isValid || isSubmitting
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
