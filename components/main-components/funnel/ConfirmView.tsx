"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONTACT_EMAIL = "hashimzafarwork@gmail.com";

export default function ConfirmView({ token }: { token: string | null }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(() =>
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState<string | null>(() =>
    token ? null : "Invalid confirmation link",
  );
  const [details, setDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  useEffect(() => {
    if (!token || status === "error") return;

    async function fetchAPI() {
      try {
        const res = await fetch("/api/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message ?? "Something went wrong");
          setDetails(data.details ?? "Failed to fetch details");
          setError(data.error ?? "Failed to fetch the error message");
          return;
        }

        setStatus("success");
        window.setTimeout(() => setVisible(true), 100);
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    }

    fetchAPI();
  }, [status, token]);

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timeout = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b10]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-[#1e293b]" />
            <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-[#38bdf8]" />
          </div>
          <p className="font-mono text-sm uppercase tracking-widest text-[#475569]">
            Confirming booking...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b10] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#1e293b] bg-[#0d1117] p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            {message ?? "Something went wrong"}
          </h2>
          {details && <p className="mb-1 text-sm text-[#64748b]">{details}</p>}
          {error && (
            <p className="mt-3 rounded-lg border border-red-500/10 bg-red-500/5 px-4 py-2 font-mono text-xs text-red-400/70">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b10] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div
        className={`relative w-full max-w-lg transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-sky-500/30 via-transparent to-transparent" />

        <div className="overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0d1117]/90 backdrop-blur-xl">
          <div className="flex items-center gap-4 border-b border-[#1e293b] bg-gradient-to-r from-sky-600/20 via-violet-600/10 to-transparent px-8 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-500/15">
              <svg
                className="h-5 w-5 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <p className="mb-0.5 font-mono text-xs uppercase tracking-widest text-sky-400/70">
                Booking confirmed
              </p>
              <h1 className="text-xl font-semibold text-white">
                You are all set.
              </h1>
            </div>
          </div>

          <div className="space-y-5 px-8 py-7">
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <span className="text-sm font-medium text-white">
                  Smart reminders
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[#64748b]">
                You will receive email reminders at these intervals before the
                meeting so you never miss it:
              </p>
              <div className="flex flex-wrap gap-2">
                {["24 hours", "3 hours", "30 minutes"].map((time) => (
                  <span
                    key={time}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {time} before
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-violet-500/20 bg-[#111827] p-5">
              <div className="mt-0.5 shrink-0">
                <svg
                  className="h-4 w-4 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
              <div className="w-full space-y-3">
                <div>
                  <p className="mb-1 text-sm font-medium text-violet-300">
                    Demo mode
                  </p>
                  <p className="text-sm leading-relaxed text-[#64748b]">
                    This is a demo version, but in a real system the booking
                    flow would generate the meeting link automatically and keep
                    the appointment synced end to end.
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[#64748b]">
                  If a lead misses the call, the system can trigger follow-up
                  outreach, update lead status, and continue the downstream
                  automations after the meeting.
                </p>
                <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2">
                  <p className="font-mono text-xs uppercase tracking-widest text-violet-200">
                    Want to see the dashboard too?
                  </p>
                  <Link
                    href="/grok"
                    className="mt-2 inline-flex items-center gap-2 text-sm text-violet-300 transition hover:text-violet-200"
                  >
                    Open the dashboard preview
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1e293b]" />

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#475569]">
                Like what you see?
              </p>
              <p className="mb-4 text-sm leading-relaxed text-[#94a3b8]">
                Get this booking system set up for your business. Reach out and
                let&apos;s talk.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title={CONTACT_EMAIL}
                  className="group flex items-center gap-2.5 rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-2.5 text-sm text-[#94a3b8] transition-all duration-200 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-300"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span>
                    {copyStatus === "copied"
                      ? "Email copied"
                      : copyStatus === "failed"
                        ? "Copy failed"
                        : "Copy email"}
                  </span>
                </button>

                <a
                  href="https://www.linkedin.com/in/hashim-zafar-1496ba366/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn - Hashim Zafar"
                  className="group flex items-center gap-2.5 rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-2.5 text-sm text-[#94a3b8] transition-all duration-200 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-300"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
              <p className="mt-3 font-mono text-xs text-[#475569]">
                {copyStatus === "failed"
                  ? `Could not copy automatically. Email: ${CONTACT_EMAIL}`
                  : CONTACT_EMAIL}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#1e293b] bg-[#090b10]/60 px-8 py-4">
            <span className="font-mono text-xs text-[#334155]">
              demo.booking
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#334155]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
