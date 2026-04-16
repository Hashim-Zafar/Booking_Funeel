export default function Testimonial() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 py-20"
    >
      <div
        style={{ backgroundColor: "var(--color-200)" }}
        className="rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* Quote */}
        <div>
          {/* Quote mark */}
          <svg
            width="36"
            height="28"
            viewBox="0 0 36 28"
            fill="none"
            className="mb-7 opacity-30"
          >
            <path
              d="M0 28V16C0 7.2 4.8 1.6 14.4 0l1.6 3C11.2 4.4 8.4 7.8 8 14h6V28H0zm20 0V16C20 7.2 24.8 1.6 34.4 0L36 3c-4.8 1.4-7.6 4.8-8 11h6V28H20z"
              fill="white"
            />
          </svg>

          <p
            style={{ color: "var(--color-100)" }}
            className="text-xl md:text-2xl font-semibold leading-snug mb-8"
          >
            They took social media off our plate completely and our audience has
            never been more engaged.
          </p>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <div>
              <p
                style={{ color: "var(--color-100)" }}
                className="text-sm font-semibold"
              >
                Elena Chen
              </p>
              <p className="text-xs text-white/50">Bloom Skincare</p>
            </div>
          </div>
        </div>

        {/* Brand Visual */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-xs h-64 rounded-2xl overflow-hidden bg-white/10">
            <video
              className="h-full w-full object-cover object-center"
              src="/Bloom.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-white text-3xl font-bold opacity-90 tracking-wide">
              Bloom
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
