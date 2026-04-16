interface Stat {
  value: string;
  label: string;
  sub: string;
}

interface CaseStudy {
  label: string;
  heading: string;
  description: string;
  stats: Stat[];
  brand: string;
  video: string;
}

const cases: CaseStudy[] = [
  {
    label: "Client results",
    heading: "Scaling a beauty brand with reels",
    description:
      "Beauty brand Glowhaus came to us with great products but low engagement. We developed a UGC-driven content strategy focused on short-form video, optimised for Reels.",
    stats: [
      { value: "820K", label: "Reel Views", sub: "In the first 30 days" },
      {
        value: "+340%",
        label: "Engagement",
        sub: "Compared to previous month",
      },
    ],
    brand: "Glowhaus",
    video: "/Glowhaus.mp4",
  },
  {
    label: "Client results",
    heading: "Growing a clothing brand with video",
    description:
      "Theo came to us ahead of a new collection launch, looking to grow their reach and build anticipation. We combined UGC with light influencer seeding and short-form video.",
    stats: [
      { value: "12K", label: "Followers", sub: "In six weeks" },
      {
        value: "+180%",
        label: "Engagement",
        sub: "Compared to previous month",
      },
    ],
    brand: "Theo",
    video: "/theo.mp4",
  },
];

export default function CaseStudies() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 py-20 flex flex-col gap-20"
    >
      {cases.map((c, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* Text — alternate order on even/odd */}
          <div className={i % 2 === 1 ? "md:order-2" : "md:order-1"}>
            <p
              style={{ color: "var(--color-500)" }}
              className="text-xs uppercase tracking-widest font-medium mb-3"
            >
              {c.label}
            </p>
            <h2
              style={{ color: "var(--color-200)" }}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-5"
            >
              {c.heading}
            </h2>
            <p
              style={{ color: "var(--color-500)" }}
              className="text-sm leading-relaxed mb-10"
            >
              {c.description}
            </p>

            {/* Stats row */}
            <div className="flex gap-12">
              {c.stats.map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{ color: "var(--color-200)" }}
                    className="text-4xl font-bold"
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{ color: "var(--color-200)" }}
                    className="text-sm font-semibold mt-1"
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{ color: "var(--color-500)" }}
                    className="text-xs mt-0.5"
                  >
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className={i % 2 === 1 ? "md:order-1" : "md:order-2"}>
            <div
              style={{ backgroundColor: "var(--color-300)" }}
              className="w-full h-64 md:h-80 rounded-2xl relative overflow-hidden flex items-end p-8"
            >
              <video
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={c.video}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <span
                className="relative z-10 text-3xl font-bold text-white/80"
              >
                {c.brand}
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
