"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

export default function ClientsAndWordMarquee() {
  const clients = [
    { name: "Rohit S., Architect", role: "Nerul West Regular", img: "/frames/frame-120.webp" },
    { name: "Aditi M., Creative Director", role: "Balayage & Color", img: "/frames/frame-080.webp" },
    { name: "Kunal V., Tech Founder", role: "Weekly Fade & Groom", img: "/frames/frame-140.webp" },
    { name: "Priya K., Bride", role: "Bridal Glam & Nails", img: "/frames/frame-190.webp" },
    { name: "Sameer D., Producer", role: "Royal Ritual Regular", img: "/frames/frame-230.webp" },
    { name: "Neha R., Fashion Stylist", role: "Couture Nails", img: "/frames/frame-270.webp" },
  ];

  const disciplines = [
    "HAIR ARCHITECTURE",
    "PRECISION FADES",
    "FRENCH BALAYAGE",
    "COUTURE NAIL ART",
    "BRIDAL & EDITORIAL GLAM",
    "BOTANICAL SCALP THERAPY",
  ];

  return (
    <section className="relative bg-[#0E4A35] text-[#F7F3EC] py-20 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[1px] bg-[#D4B26A]" />
            <span className="text-[11px] font-mono tracking-[0.28em] text-[#D4B26A] font-bold uppercase">
              05 • THE REGULARS
            </span>
          </div>
          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white"
          >
            The Chairs Navi Mumbai’s{" "}
            <span className="italic font-normal text-[#EAD39C] lowercase">
              discerning
            </span>{" "}
            Sit In.
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#D4B26A]">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#D4B26A] text-[#D4B26A]" />
            ))}
          </div>
          <span>1,000+ Verified 5-Star Reviews</span>
        </div>
      </div>

      {/* Row 1: Left-to-Right Image Arches */}
      <div className="flex gap-6 overflow-hidden py-4 select-none">
        <motion.div
          animate={{ x: [0, -1800] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          className="flex gap-6 flex-none"
        >
          {[...clients, ...clients].map((client, idx) => (
            <div
              key={idx}
              data-cursor="CLIENT"
              className="group relative w-60 sm:w-72 flex-none"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[140px] rounded-b-md bg-[#092B1F] border border-white/10 shadow-lg">
                <Image
                  src={client.img}
                  alt={client.name}
                  fill
                  sizes="280px"
                  className="object-cover object-center filter saturate-75 group-hover:saturate-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <div className="text-xs font-semibold text-white tracking-wide">
                    {client.name}
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-[#D4B26A] uppercase mt-0.5">
                    {client.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Right-to-Left Outlined Giant Typography Banner */}
      <div className="overflow-hidden py-6 select-none opacity-80 border-t border-b border-white/10 mt-6">
        <motion.div
          animate={{ x: [-1800, 0] }}
          transition={{ duration: 38, ease: "linear", repeat: Infinity }}
          className="flex gap-10 flex-none whitespace-nowrap"
        >
          {[...disciplines, ...disciplines, ...disciplines].map((tag, idx) => (
            <div
              key={idx}
              style={{
                fontFamily: "var(--font-serif)",
                WebkitTextStroke: "1px rgba(234, 211, 156, 0.4)",
              }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-transparent tracking-widest flex items-center gap-8"
            >
              <span>{tag}</span>
              <span className="text-sm font-sans text-[#D4B26A]">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
