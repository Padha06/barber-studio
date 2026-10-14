"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface CraftSectionProps {
  onSelectCraft?: (category: string) => void;
}

const CRAFT_PANELS = [
  {
    num: "01",
    tag: "HAIR ARCHITECTURE",
    title: "The Blowout & Styling",
    subtitle: "Precision blow-dry, lifted volume, and glossy texture finished to move effortlessly.",
    image: "/images/craft/craft-hair-blowout.webp",
    cursorLabel: "EXPLORE",
    category: "hair",
  },
  {
    num: "02",
    tag: "COUTURE NAILS",
    title: "Hand-Painted Nail Art",
    subtitle: "Gel gloss, fine gold-leaf detailing, and Russian manicure precision finished like fine jewellery.",
    image: "/images/craft/craft-nails-couture.webp",
    cursorLabel: "ARTISTRY",
    category: "bridal",
  },
  {
    num: "03",
    tag: "EDITORIAL GLAM",
    title: "Soft-Focus Bridal & Glam",
    subtitle: "Radiant, camera-ready bridal and party makeup built luminous, light, and enduring.",
    image: "/images/craft/craft-glam-makeup.webp",
    cursorLabel: "RESERVE",
    category: "bridal",
  },
  {
    num: "04",
    tag: "MASTER ARSENAL",
    title: "Bespoke Barbering & Fades",
    subtitle: "Handcrafted zero-gap fades and straight-razor detailing by master barbers with 10+ years behind the chair.",
    image: "/images/craft/craft-master-barbering.webp",
    cursorLabel: "CHAIR",
    category: "hair",
  },
];

export default function CraftHorizontalSection({ onSelectCraft }: CraftSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Transform vertical scroll progress into horizontal track translation on desktop
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section
      ref={targetRef}
      id="craft"
      className="relative h-[120vh] md:h-[300vh] bg-[#F7F3EC] text-[#13211B]"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-6 lg:px-16 py-8">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto w-full mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[1px] bg-[#9E7B3A]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#0E4A35] font-bold uppercase">
                02 • THE CRAFT
              </span>
            </div>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#13211B]"
            >
              The Finest Tools. <br className="hidden sm:block" />
              <span className="italic font-normal text-[#0E4A35] lowercase">
                masters
              </span>{" "}
              At Work.
            </h2>
          </div>

          <p className="text-sm font-mono tracking-wider text-[#56645C] max-w-xs uppercase hidden md:block">
            Scroll vertically to traverse our master disciplines
          </p>
        </div>

        {/* Horizontal Reel Track on Desktop / Swipeable on Mobile */}
        <div className="w-full overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none">
          <motion.div
            style={{ x }}
            className="flex gap-6 lg:gap-10 w-max md:will-change-transform"
          >
            {CRAFT_PANELS.map((panel) => (
              <article
                key={panel.num}
                data-cursor={panel.cursorLabel}
                onClick={() => onSelectCraft?.(panel.category)}
                className="group relative w-[80vw] sm:w-[480px] lg:w-[560px] flex-none cursor-pointer select-none"
              >
                {/* Arched Architectural Media Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[140px] rounded-b-md bg-[#0F1C16] shadow-[0_16px_40px_rgba(19,33,27,0.12)] border border-[#E6E1D8] transition-transform duration-500 ease-out group-hover:shadow-[0_24px_50px_rgba(14,74,53,0.2)]">
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 560px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle darkening vignette on media */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Discipline Pill */}
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono tracking-[0.2em] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#D4B26A]" />
                    <span>{panel.tag}</span>
                  </div>
                </div>

                {/* Panel Typography Meta */}
                <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 pt-5 items-baseline">
                  <span
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="row-span-2 text-4xl sm:text-5xl italic font-normal text-[#9E7B3A] leading-none"
                  >
                    {panel.num}
                  </span>

                  <div className="flex items-center justify-between">
                    <h3
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#13211B] group-hover:text-[#0E4A35] transition-colors"
                    >
                      {panel.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-[#9E7B3A] transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>

                  <p className="text-xs sm:text-sm text-[#56645C] leading-relaxed line-clamp-2">
                    {panel.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
