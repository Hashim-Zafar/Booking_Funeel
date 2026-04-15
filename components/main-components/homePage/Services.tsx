import { ReactNode } from "react";

interface Service {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
}

const services: Service[] = [
  {
    title: "Content Creation",
    description:
      "Short-form video, UGC, reels, and visuals designed to stop the scroll and spark engagement.",
    gradient: "from-amber-50 to-stone-100",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="3"
          y="3"
          width="26"
          height="26"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 10l12 6-12 6V10z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Social Management",
    description:
      "We handle your content calendar, posting, and day-to-day management of your socials.",
    gradient: "from-stone-100 to-amber-50",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 9v7l5 2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Paid Media",
    description:
      "We build and manage targeted ad campaigns that turn attention into results and help you scale.",
    gradient: "from-stone-100 to-stone-200",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M4 24l7-9 6 6 5-7 6 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Services() {
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
        Services
      </p>
      <h2
        style={{ color: "var(--color-200)" }}
        className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-lg mb-14"
      >
        How we can help you grooow
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {services.map((service) => (
          <div
            key={service.title}
            style={{ backgroundColor: "var(--color-300)" }}
            className="rounded-2xl p-7 flex flex-col gap-5 hover:-translate-y-1 transition-transform duration-300 cursor-default"
          >
            {/* Visual placeholder */}
            <div
              className={`w-full h-48 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}
            >
              <span
                style={{ color: "var(--color-200)" }}
                className="opacity-25"
              >
                {service.icon}
              </span>
            </div>

            <h3
              style={{ color: "var(--color-200)" }}
              className="text-lg font-semibold"
            >
              {service.title}
            </h3>
            <p
              style={{ color: "var(--color-500)" }}
              className="text-sm leading-relaxed"
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
