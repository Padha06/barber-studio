"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
    image: "/images/craft/craft-hair-blowout.webp",
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
    image: "/images/craft/craft-master-barbering.webp",
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
      "Gloss Glaze & Silk Sealing Mask",
    ],
  },
  {
    id: "keratin-botox",
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
      "High-Gloss Heat Sealing Polish",
    ],
  },
  {
    id: "hydra-glow-facial",
    title: "Luxury Hydra-Glow Skin Ritual",
    category: "skin",
    price: "₹3,200",
    duration: "75 mins",
    description:
      "Multi-step dermal rejuvenation combining hydro-dermabrasion, botanical peptide infusion, lymphatic sculpting massage, and cooling gold hydro-jelly mask.",
    image: "/frames/frame-045.webp",
    features: [
      "Digital Skin Barrier Analysis",
      "Gentle Ultrasonic Pore Purification",
      "Hyaluronic & Vitamin C Serum Infusion",
      "Sculpting Cold-Globe Lymphatic Drainage",
    ],
  },
  {
    id: "editorial-makeup-nails",
    title: "Editorial HD Makeup & Nail Artistry",
    category: "bridal",
    price: "₹6,500",
    duration: "120 mins",
    description:
      "Flawless airbrush/HD occasion makeup paired with bespoke gel nail extensions, French chrome detailing, and luxury hand spa therapy.",
    image: "/images/craft/craft-nails-couture.webp",
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
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_DATA[0].id);

  const filtered =
    activeFilter === "all"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeFilter);

  const currentActive =
    SERVICES_DATA.find((s) => s.id === activeServiceId) || filtered[0] || SERVICES_DATA[0];

  // Scroll tracking on both mobile & desktop: observe which card overlaps into view
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 1024;
      // On mobile, trigger point is right under the sticky image (~280px)
      // On desktop, trigger point is mid-screen
      const targetThreshold = isMobile ? 320 : window.innerHeight * 0.45;

      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetThreshold && rect.bottom >= targetThreshold) {
            const srv = filtered[i];
            if (srv && srv.id !== activeServiceId) {
              setActiveServiceId(srv.id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filtered, activeServiceId]);

  return (
    <section id="services" className="relative py-16 md:py-32 bg-[#ffffff] border-t border-black/5 overflow-visible">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#0E4A35]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#9E7B3A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-6 sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B48A3C]/30 bg-[#FAF8F4] mb-3 shadow-xs">
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

        {/* Filter Tabs with Smooth Indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-12 border-b border-black/10 text-xs uppercase tracking-[0.18em] font-semibold scrollbar-none">
          {[
            { id: "all", label: "All Services" },
            { id: "hair", label: "Haircuts & Grooming" },
            { id: "color", label: "Color, Keratin & Botox" },
            { id: "skin", label: "Skin & Facials" },
            { id: "bridal", label: "Makeup & Nails" },
          ].map((tab) => {
            const isTabActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  const firstOfFilter =
                    tab.id === "all"
                      ? SERVICES_DATA[0].id
                      : SERVICES_DATA.find((s) => s.category === tab.id)?.id || SERVICES_DATA[0].id;
                  setActiveServiceId(firstOfFilter);
                }}
                className={`relative px-4 sm:px-5 py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer rounded-full ${
                  isTabActive
                    ? "text-white font-bold"
                    : "text-[#5F6661] hover:text-[#0F1F18] hover:bg-[#FAF8F4]"
                }`}
              >
                {isTabActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#0E4A35] rounded-full shadow-xs -z-10"
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* MOBILE STACK ARCHITECTURE (< LG): STICKY IMAGE AT TOP + OVERLAPPING CARDS BELOW */}
        {/* =================================================================== */}
        <div className="lg:hidden relative pb-16">
          {/* Card 1: Permanently visible sticky image frame (z-40) pinned at top */}
          <div className="sticky top-16 z-40 pt-2 pb-2 bg-white/95 backdrop-blur-md">
            <div className="relative h-48 w-full max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-[#B48A3C]/40 bg-[#0F1F18] shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentActive.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentActive.image}
                    alt={currentActive.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Top Pill inside sticky image */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4B26A]/40 text-[#D4B26A] text-[9px] font-mono tracking-widest uppercase">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{currentActive.duration} • SIGNATURE</span>
              </div>

              {/* Active Service Title & Price overlay on sticky photo */}
              <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-end justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#D4B26A] block">
                    ACTIVE SERVICE
                  </span>
                  <h4
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-base font-bold text-white leading-tight line-clamp-1"
                  >
                    {currentActive.title}
                  </h4>
                </div>
                <span
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-xl font-bold text-[#EAD39C] flex-shrink-0"
                >
                  {currentActive.price}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Overlapping Cards Stack that slide and stack over each other */}
          <div className="relative pt-4 space-y-6">
            {filtered.map((service, idx) => {
              const isSelected = activeServiceId === service.id;
              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveServiceId(service.id)}
                  style={{
                    // Each card sticks below the image (image is ~200px tall), and stacks slightly
                    top: `${275 + idx * 8}px`,
                    zIndex: 10 + idx,
                  }}
                  className={`sticky rounded-2xl p-5 transition-all duration-300 border cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF8F4] border-[#0E4A35] shadow-[0_16px_36px_rgba(14,74,53,0.22)] ring-1 ring-[#0E4A35]"
                      : "bg-white border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.08)] opacity-95"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0E4A35]" />
                        <span className="text-[9px] font-mono tracking-widest uppercase text-[#5F6661]">
                          0{idx + 1} • {service.duration}
                        </span>
                      </div>
                      <h3
                        style={{ fontFamily: "var(--font-serif)" }}
                        className={`text-lg font-bold leading-snug transition-colors ${
                          isSelected ? "text-[#0E4A35]" : "text-[#0F1F18]"
                        }`}
                      >
                        {service.title}
                      </h3>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        style={{ fontFamily: "var(--font-serif)" }}
                        className="text-xl font-bold text-[#9E7B3A] block"
                      >
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5F6661] leading-relaxed mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {service.features.slice(0, 2).map((feat) => (
                      <span
                        key={feat}
                        className="inline-flex items-center gap-1 text-[9px] text-[#2F3A34] bg-white px-2 py-0.5 rounded-full border border-black/10"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#0E4A35]" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Direct Book CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService(service.id);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#0E4A35] text-white text-xs font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-1.5 hover:bg-[#9E7B3A] transition-all active:scale-98 shadow-xs cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* DESKTOP SPLIT VIEW (LG & UP): 7-Col Interactive List + Sticky Mirror */}
        {/* =================================================================== */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start relative">
          {/* Services List (7 Cols) */}
          <div className="col-span-7 divide-y divide-black/10">
            {filtered.map((service, idx) => {
              const isSelected = activeServiceId === service.id;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`group py-7 transition-all duration-300 cursor-pointer rounded-xl ${
                    isSelected
                      ? "pl-5 border-l-4 border-[#0E4A35] bg-[#FAF8F4]/90 shadow-2xs"
                      : "pl-2 hover:pl-3 hover:bg-[#FAF8F4]/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <h3
                          style={{ fontFamily: "var(--font-serif)" }}
                          className={`text-2xl font-bold tracking-wide transition-colors ${
                            isSelected
                              ? "text-[#0E4A35]"
                              : "text-[#0F1F18] group-hover:text-[#9E7B3A]"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-[#5F6661] font-mono px-2 py-0.5 rounded-full bg-black/5">
                          <Clock className="w-3 h-3 text-[#9E7B3A]" />
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      <p className="text-sm text-[#5F6661] leading-relaxed max-w-xl mb-3">
                        {service.description}
                      </p>

                      {/* Key features chips */}
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 text-[10px] text-[#2F3A34] bg-white px-2.5 py-1 rounded-full border border-black/10 shadow-2xs"
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
                        className="text-3xl font-bold text-[#0F1F18]"
                      >
                        {service.price}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(service.id);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full bg-[#0E4A35] text-white hover:bg-[#9E7B3A] transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>Book Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky Arched Mirror Showcase Card (5 Cols - Desktop Mirror View pinned until all services finish) */}
          <div className="col-span-5 sticky top-24 self-start">
            <div className="relative rounded-t-[180px] rounded-b-2xl border-2 border-[#B48A3C]/40 bg-[#FAF8F4] overflow-hidden p-3.5 shadow-[0_20px_50px_rgba(14,74,53,0.1)] group">
              {/* Arched Mirror Image Container with Framer Cross-Dissolve */}
              <div className="relative h-96 w-full overflow-hidden rounded-t-[168px] rounded-b-lg bg-[#0E4A35]/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentActive.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentActive.image}
                      alt={currentActive.title}
                      fill
                      sizes="40vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Badge Inside Arch */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentActive.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span
                        style={{ fontFamily: "var(--font-serif)" }}
                        className="text-xl font-bold text-[#0F1F18]"
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
                      className="w-full py-3.5 rounded-full bg-[#0E4A35] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#9E7B3A] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                    >
                      <span>Reserve This Service</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
