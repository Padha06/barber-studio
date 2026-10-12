"use client";

import Image from "next/image";
import { Sparkles, Award, Shield, Coffee, Compass } from "lucide-react";

export default function StudioExperience() {
  const galleryItems = [
    {
      src: "/sequence/ezgif-frame-001.jpg",
      title: "The Entrance",
      subtitle: "Mayfair Atelier Façade",
      colSpan: "lg:col-span-8",
      height: "h-80 md:h-96",
    },
    {
      src: "/sequence/ezgif-frame-060.jpg",
      title: "The Interior Sanctuary",
      subtitle: "Dark Walnut & Amber Glow",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/sequence/ezgif-frame-120.jpg",
      title: "The Precision Fade",
      subtitle: "Zero-Gap Graduation",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/sequence/ezgif-frame-180.jpg",
      title: "The Hot Towel Ritual",
      subtitle: "Pure Eucalyptus Steam",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/sequence/ezgif-frame-240.jpg",
      title: "The Master Workstation",
      subtitle: "Sanitized Barber Instruments",
      colSpan: "lg:col-span-4",
      height: "h-80 md:h-96",
    },
    {
      src: "/sequence/ezgif-frame-300.jpg",
      title: "The Atelier Panorama",
      subtitle: "Three Custom Leather Chairs",
      colSpan: "lg:col-span-12",
      height: "h-96 md:h-[450px]",
    },
  ];

  const pillars = [
    {
      icon: Award,
      title: "Master Guild Barbers",
      description:
        "Every craftsman undergoes rigorous British Master Barber guild accreditation with over a decade in luxury bespoke grooming.",
    },
    {
      icon: Compass,
      title: "Bespoke Architecture",
      description:
        "We study cranial geometry, growth whorls, and facial proportions before a single blade touches your hair.",
    },
    {
      icon: Coffee,
      title: "Private Bar & Lounge",
      description:
        "Enjoy complimentary pour-over Ethiopian roast coffee, chilled sparkling mineral water, or rare Japanese single-malt whisky.",
    },
    {
      icon: Shield,
      title: "Medical-Grade Hygiene",
      description:
        "Hospital-grade autoclaves and ultraviolet tool sterilization between every individual client appointment.",
    },
  ];

  return (
    <section id="studio" className="relative py-24 md:py-32 bg-[#FAF9F7] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E7B3A]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9E7B3A] font-bold">
              THE ATELIER SANCTUARY
            </span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.06em] text-[#0F0F0F] uppercase leading-tight mb-4"
          >
            CRAFTED WITH <span className="text-[#9E7B3A]">INTENTION.</span>
          </h2>

          <p
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-base sm:text-xl text-[#9E7B3A] italic mb-3 font-medium"
          >
            “Great grooming is never accidental. It comes from experience, precision, and a space where the details matter.”
          </p>

          <p className="text-xs sm:text-sm text-[#6E6962] max-w-xl mx-auto leading-relaxed">
            Designed for gentlemen who understand that personal presentation is not vanity,
            but respect. An acoustic haven away from the noise of the city.
          </p>
        </div>

        {/* Editorial Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-20">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`relative ${item.colSpan} ${item.height} overflow-hidden group border border-black/10 bg-[#ECE8E1] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#DFC79B] block mb-1 font-mono font-semibold">
                    {item.subtitle}
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm"
                  >
                    {item.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-white/80 border border-white/30 px-2 py-1 bg-black/40 backdrop-blur-sm">
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
                className="p-6 bg-white border border-black/10 hover:border-[#9E7B3A] transition-all duration-300 shadow-2xs group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF9F7] border border-black/10 flex items-center justify-center mb-4 group-hover:bg-[#0F0F0F] transition-colors">
                  <Icon className="w-5 h-5 text-[#9E7B3A] group-hover:text-white transition-colors" />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-lg font-bold text-[#0F0F0F] mb-2"
                >
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#6E6962] leading-relaxed">
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
