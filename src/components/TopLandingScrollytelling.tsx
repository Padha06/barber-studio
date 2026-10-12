"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, ArrowRight } from "lucide-react";

interface TopLandingScrollytellingProps {
  onBookChair: () => void;
  onExploreServices: () => void;
}

const TOTAL_FRAMES = 300;

interface CaptionScene {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  frameStart: number;
  frameEnd: number;
}

const SCENES: CaptionScene[] = [
  {
    id: 1,
    tag: "01 / THE ARRIVAL",
    title: "WELCOME TO THE ATELIER",
    subtitle: "Where classic heritage meets modern precision.",
    description:
      "Step inside our Mayfair sanctuary. A space created for men who appreciate uncompromising quality and unhurried craft.",
    frameStart: 1,
    frameEnd: 48,
  },
  {
    id: 2,
    tag: "02 / THE SANCTUARY",
    title: "ENTER THE STUDIO",
    subtitle: "A tailored space designed around you.",
    description:
      "Dark walnut cabinetry, hand-stitched leather chairs, and warm amber illumination. An acoustic haven away from the noise of the city.",
    frameStart: 49,
    frameEnd: 104,
  },
  {
    id: 3,
    tag: "03 / THE ART OF THE CUT",
    title: "PRECISION SKIN FADES",
    subtitle: "Zero-gap graduation & surgical micro-blends.",
    description:
      "Our master barbers sculpt with surgical exactness. Every clipper pass is tailored to your cranial geometry and hair texture.",
    frameStart: 105,
    frameEnd: 172,
  },
  {
    id: 4,
    tag: "04 / THE RITUAL",
    title: "HONORING EVERY DETAIL",
    subtitle: "Soft duster sweeps & straight razor clean-ups.",
    description:
      "From steaming eucalyptus hot towels to feather-blade perimeter definition, we treat grooming as an elevated ritual.",
    frameStart: 173,
    frameEnd: 224,
  },
  {
    id: 5,
    tag: "05 / THE MASTER ARSENAL",
    title: "TOOLS OF THE TRADE",
    subtitle: "Japanese forged steel & pro-grade clippers.",
    description:
      "Rotary motor trimmers, hand-honed shears, and small-batch apothecary pomades arranged on chilled Italian marble.",
    frameStart: 225,
    frameEnd: 268,
  },
  {
    id: 6,
    tag: "06 / THE SIGNATURE REVEAL",
    title: "LOOK SHARP. COMMAND THE ROOM.",
    subtitle: "Your signature look, perfected.",
    description:
      "Impeccable lines and effortless confidence. Reserve your private chair and experience the highest standard of grooming.",
    frameStart: 269,
    frameEnd: 300,
  },
];

