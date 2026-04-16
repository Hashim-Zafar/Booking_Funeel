import Link from "next/link";

const brands: string[] = ["Glowhaus", "Bloom", "Theo", "Nova", "Arkly"];
const heroVideos = [
  { src: "/Hero_Video_1.mp4", label: "@jessicasu3h" },
  { src: "/Hero_Video_2.mp4", label: "@growwithnova" },
  { src: "/Hero_Video_3.mp4", label: "@arklystudio" },
] as const;

export default function Hero() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 pt-20 pb-16 flex flex-col items-center text-center overflow-hidden"
    >
      {/* Logo mark */}
      <div
        style={{ backgroundColor: "var(--color-200)" }}
        className="w-10 h-10 rounded-full flex items-center justify-center mb-8"
      >
        <span className="text-white text-sm font-bold">V</span>
      </div>

      {/* Headline */}
      <h1
        style={{ color: "var(--color-200)" }}
        className="text-5xl md:text-7xl font-bold tracking-tight leading-none max-w-3xl mb-6"
      >
        Short form done right
      </h1>

      {/* Subtext */}
      <p
        style={{ color: "var(--color-500)" }}
        className="text-base md:text-lg max-w-xl leading-relaxed mb-10"
      >
        We combine content, management, and paid media to help brands grow and
        convert on the social platforms that matter most to you.
      </p>

      {/* CTA */}
      <Link
        href="/booking"
        style={{
          backgroundColor: "var(--color-200)",
          color: "var(--color-100)",
        }}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-75 transition-opacity mb-16"
      >
        Get in touch
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7h10M7 2l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* Reel Cards Visual */}
      <div className="relative w-full max-w-4xl flex items-end justify-center gap-3">
        {/* Left card */}
        <div
          style={{ backgroundColor: "var(--color-300)" }}
          className="hidden md:flex w-44 h-64 rounded-2xl overflow-hidden flex-shrink-0 self-end mb-4 items-center justify-center relative"
        >
          <video
            className="h-full w-full object-cover object-center"
            src={heroVideos[0].src}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Center main card */}
        <div
          style={{ backgroundColor: "var(--color-300)" }}
          className="w-64 md:w-80 h-80 md:h-96 rounded-2xl overflow-hidden flex-shrink-0 relative"
        >
          <div className="w-full h-full relative">
            <video
              className="h-full w-full object-cover object-center"
              src={heroVideos[1].src}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/40 backdrop-blur-sm" />
              <span className="text-xs text-white font-medium">
                {heroVideos[1].label}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              Social growth
            </div>
            <div className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-black">
              Live reel
            </div>
          </div>
        </div>

        {/* Right card */}
        <div
          style={{ backgroundColor: "var(--color-300)" }}
          className="hidden md:flex w-44 h-64 rounded-2xl overflow-hidden flex-shrink-0 self-end mb-4 items-center justify-center relative"
        >
          <video
            className="h-full w-full object-cover object-center"
            src={heroVideos[2].src}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      {/* Brand logos strip */}
      <div className="mt-16 w-full max-w-2xl">
        <p
          style={{ color: "var(--color-500)" }}
          className="text-xs uppercase tracking-widest font-medium mb-6"
        >
          Brands we&apos;ve helped grow on social.
        </p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {brands.map((brand) => (
            <span
              key={brand}
              style={{ color: "var(--color-200)" }}
              className="text-lg font-bold opacity-20 hover:opacity-50 transition-opacity cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
