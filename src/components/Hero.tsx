"use client";

import Image from "next/image";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onExploreCraft: () => void;
  onBookChair: () => void;
}

export default function Hero({ onExploreCraft, onBookChair }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]"
    >
      {/* Background Frame 1 with Cinema Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sequence/ezgif-frame-001.jpg"
          alt="The Gentlemen's Room Atelier Entrance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transform animate-pulse duration-[10000ms] opacity-45"
        />
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-[#080808]/50" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,#080808_90%]" />
        {/* Subtle Warm Amber Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C6A56B]/10 blur-[140px] pointer-events-none rounded-full" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16 flex flex-col items-center">
        {/* Editorial Subtitle Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C6A56B]/30 bg-[#111111]/70 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[#C6A56B]">
            HAUTE BARBERIE & MASTER GROOMING
          </span>
        </div>

        {/* Master Headline */}
        <h1
          style={{ fontFamily: "var(--font-serif)" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.08em] text-[#F5F1EB] uppercase leading-[1.08] mb-6 drop-shadow-2xl"
        >
          MORE THAN A <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1EB] via-[#C6A56B] to-[#DFC79B]">
            HAIRCUT.
          </span>
        </h1>

        {/* Supporting Headline */}
        <p
          style={{ fontFamily: "var(--font-serif)" }}
          className="text-lg sm:text-2xl md:text-3xl font-light tracking-[0.14em] text-[#C6A56B] italic mb-6 max-w-3xl"
        >
          “It&apos;s a craft. A ritual. Your signature.”
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-[#A6A19A] max-w-2xl leading-relaxed tracking-wide font-normal mb-10">
          Precision cuts, refined grooming, and an experience designed around you.
          Enter a sanctuary where traditional artisan barbership meets modern luxury.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onBookChair}
            className="w-full sm:w-auto px-8 md:px-10 py-4 bg-[#C6A56B] text-[#080808] font-bold text-xs tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#DFC79B] hover:shadow-[0_0_30px_rgba(198,165,107,0.35)] cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Book Your Chair</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreCraft}
            className="w-full sm:w-auto px-8 md:px-10 py-4 bg-transparent border border-[#C6A56B]/40 text-[#F5F1EB] font-medium text-xs tracking-[0.22em] uppercase transition-all duration-300 hover:border-[#C6A56B] hover:bg-white/[0.03] cursor-pointer"
          >
            Explore Our Craft
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 w-full max-w-3xl grid grid-cols-3 gap-4 text-center">
          <div>
            <div
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-xl md:text-2xl text-[#C6A56B] font-semibold"
            >
              100%
            </div>
            <div className="text-[10px] md:text-xs text-[#A6A19A] tracking-wider uppercase mt-1">
              Bespoke Consult
            </div>
          </div>
          <div>
            <div
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-xl md:text-2xl text-[#C6A56B] font-semibold"
            >
              300+
            </div>
            <div className="text-[10px] md:text-xs text-[#A6A19A] tracking-wider uppercase mt-1">
              Craft Precision
            </div>
          </div>
          <div>
            <div
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-xl md:text-2xl text-[#C6A56B] font-semibold"
            >
              Top Tier
            </div>
            <div className="text-[10px] md:text-xs text-[#A6A19A] tracking-wider uppercase mt-1">
              Artisan Guild
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Scroll Indicator */}
      <div
        onClick={onExploreCraft}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#A6A19A] group-hover:text-[#C6A56B] transition-colors">
          Scroll To Enter
        </span>
        <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-[#C6A56B] flex items-start justify-center p-1 transition-colors">
          <div className="w-1 h-2 bg-[#C6A56B] rounded-full animate-bounce" />
        </div>
        <ChevronDown className="w-4 h-4 text-[#A6A19A] group-hover:text-[#C6A56B] -mt-1 animate-pulse" />
      </div>
    </section>
  );
}
