"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ArrowUpRight, Scissors, Sparkles, CheckCircle2 } from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  category: "hair" | "color" | "skin" | "bridal";
  price: string;
  duration: string;
  description: string;
  image: string;
  features: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "signature-haircut",
    title: "Signature Precision Cut & Styling",
    category: "hair",
    price: "₹850",
    duration: "45 mins",
    description:
      "Tailored haircut and styling crafted around your facial structure and hair texture. Includes relaxing wash ritual, scalp massage, and signature blow-dry finish.",
    image: "/frames/frame-115.webp",
    features: [
      "Personal Face & Crown Consultation",
      "Precision Shears & Micro-Clipper Blending",
      "Botanical Wash & Scalp Pressure Massage",
      "Bespoke Blow-Dry & Texture Finish",
    ],
  },
  {
    id: "fade-beard-ritual",
    title: "Executive Skin Fade & Beard Sculpt",
    category: "hair",
    price: "₹1,250",
    duration: "60 mins",
    description:
      "Seamless zero-gap skin fade paired with architectural beard sculpting, hot towel steam infusion, straight-razor line definition, and nourishing argan beard oil.",
    image: "/frames/frame-135.webp",
    features: [
      "Zero-Gap Graduated Fade Architecture",
      "Jawline Beard Proportion Balancing",
      "Eucalyptus Hot Towel & Razor Detailing",
      "Cold Compress & Cedarwood Beard Elixir",
    ],
  },
  {
    id: "balayage-color",
    title: "French Balayage & Couture Color",
    category: "color",
    price: "₹4,500",
    duration: "120 mins",
    description:
      "Hand-painted sun-kissed dimensional highlights and ammonia-free gloss toning engineered for effortless movement, luminous depth, and bond-protected shine.",
    image: "/frames/frame-075.webp",
    features: [
      "Custom Shade & Undertone Mapping",
      "Bond-Building Plex Protection",
      "Hand-Painted Seamless Graduation",
      "High-Gloss Toning & Deep Masque",
    ],
  },
  {
    id: "keratin-botox-ritual",
    title: "Brazilian Hair Botox & Keratin Ritual",
    category: "color",
    price: "₹5,500",
    duration: "150 mins",
    description:
      "Intensive protein and amino-acid infusion that eliminates frizz, repairs damaged cuticles, and restores mirror-like silkiness for up to 4 months.",
    image: "/frames/frame-185.webp",
    features: [
      "Deep Cuticle Repair & Frizz Elimination",
      "Formaldehyde-Free Botanical Protein",
      "Ceramic Wash Lounge Spa Treatment",
      "Thermal Seal & Silk Finish",
    ],
  },
  {
    id: "hydra-glow-skin",
    title: "Luxury Hydra-Glow Skin Ritual",
    category: "skin",
    price: "₹3,200",
    duration: "75 mins",
    description:
      "Multi-step dermal rejuvenation combining hydro-dermabrasion, botanical peptide infusion, lymphatic sculpting massage, and cooling gold hydro-jelly mask.",
    image: "/frames/frame-198.webp",
    features: [
      "Digital Skin Barrier Analysis",
      "Gentle Ultrasonic Pore Purification",
      "Hyaluronic & Vitamin C Serum Infusion",
      "24K Gold Illuminating Hydro-Mask",
    ],
  },
  {
    id: "bridal-nail-couture",
    title: "Editorial HD Makeup & Nail Artistry",
    category: "bridal",
    price: "₹6,500",
    duration: "120 mins",
    description:
      "Flawless airbrush/HD occasion makeup paired with bespoke gel nail extensions, French chrome detailing, and luxury hand spa therapy.",
    image: "/frames/frame-275.webp",
    features: [
      "HD / Airbrush Long-Wear Complexion",
      "Bespoke Eye & Lip Couture Styling",
      "Soft-Gel Nail Extensions & Chrome Art",
      "Rose-Quartz Cuticle & Hand Ritual",
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B48A3C]/30 bg-[#FAF8F4] mb-4">
              <Scissors className="w-3.5 h-3.5 text-[#0E4A35]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#0E4A35] font-bold">
                HAIR • SKIN • MAKEUP • NAILS
              </span>
            </div>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.04em] text-[#0F1F18] uppercase leading-tight"
            >
              SIGNATURE <br />
              <span className="text-[#9E7B3A]">H&amp;S SERVICES.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#5F6661] max-w-md leading-relaxed">
            Every visit to H&amp;S Salon begins with a personalized consultation. From precision haircuts
            and bespoke beard craft to French balayage, skin rituals, and nail couture—crafted with
            uncompromising attention to detail.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-black/10 text-xs uppercase tracking-[0.18em] font-semibold">
          {[
            { id: "all", label: "All Services" },
            { id: "hair", label: "Haircuts & Grooming" },
            { id: "color", label: "Color, Keratin & Botox" },
            { id: "skin", label: "Skin & Facials" },
            { id: "bridal", label: "Makeup & Nails" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer rounded-full ${
                activeFilter === tab.id
                  ? "bg-[#0E4A35] text-white font-bold shadow-xs"
                  : "text-[#5F6661] hover:text-[#0F1F18] hover:bg-[#FAF8F4]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editorial Split Layout: Left Interactive List, Right Arched Mirror Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Services List (7 Cols) */}
          <div className="lg:col-span-7 divide-y divide-black/10">
            {filtered.map((service) => {
              const isSelected = hoveredService === service.id;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onClick={() => setHoveredService(service.id)}
                  className={`group py-7 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "pl-5 border-l-2 border-[#0E4A35] bg-[#FAF8F4]/90"
                      : "pl-0 hover:pl-2"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1.5">
                        <h3
                          style={{ fontFamily: "var(--font-serif)" }}
                          className={`text-xl sm:text-2xl font-bold tracking-wide transition-colors ${
                            isSelected
                              ? "text-[#0E4A35]"
                              : "text-[#0F1F18] group-hover:text-[#9E7B3A]"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-[#5F6661] font-mono">
                          <Clock className="w-3 h-3 text-[#9E7B3A]" />
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5F6661] leading-relaxed max-w-xl mb-3">
                        {service.description}
                      </p>

                      {/* Key features chips */}
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 text-[10px] text-[#2F3A34] bg-white px-2.5 py-1 rounded-full border border-black/10"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#0E4A35]" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Book Trigger */}
                    <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        style={{ fontFamily: "var(--font-serif)" }}
                        className="text-2xl sm:text-3xl font-bold text-[#0F1F18]"
                      >
                        {service.price}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(service.id);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#0E4A35] hover:text-[#9E7B3A] transition-colors py-1 group/btn cursor-pointer"
                      >
                        <span>Book Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Arched Mirror Showcase Card (5 Cols - Inspired by H&S Salon Mirrors) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative rounded-t-[180px] rounded-b-2xl border-2 border-[#B48A3C]/40 bg-[#FAF8F4] overflow-hidden p-3.5 shadow-[0_20px_50px_rgba(14,74,53,0.1)] group">
              {/* Arched Mirror Image Container */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-t-[168px] rounded-b-lg bg-[#0E4A35]/10">
                <Image
                  src={currentActive.image}
                  alt={currentActive.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />

                {/* Bottom Badge Inside Arch */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B48A3C]/30 flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#9E7B3A]" />
                    <span className="text-[10px] tracking-widest uppercase text-[#0F1F18] font-bold">
                      H&amp;S Signature Standard
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Details Card Footer */}
              <div className="p-6 bg-white rounded-xl mt-3 border border-black/5">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F1F18]"
                  >
                    {currentActive.title}
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-2xl font-bold text-[#9E7B3A] flex-shrink-0"
                  >
                    {currentActive.price}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {currentActive.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#4A4640]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0E4A35] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectService(currentActive.id)}
                  className="w-full py-3.5 rounded-full bg-[#0E4A35] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#9E7B3A] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Reserve This Service</span>
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
