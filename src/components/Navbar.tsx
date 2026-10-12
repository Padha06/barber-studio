"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scissors, Menu, X, Calendar, Sparkles } from "lucide-react";
import AudioAtmosphere from "./AudioAtmosphere";

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "Studio", href: "#studio" },
    { label: "Apothecary", href: "#grooming" },
    { label: "Reserve", href: "#booking" },
  ];

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 pointer-events-none transition-all duration-500">
        <header
          className={`max-w-6xl mx-auto rounded-full transition-all duration-500 pointer-events-auto flex items-center justify-between px-5 sm:px-7 py-2.5 sm:py-3 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              : "bg-white/80 backdrop-blur-lg border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Typographic Monogram & Logo */}
          <Link
            href="#hero"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#FAF9F7] border border-black/10 flex items-center justify-center group-hover:border-[#9E7B3A] transition-colors">
              <Scissors className="w-3.5 h-3.5 text-[#9E7B3A] transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] text-[#0F0F0F] group-hover:text-[#9E7B3A] transition-colors whitespace-nowrap leading-tight"
              >
                THE GENTLEMEN&apos;S ROOM
              </span>
              <span className="text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-[#6E6962] font-mono leading-none">
                Savile Row • London
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.16em] uppercase text-[#4A4640] hover:text-[#0F0F0F] hover:bg-black/[0.04] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <AudioAtmosphere />

            <button
              onClick={handleBookingClick}
              className="group px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0F0F0F] hover:bg-[#9E7B3A] text-white text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.12)] flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#DFC79B] group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">Book Chair</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full hover:bg-black/5 text-[#0F0F0F] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col justify-center px-10 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 text-center max-w-sm mx-auto w-full">
          <div className="w-10 h-[1.5px] bg-[#9E7B3A] mx-auto mb-2" />
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl text-[#0F0F0F] hover:text-[#9E7B3A] tracking-[0.15em] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-6">
            <button
              onClick={handleBookingClick}
              className="w-full py-3.5 rounded-full bg-[#0F0F0F] text-white font-bold tracking-[0.2em] text-xs uppercase hover:bg-[#9E7B3A] transition-colors shadow-md"
            >
              Book An Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