export default function TopLandingScrollytelling({
  onBookChair,
  onExploreServices,
}: TopLandingScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeScene, setActiveScene] = useState<CaptionScene>(SCENES[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  const getFrameUrl = (frameIdx: number) => {
    const padded = String(frameIdx).padStart(3, "0");
    return `/sequence/ezgif-frame-${padded}.jpg`;
  };

  // Draw frame on canvas with mathematically exact aspect-ratio (NO STRETCHING)
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let img = imagesRef.current.get(frameIdx);
    if (!img || !img.complete) {
      let closest = 1;
      let minDiff = 999;
      imagesRef.current.forEach((cachedImg, idx) => {
        if (cachedImg.complete) {
          const diff = Math.abs(idx - frameIdx);
          if (diff < minDiff) {
            minDiff = diff;
            closest = idx;
          }
        }
      });
      img = imagesRef.current.get(closest);
    }

    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const canvasAspect = cw / ch;
    const imgAspect = iw / ih; // strictly 16:9 (~1.77778)

    // Clear background to obsidian tone
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, cw, ch);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const isMobile = cw / ch < 1.15;

    if (isMobile) {
      // =========================================================================
      // MOBILE DISPLAY: 100% UNSTRETCHED 16:9 VIEWPORT + ATMOSPHERIC REFLECTION
      // =========================================================================
      // 1. Atmospheric backdrop fill (subtle low-opacity reflection to eliminate black voids)
      let bgW: number;
      let bgH: number;
      let bgX: number;
      let bgY: number;

      if (canvasAspect > imgAspect) {
        bgW = cw;
        bgH = cw / imgAspect;
        bgX = 0;
        bgY = (ch - bgH) / 2;
      } else {
        bgH = ch;
        bgW = ch * imgAspect;
        bgX = (cw - bgW) / 2;
        bgY = 0;
      }

      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.drawImage(img, bgX, bgY, bgW, bgH);
      ctx.restore();

      // 2. Crisp, Uncropped 16:9 Main Video (Full Width, Exact 16:9 Proportions)
      const fitW = cw;
      const fitH = cw / imgAspect; // Exact 16:9 height!
      const fitX = 0;
      // Position video in upper-middle area (leaving lower area for captions)
      const fitY = Math.max(16, Math.floor(ch * 0.38 - fitH / 2));

      // Draw crisp main video
      ctx.drawImage(img, fitX, fitY, fitW, fitH);

      // Subtle divider lines top and bottom of video frame
      ctx.strokeStyle = "rgba(223, 199, 155, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, fitY);
      ctx.lineTo(cw, fitY);
      ctx.moveTo(0, fitY + fitH);
      ctx.lineTo(cw, fitY + fitH);
      ctx.stroke();
    } else {
      // =========================================================================
      // DESKTOP WIDESCREEN DISPLAY: CINEMATIC FULL VIEWPORT
      // =========================================================================
      let drawW: number;
      let drawH: number;
      let drawX: number;
      let drawY: number;

      if (canvasAspect > imgAspect) {
        drawW = cw;
        drawH = cw / imgAspect;
        drawX = 0;
        drawY = (ch - drawH) / 2;
      } else {
        drawH = ch;
        drawW = ch * imgAspect;
        drawX = (cw - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
  }, []);

  // Responsive canvas resize with correct DPR and style dimensions
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    setIsMobileScreen(width < 768);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawFrame(currentProgressRef.current ? Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1 : 1);
  }, [drawFrame]);

  // Preload sequence frames
  useEffect(() => {
    let isCancelled = false;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current.set(1, firstImg);
      handleResize();
      drawFrame(1);
    };

    const loadRemaining = async () => {
      // Step 1: Every 4th frame for immediate scrub feedback
      for (let i = 2; i <= TOTAL_FRAMES; i += 4) {
        if (isCancelled) return;
        if (!imagesRef.current.has(i)) {
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            if (isCancelled) return;
            imagesRef.current.set(i, img);
          };
        }
      }

      // Step 2: All remaining frames in sequence
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (isCancelled) return;
        if (!imagesRef.current.has(i)) {
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            if (isCancelled) return;
            imagesRef.current.set(i, img);
          };
          if (i % 20 === 0) {
            await new Promise((r) => setTimeout(r, 20));
          }
        }
      }
    };

    loadRemaining();

    return () => {
      isCancelled = true;
    };
  }, [handleResize, drawFrame]);

  // Resize and orientation change listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);

  // Natural scroll listener from top of page
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth lerp loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const lerpFactor = 0.12;
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpFactor;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setScrollProgress(p);

      const frameIdx = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.floor(p * (TOTAL_FRAMES - 1)) + 1)
      );

      setCurrentFrame(frameIdx);
      drawFrame(frameIdx);

      // Match active scene based on frame index
      for (const scene of SCENES) {
        if (frameIdx >= scene.frameStart && frameIdx <= scene.frameEnd) {
          setActiveScene(scene);
          break;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      id="hero"
      className="relative bg-white w-full"
      style={{ height: isMobileScreen ? "380vh" : "480vh" }} // Tailored mobile scroll depth
    >
      {/* Sticky Fullscreen Landing Viewport (100dvh for mobile stability) */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between bg-[#080808]">
        {/* Fullscreen Video Canvas: Razor Sharp & 100% Unstretched (No CSS Object-Fit distortion) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0"
        />

        {/* Desktop Left Vignette (Hidden on mobile) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Clean top dissolve */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

        {/* ========================================================= */}
        {/* DESKTOP FLOATING CAPTIONS (MD & UP)                       */}
        {/* ========================================================= */}
        <div className="hidden md:flex relative z-20 w-full max-w-7xl mx-auto px-8 lg:px-16 h-full items-center pointer-events-none">
          <div className="max-w-xl text-left pointer-events-auto transition-all duration-500">
            {/* Scene Tag */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#DFC79B] shadow-[0_0_8px_#DFC79B]" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.3em] text-[#DFC79B] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {activeScene.tag}
              </span>
            </div>

            {/* Scene Title */}
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight leading-[1.05] mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
            >
              {activeScene.title}
            </h2>

            {/* Scene Subtitle */}
            <p
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-xl md:text-2xl text-[#DFC79B] italic font-normal mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              “{activeScene.subtitle}”
            </p>

            {/* Scene Description */}
            <p className="text-sm md:text-base text-[#F5F1EB] leading-relaxed max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-light">
              {activeScene.description}
            </p>

            {/* CTAs on Final Reveal Scene */}
            {activeScene.id === 6 && (
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={onBookChair}
                  className="px-8 py-4 bg-[#DFC79B] text-[#0F0F0F] hover:bg-white font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_25px_rgba(223,199,155,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Your Chair</span>
                </button>

                <button
                  onClick={onExploreServices}
                  className="px-8 py-4 bg-black/60 border border-white/40 text-white hover:border-[#DFC79B] hover:text-[#DFC79B] backdrop-blur-sm font-semibold text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE LAYOUT (< MD) - TOP SCENE TAG & BOTTOM CAPTIONS    */}
        {/* ========================================================= */}
        <div className="md:hidden relative z-20 w-full h-full flex flex-col justify-between px-5 pt-5 pb-24 pointer-events-none">
          {/* Top Brand Pill & Scene Indicator */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFC79B]" />
              <span className="text-[10px] font-mono tracking-widest text-[#DFC79B] font-bold uppercase">
                {activeScene.tag}
              </span>
            </div>

            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/60">
              FRAME {currentFrame}/{TOTAL_FRAMES}
            </span>
          </div>

          {/* Bottom Captions Container (Placed below the 16:9 video) */}
          <div className="pointer-events-auto text-left pt-2 pb-2">
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight leading-tight mb-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            >
              {activeScene.title}
            </h2>

            <p
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-sm text-[#DFC79B] italic mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-1"
            >
              “{activeScene.subtitle}”
            </p>

            <p className="text-xs text-[#F5F1EB]/90 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-light line-clamp-3 mb-4">
              {activeScene.description}
            </p>

            {/* CTAs on Scene 6 on Mobile */}
            {activeScene.id === 6 ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={onBookChair}
                  className="w-full py-3.5 bg-[#DFC79B] text-[#0F0F0F] font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(223,199,155,0.4)] flex items-center justify-center gap-2 cursor-pointer rounded-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Your Chair</span>
                </button>
                <button
                  onClick={onExploreServices}
                  className="w-full py-2.5 bg-black/60 border border-white/30 text-white font-semibold text-xs tracking-[0.2em] uppercase backdrop-blur-sm cursor-pointer rounded-lg"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            ) : (
              /* Mobile Scroll Indicator */
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-mono tracking-widest uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DFC79B] animate-pulse" />
                <span>Swipe down to experience ritual</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Minimal Scroll Indicator */}
        <div
          className={`hidden md:flex absolute bottom-10 left-12 md:left-20 z-20 items-center gap-3 transition-all duration-500 pointer-events-none ${
            scrollProgress < 0.05
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-5 h-9 rounded-full border border-white/40 flex items-start justify-center p-1 bg-black/20 backdrop-blur-xs">
            <div className="w-1.5 h-2.5 bg-[#DFC79B] rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-semibold">
            Scroll to step inside
          </span>
        </div>
      </div>
    </div>
  );
}
