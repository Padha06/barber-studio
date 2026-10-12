"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ArrowUpRight, Scissors, Sparkles, CheckCircle2 } from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  category: "cut" | "beard" | "ritual" | "combo";
  price: string;
  duration: string;
  description: string;
  image: string;
  features: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "signature-haircut",
    title: "Signature Haircut",
    category: "cut",
    price: "$65",
    duration: "45 mins",
    description:
      "A thorough consultation followed by tailored scissor and clipper cutting, hot lather neck shave, and bespoke styling with premium pomade.",
    image: "/sequence/ezgif-frame-090.jpg",
    features: [
      "Bespoke Face & Head Consultation",
      "Precision Shears & Micro-Clippers",
      "Hot Lather Straight Razor Perimeter",
      "Botanical Scalp Massage & Pomade Finish",
    ],
  },
  {
    id: "skin-fade",
    title: "Artisan Skin Fade",
    category: "cut",
    price: "$75",
    duration: "50 mins",
    description:
      "Seamless skin-to-length transitions utilizing surgical micro-gradations, foil shaves, and custom hairline detailing for a razor-sharp outline.",
    image: "/sequence/ezgif-frame-120.jpg",
    features: [
      "Zero-Gap Foil Shaver Blend",
      "Tapered Temple & Nape Lines",
      "Symmetrical Mirror Alignment",
      "Matte Clay Texture Finish",
    ],
  },
  {
    id: "beard-sculpting",
    title: "Bespoke Beard Sculpting",
    category: "beard",
    price: "$45",
    duration: "30 mins",
    description:
      "Freehand clipper sculpturing to balance jawline geometry, straight razor cheek and neck definition, finished with warm beard oil infusion.",
    image: "/sequence/ezgif-frame-140.jpg",
    features: [
      "Jawline Proportion Shaping",
      "Hot Towel Steam Softening",
      "Straight Razor Perimeter Edging",
      "Organic Bergamot Beard Oil",
    ],
  },
  {
    id: "haircut-beard-combo",
    title: "Haircut & Beard Combo",
    category: "combo",
    price: "$95",
    duration: "75 mins",
    description:
      "Our most requested signature experience. Complete bespoke haircut combined with exhaustive beard sculpting, straight razor edging, and scalp treatment.",
    image: "/sequence/ezgif-frame-240.jpg",
    features: [
      "Comprehensive Hair & Beard Consult",
      "Full Scissor or Fade Architecture",
      "Straight Razor Detailing & Hot Towel",
      "Styling & Take-Home Maintenance Guide",
    ],
  },
  {
    id: "traditional-hot-towel",
    title: "Traditional Hot Towel Shave",
    category: "ritual",
    price: "$60",
    duration: "45 mins",
    description:
      "An unhurried gentleman's ritual. Eucalyptus-infused steaming towels, pre-shave badger brush lather, two-pass straight razor glide, and cold compress closure.",
    image: "/sequence/ezgif-frame-180.jpg",
    features: [
      "Dual Hot Towel Prep with Essential Oils",
      "Rich Badger Bristle Cream Lather",
      "Two-Pass Feather Blade Shave",
      "Cold Towel Pore Close & Soothing Balm",
    ],
  },
  {
    id: "premium-grooming-experience",
    title: "The Atelier Executive Ritual",
    category: "ritual",
    price: "$145",
    duration: "90 mins",
    description:
      "The pinnacle of grooming luxury. Full signature haircut, artisan beard sculpt or traditional shave, exfoliating face mask, scalp massage, and single-malt whisky service.",
    image: "/sequence/ezgif-frame-300.jpg",
    features: [
      "Complete Haircut & Beard Architecture",
      "Volcanic Clay Purifying Facial",
      "Extended Scalp & Neck Pressure Massage",
      "Complimentary Japanese Whiskey / Espresso",
    ],
  },
];

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hoveredService, setHoveredService] = useState<string>(SERVICES_DATA[0].id);

  const filtered =
    activeFilter === "all"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeFilter);

  const currentActive =
    SERVICES_DATA.find((s) => s.id === hoveredService) || SERVICES_DATA[0];

  return (
    <section id="services" className="relative py-24 md:py-32 bg-[#ffffff] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-[#FAF9F7] mb-4">
              <Scissors className="w-3.5 h-3.5 text-[#9E7B3A]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#9E7B3A] font-bold">
                CURATED ATELIER SERVICES
              </span>
            </div>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.06em] text-[#0F0F0F] uppercase leading-tight"
            >
              TAILORED FOR <br />
              <span className="text-[#9E7B3A]">THE MODERN GENTLEMAN.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#6E6962] max-w-md leading-relaxed">
            Every appointment begins with a one-on-one consultation regarding your facial proportions,
            hair texture, and personal lifestyle. Transparent pricing, unhurried execution.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-black/10 text-xs uppercase tracking-[0.2em] font-semibold">
          {[
            { id: "all", label: "All Rituals" },
            { id: "cut", label: "Hair & Fades" },
            { id: "beard", label: "Beard Sculpt" },
            { id: "ritual", label: "Classic Shaves" },
            { id: "combo", label: "Packages" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer rounded-none ${
                activeFilter === tab.id
                  ? "bg-[#0F0F0F] text-white font-bold"
                  : "text-[#6E6962] hover:text-[#0F0F0F] hover:bg-[#FAF9F7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editorial Split Layout: Left Interactive List, Right Visual Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Services List (7 Cols) */}
          <div className="lg:col-span-7 divide-y divide-black/10">
            {filtered.map((service) => {
              const isSelected = hoveredService === service.id;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setHoveredService(service.id)}
                  className={`group py-7 transition-all duration-300 cursor-pointer ${
                    isSelected ? "pl-4 border-l-2 border-[#9E7B3A] bg-[#FAF9F7]/70" : "pl-0"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3
                          style={{ fontFamily: "var(--font-serif)" }}
                          className={`text-xl sm:text-2xl font-bold tracking-wide transition-colors ${
                            isSelected
                              ? "text-[#9E7B3A]"
                              : "text-[#0F0F0F] group-hover:text-[#9E7B3A]"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-[#6E6962] font-mono">
                          <Clock className="w-3 h-3 text-[#9E7B3A]" />
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#6E6962] leading-relaxed max-w-xl mb-3">
                        {service.description}
                      </p>

                      {/* Key features chips */}
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 text-[10px] text-[#4A4640] bg-[#FAF9F7] px-2.5 py-1 rounded-sm border border-black/5"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#9E7B3A]" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Book Trigger */}
                    <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        style={{ fontFamily: "var(--font-serif)" }}
                        className="text-2xl sm:text-3xl font-bold text-[#0F0F0F]"
                      >
                        {service.price}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(service.id);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#9E7B3A] hover:text-[#0F0F0F] transition-colors py-1 group/btn"
                      >
                        <span>Book Service</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Visual Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative rounded-none border border-black/10 bg-[#FAF9F7] overflow-hidden p-3 shadow-md group">
              {/* Refined Image */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#ECE8E1]">
                <Image
                  src={currentActive.image}
                  alt={currentActive.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 border border-black/10 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#9E7B3A]" />
                  <span className="text-[10px] tracking-widest uppercase text-[#0F0F0F] font-bold">
                    Master Craft Technique
                  </span>
                </div>
              </div>

              {/* Service Details Card Footer */}
              <div className="p-6 bg-white border-t border-black/5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-xl font-bold text-[#0F0F0F]"
                  >
                    {currentActive.title}
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-2xl font-bold text-[#9E7B3A]"
                  >
                    {currentActive.price}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {currentActive.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#4A4640]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7B3A] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectService(currentActive.id)}
                  className="w-full py-3.5 bg-[#0F0F0F] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#9E7B3A] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Select & Book This Chair</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
