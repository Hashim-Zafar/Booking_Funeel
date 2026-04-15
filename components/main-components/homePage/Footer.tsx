export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 pt-16 pb-10 border-t border-black/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                style={{ backgroundColor: "var(--color-200)" }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <span
                style={{ color: "var(--color-200)" }}
                className="font-bold text-xl tracking-tight"
              >
                viral
              </span>
            </div>
            <p
              style={{ color: "var(--color-500)" }}
              className="text-sm leading-relaxed max-w-xs"
            >
              Social media that drives real results. Built for creators,
              businesses, and brands.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p
              style={{ color: "var(--color-200)" }}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
            >
              Navigate
            </p>
            <ul className="flex flex-col gap-2.5">
              {["Home", "About", "Case Studies", "Blog"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{ color: "var(--color-500)" }}
                    className="text-sm hover:opacity-50 transition-opacity"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p
              style={{ color: "var(--color-200)" }}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
            >
              Connect
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Book a call", href: "#" },
                { label: "Instagram", href: "https://instagram.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Twitter", href: "https://twitter.com" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{ color: "var(--color-500)" }}
                    className="text-sm hover:opacity-50 transition-opacity"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p
              style={{ color: "var(--color-200)" }}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
            >
              Legal
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact", href: "mailto:hello@viral.co" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{ color: "var(--color-500)" }}
                    className="text-sm hover:opacity-50 transition-opacity"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8 border-t border-black/10">
          <p style={{ color: "var(--color-500)" }} className="text-xs">
            © 2025 Viral. All rights reserved.
          </p>
          <p style={{ color: "var(--color-500)" }} className="text-xs">
            Designed with ♥ for brands that want to grow.
          </p>
        </div>
      </div>
    </footer>
  );
}
