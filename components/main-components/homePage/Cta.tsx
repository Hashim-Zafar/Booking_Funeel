export default function CTA() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 py-20"
    >
      <div
        style={{ backgroundColor: "var(--color-300)" }}
        className="rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center overflow-hidden relative"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-black/5" />
        <div className="absolute -bottom-12 right-1/4 w-48 h-48 rounded-full bg-black/[0.03]" />

        {/* Left — Text */}
        <div className="relative z-10">
          {/* Logo mark */}
          <div
            style={{ backgroundColor: "var(--color-200)" }}
            className="w-10 h-10 rounded-full flex items-center justify-center mb-8"
          >
            <span className="text-white text-sm font-bold">V</span>
          </div>

          <p
            style={{ color: "var(--color-500)" }}
            className="text-xs uppercase tracking-widest font-medium mb-4"
          >
            Get started
          </p>
          <h2
            style={{ color: "var(--color-200)" }}
            className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-5"
          >
            Your viral journey starts right here.
          </h2>
          <p
            style={{ color: "var(--color-500)" }}
            className="text-sm leading-relaxed mb-8 max-w-sm"
          >
            Book a free 30 min strategy call and we&apos;ll show you how to turn
            followers into customers.
          </p>

          <a
            href="#"
            style={{
              backgroundColor: "var(--color-200)",
              color: "var(--color-100)",
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-75 transition-opacity"
          >
            Book a call
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M7 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Right — visual reel mockup */}
        <div className="relative z-10 flex items-center justify-center">
          <div
            style={{ backgroundColor: "var(--color-200)" }}
            className="w-48 h-72 md:w-56 md:h-80 rounded-2xl opacity-10 absolute top-4 left-1/2 -translate-x-1/2 rotate-6"
          />
          <div
            style={{ backgroundColor: "var(--color-200)" }}
            className="w-48 h-72 md:w-56 md:h-80 rounded-2xl relative z-10 overflow-hidden"
          >
            <video
              className="h-full w-full object-cover"
              src="/footer.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
