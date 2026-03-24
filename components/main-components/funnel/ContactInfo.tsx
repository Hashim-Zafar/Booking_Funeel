export default function ContactInfo() {
  return (
    <div className="flex flex-col">
      <div>
        <div className="inline-flex items-center rounded-[8px] border border-black/15 bg-gray-100 px-4 py-2 text-sm hover:border-black/25">
          Book a call
        </div>

        <h1 className="mt-10  font-semibold leading-[0.95] tracking-tight ">
          Let&apos;s get <br /> started
        </h1>

        <p className="mt-6 max-w-md  leading-7 text-black/55">
          Ready to transform your social media? Get in touch and we&apos;ll
          show you what&apos;s possible for your brand.
        </p>
      </div>

      {/* tiny social proof row (optional) */}
      <div className="mt-10 flex items-center gap-4">
        <div className="flex -space-x-2">
          <div className="h-9 w-9 rounded-full border border-white bg-black/10" />
          <div className="h-9 w-9 rounded-full border border-white bg-black/15" />
          <div className="h-9 w-9 rounded-full border border-white bg-black/20" />
          <div className="h-9 w-9 rounded-full border border-white bg-black/25" />
        </div>
        <div className="text-sm text-black/60">
          <div className="leading-5">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <div className="leading-5">Grown over 176+ creators</div>
        </div>
      </div>
    </div>
  );
}
