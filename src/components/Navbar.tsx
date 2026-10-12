"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
    { id: "studio", label: "Salon", href: "#studio", icon: Sparkles },
    { id: "grooming", label: "Care", href: "#grooming", icon: Package },
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
          className={`max-w-6xl mx-auto rounded-full transition-all duration-500 pointer-events-auto flex items-center justify-between px-6 lg:px-8 py-2.5 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border border-[#B48A3C]/25 shadow-[0_10px_35px_rgba(14,74,53,0.1)]"
              : "bg-white/85 backdrop-blur-lg border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          }`}
        >
          {/* H&S Salon Official 3D Gold Emblem & Brand Name */}
          <Link
            href="#hero"
            onClick={(e) => scrollTo(e, "hero")}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#B48A3C]/40 shadow-xs bg-white flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/hs-logo.webp"
                alt="H&S Salon Logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-sm sm:text-base font-bold tracking-[0.22em] text-[#0F1F18] group-hover:text-[#0E4A35] transition-colors whitespace-nowrap leading-tight"
              >
                H&amp;S SALON
              </span>
              <span className="text-[8px] tracking-[0.22em] uppercase text-[#9E7B3A] font-mono font-semibold leading-none mt-0.5">
                Hair • Skin • Makeup • Nails
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-2">
            {[
              { id: "hero", label: "Experience" },
              { id: "services", label: "Services" },
              { id: "studio", label: "The Salon" },
              { id: "grooming", label: "Care & Tools" },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => scrollTo(e, link.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-200 ${
                    isActive
                      ? "text-[#0E4A35] bg-[#0E4A35]/[0.08] font-bold"
                      : "text-[#4A4640] hover:text-[#0E4A35] hover:bg-black/[0.03]"
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
              className="group px-5 py-2.5 rounded-full bg-[#0E4A35] hover:bg-[#9E7B3A] text-white text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_4px_14px_rgba(14,74,53,0.25)] flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#EAD39C] group-hover:text-white transition-colors" />
              <span>Book Visit</span>
            </button>
          </div>
        </header>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE FLOATING LOGO & SOUND (Top Bar on Mobile)        */}
      {/* ========================================================= */}
      <div className="md:hidden fixed top-3.5 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <a
          href="#hero"
          onClick={(e) => scrollTo(e, "hero")}
          className="pointer-events-auto flex items-center gap-2 bg-black/45 backdrop-blur-md border border-white/20 pr-3.5 pl-1.5 py-1 rounded-full shadow-md"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white flex-shrink-0">
            <Image
              src="/hs-logo.webp"
              alt="H&S Salon"
              fill
              sizes="28px"
              className="object-cover"
              priority
            />
          </div>
          <span
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-[11px] font-bold tracking-[0.18em] text-white uppercase"
          >
            H&amp;S SALON
          </span>
        </a>

        <div className="pointer-events-auto">
          <AudioAtmosphere />
        </div>
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
                  aria-label="Book Appointment"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0E4A35] text-[#EAD39C] flex items-center justify-center shadow-[0_4px_16px_rgba(14,74,53,0.35)] border-2 border-white group-active:scale-95 transition-transform">
                    <Calendar className="w-5 h-5 text-[#EAD39C]" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#0E4A35] mt-1 font-mono">
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
                    ? "text-[#0E4A35] font-bold"
                    : "text-[#6E6962] hover:text-[#0F1F18]"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-[#0E4A35]" : "text-[#6E6962]"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#9E7B3A]" />
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
                    isActive ? "font-bold text-[#0E4A35]" : "font-medium"
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
