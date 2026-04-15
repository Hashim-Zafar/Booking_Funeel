"use client";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const navLinks: string[] = ["Home", "About", "Case Studies", "Blog"];

  return (
    <nav
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-black/10"
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
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
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            style={{ color: "var(--color-200)" }}
            className="text-sm font-medium hover:opacity-50 transition-opacity"
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href="#"
        style={{
          backgroundColor: "var(--color-200)",
          color: "var(--color-100)",
        }}
        className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-75 transition-opacity"
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

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex flex-col gap-1.5 p-1"
        aria-label="Toggle menu"
      >
        <span
          style={{ backgroundColor: "var(--color-200)" }}
          className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
        />
        <span
          style={{ backgroundColor: "var(--color-200)" }}
          className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          style={{ backgroundColor: "var(--color-200)" }}
          className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          style={{ backgroundColor: "var(--color-100)" }}
          className="absolute top-full left-0 w-full border-t border-black/10 px-6 py-6 flex flex-col gap-4 md:hidden shadow-sm"
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              style={{ color: "var(--color-200)" }}
              className="text-sm font-medium"
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            style={{
              backgroundColor: "var(--color-200)",
              color: "var(--color-100)",
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium mt-2"
          >
            Book a call
          </a>
        </div>
      )}
    </nav>
  );
}
