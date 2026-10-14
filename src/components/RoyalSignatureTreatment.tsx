"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Sparkles, Check, ArrowRight } from "lucide-react";

interface RoyalSignatureProps {
  onReserve: () => void;
}

export default function RoyalSignatureTreatment({ onReserve }: RoyalSignatureProps) {
  const steps = [
    { num: "i.", text: "Precision Architecture Cut by Master Barber", note: "Engineered to cranial contour & face symmetry" },
    { num: "ii.", text: "Eucalyptus Botanical Hot-Towel Steam", note: "Pores prepped with infused essential botanical oils" },
    { num: "iii.", text: "Japanese Steel Straight-Razor Line Artistry", note: "Ultra-sharp clean detailing with zero irritation" },
    { num: "iv.", text: "Moroccan Argan Scalp & Acupressure Ritual", note: "Deep cranial release and hair follicle nourishing" },
    { num: "v.", text: "Complimentary Cold Pressed Brew / Espresso", note: "Private leather throne seating during grooming" },
  ];

  return (
    <section
      id="signature"
      className="relative bg-[#0B1510] text-[#F7F3EC] py-24 sm:py-32 px-6 lg:px-16 overflow-hidden border-t border-b border-[#9E7B3A]/20"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#9E7B3A]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-[#0E4A35]/30 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Arched Signature Media Frame */}
        <div className="lg:col-span-6 relative">
          <div
            data-cursor="ROYAL"
            className="group relative aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden rounded-t-[220px] rounded-b-xl border border-[#D4B26A]/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[#0A120D]"
          >
            <Image
              src="/images/craft/signature-royal-ritual.webp"
              alt="The Royal Crown & Beard Ritual at H&S Salon"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Soft film dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Exclusive Gold Stamp */}
            <div className="absolute top-8 left-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4B26A]/40 text-[#D4B26A] text-[10px] font-mono tracking-[0.25em] uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>FLAGSHIP CEREMONY</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Treatment Breakdown & Booking CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-[#D4B26A]" />
            <span className="text-[11px] font-mono tracking-[0.28em] text-[#D4B26A] font-bold uppercase">
              03 • SIGNATURE CEREMONY
            </span>
          </div>

          {/* Pricing Highlight */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl text-[#D4B26A] font-mono font-light">₹</span>
            <span
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none"
            >
              2,450
            </span>
            <span className="text-xs font-mono tracking-[0.2em] text-[#F7F3EC]/50 uppercase ml-2">
              / 75 MIN ALL-INCLUSIVE
            </span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight mb-6 leading-tight"
          >
            The Royal Crown &amp; <br />
            <span className="italic font-normal text-[#EAD39C] lowercase">
              beard
            </span>{" "}
            Sanctuary Ritual
          </h2>

          <p className="text-sm sm:text-base text-[#F7F3EC]/75 mb-8 leading-relaxed max-w-lg">
            Our most requested bespoke appointment. Crafted for those who demand architectural precision, deep relaxation, and an uncompromising standard of grooming.
          </p>

          {/* Roman Numeral Ritual Protocol Steps */}
          <ul className="border-t border-white/10 divide-y divide-white/10 mb-10">
            {steps.map((step) => (
              <li key={step.num} className="py-3.5 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-[#D4B26A] pt-0.5 w-6 flex-none">
                  {step.num}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white tracking-wide">
                    {step.text}
                  </div>
                  <div className="text-xs font-mono tracking-wider text-[#F7F3EC]/50 uppercase mt-0.5">
                    {step.note}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Direct Reservation CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onReserve}
              data-cursor="RESERVE"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#D4B26A] text-[#0B1510] hover:bg-white font-bold text-xs tracking-[0.24em] uppercase transition-all shadow-[0_0_30px_rgba(212,178,106,0.35)] cursor-pointer flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <span>Reserve The Throne</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono tracking-[0.2em] text-white/50 uppercase text-center sm:text-left">
              Nerul West • Private Chair
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
