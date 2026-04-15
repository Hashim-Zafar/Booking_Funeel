"use client";

import { useEffect, useState } from "react";

export default function ConfirmView({ token }: { token: string | null }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid confirmation link");
      return;
    }
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
        setTimeout(() => setVisible(true), 100);
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    }
    fetchAPI();
  }, [token]);

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#090b10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-[#1e293b]" />
            <div className="absolute inset-0 rounded-full border-t-2 border-[#38bdf8] animate-spin" />
          </div>
          <p className="text-[#475569] text-sm tracking-widest uppercase font-mono">
            Confirming booking…
          </p>
        </div>
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#090b10] flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-[#1e293b] rounded-2xl p-8 bg-[#0d1117] text-center">
          {/* X icon */}
          <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
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
          <h2 className="text-white text-xl font-semibold mb-2">
            {message ?? "Something went wrong"}
          </h2>
          {details && <p className="text-[#64748b] text-sm mb-1">{details}</p>}
          {error && (
            <p className="text-red-400/70 text-xs font-mono mt-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#090b10] flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[100px]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Card */}
      <div
        className={`relative max-w-lg w-full transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Top border glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-sky-500/30 via-transparent to-transparent pointer-events-none" />

        <div className="rounded-2xl bg-[#0d1117]/90 border border-[#1e293b] backdrop-blur-xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-sky-600/20 via-violet-600/10 to-transparent border-b border-[#1e293b] px-8 py-6 flex items-center gap-4">
            {/* Checkmark */}
            <div className="shrink-0 w-12 h-12 rounded-full bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-sky-400"
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
              <p className="text-xs font-mono tracking-widest text-sky-400/70 uppercase mb-0.5">
                Booking confirmed
              </p>
              <h1 className="text-white text-xl font-semibold">
                You're all set 🎉
              </h1>
            </div>
          </div>

          <div className="px-8 py-7 space-y-5">
            {/* Reminders card */}
            <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-5">
              <div className="flex items-center gap-2.5 mb-4">
                {/* Bell icon */}
                <svg
                  className="w-4 h-4 text-amber-400"
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
                <span className="text-white text-sm font-medium">
                  Smart Reminders
                </span>
              </div>
              <p className="text-[#64748b] text-sm leading-relaxed mb-4">
                You'll receive email reminders at these intervals before the
                meeting so you never miss it:
              </p>
              <div className="flex gap-2 flex-wrap">
                {["24 hours", "3 hours", "30 minutes"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/20 text-amber-300 rounded-full px-3 py-1 text-xs font-mono"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    {t} before
                  </span>
                ))}
              </div>
            </div>

            {/* Demo notice */}
            <div className="rounded-xl bg-[#111827] border border-violet-500/20 p-5 flex gap-3">
              <div className="shrink-0 mt-0.5">
                {/* Info icon */}
                <svg
                  className="w-4 h-4 text-violet-400"
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
              <div>
                <p className="text-violet-300 text-sm font-medium mb-1">
                  Demo Mode
                </p>
                <p className="text-[#64748b] text-sm leading-relaxed">
                  This is a demo version — a real video call link won't be
                  generated. This lets you experience the full booking flow as
                  your leads would.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1e293b]" />

            {/* CTA */}
            <div>
              <p className="text-[#475569] text-xs tracking-widest uppercase font-mono mb-3">
                Like what you see?
              </p>
              <p className="text-[#94a3b8] text-sm mb-4 leading-relaxed">
                Get this booking system set up for your business. Reach out and
                let's talk.
              </p>
              <div className="flex items-center gap-3">
                {/* Email */}
                <a
                  href="mailto:hashimzafarwork@gmail.com"
                  title="hashimzafarwork@gmail.com"
                  className="group flex items-center gap-2.5 bg-[#111827] hover:bg-sky-500/10 border border-[#1e293b] hover:border-sky-500/30 text-[#94a3b8] hover:text-sky-300 rounded-xl px-4 py-2.5 text-sm transition-all duration-200"
                >
                  {/* Mail icon */}
                  <svg
                    className="w-4 h-4 shrink-0"
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
                  <span>Email me</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/hashim-zafar-1496ba366/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn — Hashim Zafar"
                  className="group flex items-center gap-2.5 bg-[#111827] hover:bg-sky-500/10 border border-[#1e293b] hover:border-sky-500/30 text-[#94a3b8] hover:text-sky-300 rounded-xl px-4 py-2.5 text-sm transition-all duration-200"
                >
                  {/* LinkedIn icon */}
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#1e293b] px-8 py-4 bg-[#090b10]/60 flex items-center justify-between">
            <span className="text-[#334155] text-xs font-mono">
              demo.booking
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#334155] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
