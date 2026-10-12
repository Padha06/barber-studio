"use client";

import Image from "next/image";
import { Sparkles, Award, Shield, Star, HeartHandshake } from "lucide-react";

export default function StudioExperience() {
  const galleryItems = [
    {
      src: "/frames/frame-005.webp",
      title: "Where Luxury Begins",
      subtitle: "H&S Salon Exterior • Nerul West",
      colSpan: "lg:col-span-7",
      height: "h-80 md:h-96",
    },
    {
      src: "/frames/frame-045.webp",
      title: "Curated With Intention",
      subtitle: "Warm Ivory & Emerald Sanctuary",
      colSpan: "lg:col-span-5",
      height: "h-80 md:h-96",
    },
    {
      src: "/frames/frame-075.webp",
      title: "The Styling Stations",
      subtitle: "Emerald Velvet & Illuminated Arches",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/frames/frame-120.webp",
      title: "Craftsmanship You Can Feel",
      subtitle: "Every Cut. Every Line. Perfected.",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/frames/frame-185.webp",
      title: "A Ritual Of Care",
      subtitle: "Ceramic Wash Lounge & Wave Wall",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/frames/frame-280.webp",
      title: "Confidence, Redefined",
      subtitle: "This Is The H&S Standard",
      colSpan: "lg:col-span-12",
      height: "h-96 md:h-[460px]",
    },
  ];

  const stats = [
    { value: "2010", label: "Established In Navi Mumbai" },
    { value: "4.9 ★", label: "Client Satisfaction Rating" },
    { value: "1,000+", label: "5-Star Verified Reviews" },
    { value: "4 Pillars", label: "Hair • Skin • Makeup • Nails" },
  ];

  const pillars = [
    {
      icon: Award,
      title: "Master Stylists & Artists",
      description:
        "Certified hair directors, colorists, dermal therapists, and bridal makeup artists trained in international couture techniques.",
    },
    {
      icon: Sparkles,
      title: "Architectural Ambience",
      description:
        "Custom emerald velvet styling chairs, backlit arched mirrors, and a tranquil acoustic wash lounge designed for pure relaxation.",
    },
    {
      icon: HeartHandshake,
      title: "Bespoke Consultation",
      description:
        "We analyze your hair health, skin barrier, and personal aesthetic before crafting a look tailored exclusively to you.",
    },
    {
      icon: Shield,
      title: "Uncompromising Hygiene",
      description:
        "Medical-grade UV instrument sterilization, single-use disposables, and authentic global luxury formulations for every guest.",
    },
  ];

  return (
    <section id="studio" className="relative py-24 md:py-32 bg-[#FAF8F4] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B48A3C]/30 bg-white mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0E4A35]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#0E4A35] font-bold">
              INSIDE H&amp;S SALON
            </span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.05em] text-[#0F1F18] uppercase leading-tight mb-4"
          >
            DESIGNED FOR THOSE WHO <br className="hidden sm:block" />
            <span className="text-[#9E7B3A]">NOTICE THE DETAILS.</span>
          </h2>

          <p
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-base sm:text-xl text-[#0E4A35] italic mb-3 font-medium"
          >
            “Precision. Atmosphere. Presence. A space that elevates every visit.”
          </p>

          <p className="text-xs sm:text-sm text-[#5F6661] max-w-xl mx-auto leading-relaxed">
            Step through our doors into a serene sanctuary of warm travertine tones,
            emerald velvet, and golden arched mirrors—where every corner is curated with intention.
          </p>
        </div>

        {/* H&S Salon Milestones Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map((st) => (
            <div
              key={st.label}
              className="bg-white border border-[#B48A3C]/25 rounded-2xl p-6 text-center shadow-2xs"
            >
              <div
                style={{ fontFamily: "var(--font-serif)" }}
                className="text-2xl sm:text-4xl font-bold text-[#0E4A35] mb-1"
              >
                {st.value}
              </div>
              <div className="text-[10px] sm:text-xs font-mono tracking-[0.16em] uppercase text-[#5F6661]">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-20">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`relative ${item.colSpan} ${item.height} rounded-2xl overflow-hidden group border border-black/10 bg-[#ECE8E1] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-65 transition-opacity duration-300" />

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#EAD39C] block mb-1 font-mono font-semibold">
                    {item.subtitle}
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm"
                  >
                    {item.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-white/90 border border-white/30 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-black/10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 bg-white rounded-2xl border border-black/10 hover:border-[#0E4A35] transition-all duration-300 shadow-2xs group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF8F4] border border-[#B48A3C]/30 flex items-center justify-center mb-4 group-hover:bg-[#0E4A35] transition-colors">
                  <Icon className="w-5 h-5 text-[#0E4A35] group-hover:text-[#EAD39C] transition-colors" />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-lg font-bold text-[#0F1F18] mb-2"
                >
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#5F6661] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
