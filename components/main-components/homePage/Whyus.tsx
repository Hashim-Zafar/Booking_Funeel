const otherAgency: string[] = [
  "Generic content templates",
  "Monthly reporting only",
  "Separate teams for different platforms",
  "Long-term contracts required",
  "One-size-fits-all approach",
];

const viral: string[] = [
  "Custom content for your brand",
  "Real-time performance tracking",
  "Integrated cross-platform strategy",
  "Flexible month-to-month options",
  "Tailored to your specific goals",
];

export default function WhyChooseUs() {
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
        The difference
      </p>
      <h2
        style={{ color: "var(--color-200)" }}
        className="text-3xl md:text-4xl font-bold tracking-tight leading-snug max-w-lg mb-14"
      >
        Why choose Viral over everyone else?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Other Agencies */}
        <div
          style={{ backgroundColor: "var(--color-300)" }}
          className="rounded-2xl p-8"
        >
          <h3
            style={{ color: "var(--color-500)" }}
            className="text-sm font-semibold mb-6"
          >
            Other Agencies
          </h3>
          <ul className="flex flex-col gap-4">
            {otherAgency.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-black/10">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5h6"
                      stroke="#99a1af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span style={{ color: "var(--color-500)" }} className="text-sm">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Viral */}
        <div
          style={{ backgroundColor: "var(--color-200)" }}
          className="rounded-2xl p-8 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

          {/* Logo mark */}
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <span className="text-white text-sm font-bold">viral</span>
          </div>

          <ul className="flex flex-col gap-4 relative z-10">
            {viral.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  style={{ backgroundColor: "var(--color-100)" }}
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2.5 2.5L8 2.5"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span style={{ color: "var(--color-100)" }} className="text-sm">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Brand strip */}
      <div className="mt-16">
        <p
          style={{ color: "var(--color-500)" }}
          className="text-xs uppercase tracking-widest font-medium mb-6 text-center"
        >
          Brands we've helped grow on social.
        </p>
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {["Glowhaus", "Bloom", "Theo", "Nova", "Arkly"].map((brand) => (
            <span
              key={brand}
              style={{ color: "var(--color-200)" }}
              className="text-xl font-bold opacity-15 hover:opacity-40 transition-opacity cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
