interface Step {
  number: string;
  title: string;
  description: string;
  video: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Strategy First",
    description:
      "We align on goals, audience, and content direction before anything goes live.",
    video: "/grow_video_1.mp4",
  },
  {
    number: "02",
    title: "Create & Manage",
    description:
      "We handle the production, scheduling, and posting across all key platforms.",
    video: "/grow_video_2.mp4",
  },
  {
    number: "03",
    title: "Review & Refine",
    description:
      "We track performance, learn what's working, and adjust as needed.",
    video: "/grow_video_3.mp4",
  },
];

export default function HowWeWork() {
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
        How we work
      </p>
      <h2
        style={{ color: "var(--color-200)" }}
        className="text-3xl md:text-4xl font-bold tracking-tight leading-snug max-w-md mb-14"
      >
        We like to keep things nice and simple
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step) => (
          <div
            key={step.number}
            style={{ backgroundColor: "var(--color-300)" }}
            className="rounded-2xl p-7 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="overflow-hidden rounded-xl">
              <video
                className="h-48 w-full object-cover"
                src={step.video}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <span
              style={{ color: "var(--color-500)" }}
              className="text-xs font-mono font-medium tracking-wider"
            >
              {step.number}
            </span>
            <h3
              style={{ color: "var(--color-200)" }}
              className="text-lg font-semibold"
            >
              {step.title}
            </h3>
            <p
              style={{ color: "var(--color-500)" }}
              className="text-sm leading-relaxed"
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
