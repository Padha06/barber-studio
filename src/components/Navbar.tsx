"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scissors,
  Calendar,
  Home,
  Sparkles,
  Package,
} from "lucide-react";
import AudioAtmosphere from "./AudioAtmosphere";

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Track scroll depth and active section for navigation highlight
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "services", "studio", "grooming", "booking"];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "hero", label: "Home", href: "#hero", icon: Home },
    { id: "services", label: "Services", href: "#services", icon: Scissors },
    { id: "studio", label: "Studio", href: "#studio", icon: Sparkles },
    { id: "grooming", label: "Products", href: "#grooming", icon: Package },
    { id: "booking", label: "Book", href: "#booking", icon: Calendar },
  ];

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection("booking");
  };

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(id);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER (MD & UP ONLY - Hidden on Mobile)       */}
      {/* ========================================================= */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 pt-4 pointer-events-none transition-all duration-500">
        <header
          className={`max-w-6xl mx-auto rounded-full transition-all duration-500 pointer-events-auto flex items-center justify-between px-6 lg:px-8 py-3 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              : "bg-white/80 backdrop-blur-lg border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Typographic Monogram & Logo */}
          <Link
            href="#hero"
            onClick={(e) => scrollTo(e, "hero")}
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#FAF9F7] border border-black/10 flex items-center justify-center group-hover:border-[#9E7B3A] transition-colors">
              <Scissors className="w-3.5 h-3.5 text-[#9E7B3A] transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#0F0F0F] group-hover:text-[#9E7B3A] transition-colors whitespace-nowrap leading-tight"
              >
                THE GENTLEMEN&apos;S ROOM
              </span>
              <span className="text-[8px] tracking-[0.25em] uppercase text-[#6E6962] font-mono leading-none">
                Savile Row • London
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-2">
            {[
              { id: "hero", label: "Home" },
              { id: "services", label: "Services" },
              { id: "studio", label: "Studio" },
              { id: "grooming", label: "Apothecary" },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => scrollTo(e, link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-200 ${
                    isActive
                      ? "text-[#0F0F0F] bg-black/[0.06] font-bold"
                      : "text-[#4A4640] hover:text-[#0F0F0F] hover:bg-black/[0.03]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            <AudioAtmosphere />

            <button
              onClick={handleBookingClick}
              className="group px-5 py-2.5 rounded-full bg-[#0F0F0F] hover:bg-[#9E7B3A] text-white text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.12)] flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#DFC79B] group-hover:text-white transition-colors" />
              <span>Book Chair</span>
            </button>
          </div>
        </header>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE FLOATING SOUND BUTTON (Top Right on Mobile)      */}
      {/* ========================================================= */}
      <div className="md:hidden fixed top-4 right-4 z-40 pointer-events-auto">
        <AudioAtmosphere />
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE FOOTER NAVIGATION DOCK (Bottom on Mobile Screens)*/}
      {/* ========================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-black/10 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-around gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isBooking = item.id === "booking";
            const isActive = activeSection === item.id;

            if (isBooking) {
              return (
                <button
                  key={item.id}
                  onClick={handleBookingClick}
                  className="flex flex-col items-center justify-center -mt-3.5 py-1 focus:outline-none cursor-pointer group"
                  aria-label="Book Chair"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0F0F0F] text-[#DFC79B] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] border-2 border-white group-active:scale-95 transition-transform">
                    <Calendar className="w-5 h-5 text-[#DFC79B]" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#0F0F0F] mt-1 font-mono">
                    Book
                  </span>
                </button>
              );
            }

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => scrollTo(e, item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-[#9E7B3A] font-bold"
                    : "text-[#6E6962] hover:text-[#0F0F0F]"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-[#9E7B3A]" : "text-[#6E6962]"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#9E7B3A]" />
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
                    isActive ? "font-bold text-[#9E7B3A]" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
