"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, ArrowUp, Calendar } from "lucide-react";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#ffffff] text-[#4A4640] border-t border-black/10 pt-8 pb-24 md:pt-20 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* ================================================================= */}
        {/* MOBILE COMPACT LUXURY FOOTER (< MD) */}
        {/* ================================================================= */}
        <div className="md:hidden space-y-5 text-center">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#B48A3C]/40 bg-white shadow-xs">
              <Image
                src="/hs-logo.webp"
                alt="H&S Salon Logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <span
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-sm font-bold tracking-[0.2em] text-[#0F1F18] block leading-tight"
              >
                H&amp;S SALON
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#9E7B3A] font-semibold">
                Hair • Skin • Makeup • Nails
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href="tel:+919167779514"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#FAF8F4] border border-black/10 text-[#0F1F18] hover:border-[#0E4A35] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0E4A35] mb-1" />
              <span className="text-[9px] font-bold tracking-wider uppercase font-mono">Call</span>
            </a>

            <a
              href="https://www.instagram.com/salonhns/"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#FAF8F4] border border-black/10 text-[#0F1F18] hover:border-[#0E4A35] transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#9E7B3A] mb-1" />
              <span className="text-[9px] font-bold tracking-wider uppercase font-mono">Instagram</span>
            </a>

            <a
              href="#booking"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#0E4A35] text-white hover:bg-[#9E7B3A] transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#EAD39C] mb-1" />
              <span className="text-[9px] font-bold tracking-wider uppercase font-mono">Book</span>
            </a>
          </div>

          {/* Location & Hours Micro-Badge */}
          <div className="rounded-xl bg-[#FAF8F4] border border-black/5 p-3 text-xs text-[#5F6661] space-y-1 text-left">
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-[#0E4A35] flex-shrink-0 mt-0.5" />
              <span className="text-[10px] leading-tight text-[#4A4640]">
                Shop 12 &amp; 13, Sagar Darshan Tower, Sector 18, Nerul West, Navi Mumbai
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px] pt-1 border-t border-black/5 font-mono">
              <span className="text-[#0E4A35] font-semibold">Open Daily</span>
              <span className="text-[#0F1F18] font-bold">09:30 AM — 10:00 PM</span>
            </div>
          </div>

          {/* Compact Copyright & Back to Top */}
          <div className="pt-2 flex items-center justify-between text-[9px] text-[#5F6661] border-t border-black/10">
            <span>© 2026 H&amp;S Salon</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#0E4A35] font-bold tracking-wider uppercase cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3 text-[#9E7B3A]" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DESKTOP EDITORIAL LUXURY FOOTER (MD & UP) */}
        {/* ================================================================= */}
        <div className="hidden md:block">
          {/* Master Brand Statement */}
          <div className="border-b border-black/10 pb-16 mb-16 text-center">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#0E4A35] block mb-3 font-bold font-mono">
              THE H&amp;S SALON PHILOSOPHY
            </span>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] text-[#0F1F18] uppercase leading-tight"
            >
              CONFIDENCE, REDEFINED. <br className="sm:hidden" />
              <span className="text-[#9E7B3A]">THIS IS THE H&amp;S STANDARD.</span>
            </h2>
          </div>

          {/* 4-Column Editorial Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Col 1: Brand & Bio */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#B48A3C]/40 bg-white flex-shrink-0">
                  <Image
                    src="/hs-logo.webp"
                    alt="H&S Salon Logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-base font-bold tracking-[0.2em] text-[#0F1F18] block leading-tight"
                  >
                    H&amp;S SALON
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#9E7B3A] font-semibold">
                    Hair • Skin • Makeup • Nails
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#5F6661] leading-relaxed mb-6">
                Where luxury begins. Navi Mumbai&apos;s premier destination for precision haircuts,
                couture balayage, Brazilian Keratin &amp; Hair Botox rituals, clinical skin care,
                bridal makeup, and bespoke nail artistry since 2010.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/salonhns/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/15 hover:border-[#0E4A35] hover:text-[#0E4A35] transition-colors text-[#0F1F18] text-[11px] font-semibold"
                  aria-label="Instagram @salonhns"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#0E4A35]" />
                  <span>@salonhns</span>
                </a>
              </div>
            </div>

            {/* Col 2: Salon Location */}
            <div>
              <h4
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-sm font-bold tracking-[0.18em] uppercase text-[#0F1F18] mb-4"
              >
                Flagship Salon Location
              </h4>
              <div className="space-y-3 text-xs text-[#5F6661]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0E4A35] flex-shrink-0 mt-0.5" />
                  <span>
                    Shop No. 12 &amp; 13, Sagar Darshan Tower, <br />
                    Plot No. 38, Sector 18, Nerul West, <br />
                    Navi Mumbai, Maharashtra 400706
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0E4A35] flex-shrink-0" />
                  <span>+91 91677 79514 / +91 91677 79515</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#0E4A35] flex-shrink-0" />
                  <span>concierge@salonhns.com</span>
                </div>
              </div>
            </div>

            {/* Col 3: Hours of Operation */}
            <div>
              <h4
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-sm font-bold tracking-[0.18em] uppercase text-[#0F1F18] mb-4"
              >
                Salon Hours
              </h4>
              <div className="space-y-2 text-xs text-[#5F6661]">
                <div className="flex justify-between border-b border-black/5 pb-1.5">
                  <span>Monday – Friday</span>
                  <span className="text-[#0F1F18] font-mono">09:30 AM — 10:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-1.5">
                  <span>Saturday</span>
                  <span className="text-[#0F1F18] font-mono">09:30 AM — 10:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-1.5">
                  <span>Sunday</span>
                  <span className="text-[#0E4A35] font-mono font-bold">09:30 AM — 10:00 PM</span>
                </div>
                <p className="text-[10px] text-[#5F6661] pt-1">
                  Bridal &amp; private group bookings available upon request.
                </p>
              </div>
            </div>

            {/* Col 4: Quick Navigation */}
            <div>
              <h4
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-sm font-bold tracking-[0.18em] uppercase text-[#0F1F18] mb-4"
              >
                Explore H&amp;S
              </h4>
              <ul className="space-y-2 text-xs uppercase tracking-wider text-[#5F6661] font-semibold">
                <li>
                  <a href="#hero" className="hover:text-[#0E4A35] transition-colors">
                    Cinematic Salon Tour
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#0E4A35] transition-colors">
                    Hair, Skin, Makeup &amp; Nails
                  </a>
                </li>
                <li>
                  <a href="#booking" className="text-[#0E4A35] font-bold hover:underline transition-colors block pt-1">
                    Book An Appointment →
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Back to Top */}
          <div className="border-t border-black/10 pt-8 flex items-center justify-between gap-4 text-[11px] text-[#5F6661]">
            <div>
              © 2026 H&amp;S Salon (Hair • Skin • Makeup • Nails). All rights reserved.
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:text-[#0E4A35] transition-colors cursor-pointer"
            >
              <span className="uppercase tracking-widest text-[10px] font-bold">Return To Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#9E7B3A]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
