export default function Mission() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 py-20"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Left — Text */}
        <div>
          <p
            style={{ color: "var(--color-500)" }}
            className="text-xs uppercase tracking-widest font-medium mb-4"
          >
            Our mission
          </p>
          <h2
            style={{ color: "var(--color-200)" }}
            className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-8"
          >
            Turning content chaos into consistent growth
          </h2>
          <div className="flex flex-col gap-4">
            {[
              "We work with brands who are ready to take their social media presence seriously. Not just to fill a feed or chase trends, but to show up with purpose and build something that actually grows.",
              "For us, content is just the starting point.",
              "Our approach combines strategy, execution, and consistency. We handle the planning, posting, and platform management so you can focus on running the business.",
              "If you're ready to grow with intention, we'd love to help.",
            ].map((text, i) => (
              <p
                key={i}
                style={{ color: "var(--color-500)" }}
                className="text-sm leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Right — Visual */}
        <div className="relative">
          <div
            style={{ backgroundColor: "var(--color-300)" }}
            className="w-full h-80 md:h-96 rounded-2xl flex items-center justify-center relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-black/5" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-black/[0.03]" />

            {/* Center logo */}
            <div
              style={{ backgroundColor: "var(--color-200)" }}
              className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-2xl font-bold">V</span>
            </div>
          </div>

          {/* Floating label */}
          <div
            style={{
              backgroundColor: "var(--color-200)",
              color: "var(--color-100)",
            }}
            className="absolute -bottom-4 left-6 px-5 py-3 rounded-xl text-sm font-bold shadow-lg"
          >
            viral
          </div>
        </div>
      </div>
    </section>
  );
}
