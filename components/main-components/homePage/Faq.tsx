"use client";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How quickly will we see results?",
    answer:
      "Most clients see increased engagement within the first 2 weeks, with significant growth typically happening by month 2. We focus on building sustainable momentum rather than quick spikes that don't last.",
  },
  {
    question: "What platforms do you manage?",
    answer:
      "We handle Instagram, TikTok, Facebook, LinkedIn, and Twitter. We recommend focusing on 2–3 platforms where your audience is most active rather than spreading thin across everything.",
  },
  {
    question: "Do you work with our industry?",
    answer:
      "We've worked with beauty, fashion, food, tech, wellness, and professional services. Our approach adapts to any industry — what matters is understanding your audience and goals.",
  },
  {
    question: "What if we want to cancel?",
    answer:
      "No problem. We work month-to-month with 30 days notice. No long-term contracts or cancellation fees. We're confident you'll want to stay, but we don't believe in trapping anyone.",
  },
  {
    question: "How involved do we need to be?",
    answer:
      "You stay as involved as you want. Some clients prefer weekly check-ins, others are happy with monthly reviews. We handle the day-to-day so you can focus on running your business.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 py-20"
    >
      <p
        style={{ color: "var(--color-500)" }}
        className="text-xs uppercase tracking-widest font-medium mb-4"
      >
        Questions
      </p>
      <h2
        style={{ color: "var(--color-200)" }}
        className="text-3xl md:text-4xl font-bold tracking-tight leading-snug max-w-md mb-14"
      >
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col gap-3 max-w-3xl">
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{ backgroundColor: "var(--color-400)" }}
            className="rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span
                style={{ color: "var(--color-200)" }}
                className="text-sm font-semibold pr-4"
              >
                {faq.question}
              </span>
              <span
                style={{ color: "var(--color-200)" }}
                className={`flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1v8M1 5h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            {/* Accordion content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p
                style={{ color: "var(--color-500)" }}
                className="px-6 pb-6 text-sm leading-relaxed"
              >
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
