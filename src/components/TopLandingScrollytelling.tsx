"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TopLandingScrollytellingProps {
  onBookChair: () => void;
  onExploreServices: () => void;
}

const TOTAL_FRAMES = 290;

interface CaptionScene {
  id: number;
  tag: string;
  timecode: string;
  title: string;
  subtitle: string;
  frameStart: number;
  frameEnd: number;
}

const SCENES: CaptionScene[] = [
  {
    id: 1,
    tag: "01 / EXTERIOR • NERUL WEST",
    timecode: "00:00 — 00:01",
    title: "Where luxury begins.",
    subtitle: "Welcome to H&S Salon.",
    frameStart: 1,
    frameEnd: 30,
  },
  {
    id: 2,
    tag: "02 / THE SANCTUARY",
    timecode: "00:01 — 00:02",
    title: "Designed for those who notice the details.",
    subtitle: "Every corner curated with intention.",
    frameStart: 31,
    frameEnd: 60,
  },
  {
    id: 3,
    tag: "03 / STYLING STATIONS",
    timecode: "00:02 — 00:03",
    title: "Precision. Atmosphere. Presence.",
    subtitle: "A space that elevates every visit.",
    frameStart: 61,
    frameEnd: 90,
  },
  {
    id: 4,
    tag: "04 / BESPOKE CRAFTSMANSHIP",
    timecode: "00:03 — 00:05",
    title: "Craftsmanship you can feel.",
    subtitle: "Every cut. Every line. Perfected.",
    frameStart: 91,
    frameEnd: 145,
  },
  {
    id: 5,
    tag: "05 / WASH LOUNGE & RITUALS",
    timecode: "00:05 — 00:07",
    title: "A ritual of care.",
    subtitle: "Where your hair finds its best version.",
    frameStart: 146,
    frameEnd: 205,
  },
  {
    id: 6,
    tag: "06 / MASTER ARSENAL",
    timecode: "00:07 — 00:08",
    title: "The tools of excellence.",
    subtitle: "Only the finest, always chosen with purpose.",
    frameStart: 206,
    frameEnd: 235,
  },
  {
    id: 7,
    tag: "07 / THE FINISHED LOOK",
    timecode: "00:08 — 00:10",
    title: "Confidence, redefined.",
    subtitle: "This is the H&S standard.",
    frameStart: 236,
    frameEnd: 290,
  },
];

export default function TopLandingScrollytelling({
  onBookChair,
  onExploreServices,
}: TopLandingScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeScene, setActiveScene] = useState<CaptionScene>(SCENES[0]);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const activeSceneIdRef = useRef<number>(1);
  const showScrollHintRef = useRef<boolean>(true);

  const getFrameUrl = (frameIdx: number) => {
    const padded = String(frameIdx).padStart(3, "0");
    return `/frames/frame-${padded}.webp`;
  };

  // Draw frame on canvas: WHOLE SCREEN, 100% CRYSTAL CLEAR, ZERO BLUR, HARDWARE ACCELERATED
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    if (!force && lastDrawnFrameRef.current === frameIdx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let img = imagesRef.current.get(frameIdx);
    let resolvedIdx = frameIdx;

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
      resolvedIdx = closest;
    }

    if (!img || !img.complete) return;
    if (!force && lastDrawnFrameRef.current === resolvedIdx) return;

    lastDrawnFrameRef.current = resolvedIdx;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const canvasAspect = cw / ch;
    const imgAspect = iw / ih;

    // Full screen edge-to-edge cover: zero letterboxing, zero blur, whole screen
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

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Responsive canvas resize with correct DPR and style dimensions
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const currentFrame = currentProgressRef.current
      ? Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1
      : 1;
    drawFrame(currentFrame, true);
  }, [drawFrame]);

  // Preload & pre-decode sequence frames in background worker queue for zero-stutter scrubbing
  useEffect(() => {
    let isCancelled = false;

    const loadAndDecodeFrame = (idx: number): Promise<void> => {
      return new Promise((resolve) => {
        if (isCancelled || imagesRef.current.has(idx)) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.src = getFrameUrl(idx);

        const finalize = () => {
          if (isCancelled) {
            resolve();
            return;
          }
          imagesRef.current.set(idx, img);
          if (idx === 1) {
            handleResize();
            drawFrame(1, true);
          }
          resolve();
        };

        if (img.decode) {
          img
            .decode()
            .then(finalize)
            .catch(() => {
              img.onload = finalize;
              img.onerror = () => resolve();
            });
        } else {
          img.onload = finalize;
          img.onerror = () => resolve();
        }
      });
    };

    const runPreloadPipeline = async () => {
      // 1. Frame 1 immediately
      await loadAndDecodeFrame(1);

      // Build priority order: stride 6 first (instant full-timeline scrub), then stride 2, then remaining
      const queue: number[] = [];
      const queuedSet = new Set<number>([1]);

      for (const stride of [6, 2, 1]) {
        for (let i = 2; i <= TOTAL_FRAMES; i += stride) {
          if (!queuedSet.has(i)) {
            queuedSet.add(i);
            queue.push(i);
          }
        }
      }

      // Run 8 concurrent image decoders
      const CONCURRENCY = 8;
      let cursor = 0;

      const worker = async () => {
        while (cursor < queue.length && !isCancelled) {
          const nextIdx = queue[cursor++];
          await loadAndDecodeFrame(nextIdx);
        }
      };

      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
      // Re-draw exact target frame once all frames are in memory
      if (!isCancelled) {
        const exactFrame = Math.max(
          1,
          Math.min(
            TOTAL_FRAMES,
            Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1
          )
        );
        drawFrame(exactFrame, true);
      }
    };

    runPreloadPipeline();

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

  // Zero-re-render 60fps smooth lerp loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      // Smooth filmic lerp interpolation (40% slower deliberate pacing)
      const lerpFactor = 0.075;
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.00005) {
        currentProgressRef.current += diff * lerpFactor;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;

      // Toggle scroll hint only when crossing threshold
      const shouldShowHint = p < 0.04;
      if (shouldShowHint !== showScrollHintRef.current) {
        showScrollHintRef.current = shouldShowHint;
        setShowScrollHint(shouldShowHint);
      }

      const frameIdx = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.floor(p * (TOTAL_FRAMES - 1)) + 1)
      );

      // Only draw to canvas when frameIdx actually changes
      drawFrame(frameIdx);

      // Update React state ONLY when entering a new scene (7 times across entire scroll)
      for (const scene of SCENES) {
        if (frameIdx >= scene.frameStart && frameIdx <= scene.frameEnd) {
          if (activeSceneIdRef.current !== scene.id) {
            activeSceneIdRef.current = scene.id;
            setActiveScene(scene);
          }
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
      style={{ height: "680vh" }} // Calibrated 40% slower scroll depth for ultra-smooth cinematic pacing
    >
      {/* Sticky Fullscreen Landing Viewport: WHOLE SCREEN EDGE-TO-EDGE */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-[#0B1510]">
        {/* Fullscreen Video Canvas: Razor Sharp & 100% Whole Screen (Zero Blur) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0"
        />

        {/* Subtle directional shadow gradient on left/bottom ONLY for text contrast (Zero Blur) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent md:bg-gradient-to-r md:from-black/65 md:via-black/15 md:to-transparent pointer-events-none z-10" />

        {/* ========================================================= */}
        {/* DESKTOP FLOATING SIDE CAPTIONS (MD & UP - No Box Bg)      */}
        {/* ========================================================= */}
        <div className="hidden md:flex relative z-20 w-full max-w-7xl mx-auto px-8 lg:px-16 h-full items-center pointer-events-none">
          <div
            key={activeScene.id}
            className="max-w-xl text-left pointer-events-auto transition-all duration-500 animate-fade-in"
          >
            {/* Scene Tag & Service Pillars */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#D4B26A] shadow-[0_0_10px_#D4B26A]" />
              <span className="text-xs font-mono font-bold tracking-[0.28em] text-[#D4B26A] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {activeScene.tag}
              </span>
            </div>

            {/* Scene Main Caption */}
            <h1
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
            >
              {activeScene.title}
            </h1>

            {/* Scene Supporting Line */}
            <p
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-xl md:text-2xl text-[#EAD39C] italic font-normal mb-5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            >
              {activeScene.subtitle}
            </p>

            {/* Hair | Skin | Makeup | Nails signature strip on Scene 1 & 7 */}
            {(activeScene.id === 1 || activeScene.id === 7) && (
              <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] uppercase text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] mb-6">
                <span>HAIR</span>
                <span className="text-[#D4B26A]">•</span>
                <span>SKIN</span>
                <span className="text-[#D4B26A]">•</span>
                <span>MAKEUP</span>
                <span className="text-[#D4B26A]">•</span>
                <span>NAILS</span>
              </div>
            )}

            {/* CTAs on Final Reveal Scene (Scene 7) */}
            {activeScene.id === 7 && (
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={onBookChair}
                  className="px-8 py-4 bg-[#D4B26A] text-[#0B1510] hover:bg-white font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_25px_rgba(212,178,106,0.45)] cursor-pointer flex items-center justify-center gap-2 rounded-full"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>

                <button
                  onClick={onExploreServices}
                  className="px-8 py-4 bg-black/50 border border-white/40 text-white hover:border-[#D4B26A] hover:text-[#D4B26A] font-semibold text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer rounded-full"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE FLOATING CAPTIONS (< MD) - WHOLE SCREEN OVERLAY   */}
        {/* ========================================================= */}
        <div className="md:hidden relative z-20 w-full h-full flex flex-col justify-end px-6 pb-24 pointer-events-none">
          <div
            key={activeScene.id}
            className="pointer-events-auto text-left max-w-sm transition-all duration-500"
          >
            {/* Scene Tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D4B26A] shadow-[0_0_8px_#D4B26A]" />
              <span className="text-[10px] font-mono font-bold tracking-[0.24em] text-[#D4B26A] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {activeScene.tag}
              </span>
            </div>

            {/* Title */}
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2 drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)]"
            >
              {activeScene.title}
            </h2>

            {/* Subtitle */}
            <p
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-base text-[#EAD39C] italic mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium"
            >
              {activeScene.subtitle}
            </p>

            {/* Hair | Skin | Makeup | Nails pill on mobile */}
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mb-4">
              <Sparkles className="w-3 h-3 text-[#D4B26A]" />
              <span>Hair • Skin • Makeup • Nails</span>
            </div>

            {/* CTAs on Final Scene on Mobile */}
            {activeScene.id === 7 ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={onBookChair}
                  className="w-full py-3.5 bg-[#D4B26A] text-[#0B1510] font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(212,178,106,0.4)] flex items-center justify-center gap-2 cursor-pointer rounded-full"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={onExploreServices}
                  className="w-full py-3 bg-black/50 border border-white/40 text-white font-semibold text-xs tracking-[0.2em] uppercase cursor-pointer rounded-full"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            ) : (
              /* Mobile Scroll Indicator */
              <div className="flex items-center gap-2 text-white/80 text-[10px] font-mono tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4B26A] animate-pulse" />
                <span>Scroll to experience H&amp;S Salon</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Minimal Scroll Indicator */}
        <div
          className={`hidden md:flex absolute bottom-10 left-8 lg:left-16 z-20 items-center gap-3 transition-all duration-500 pointer-events-none ${
            showScrollHint
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-5 h-9 rounded-full border border-white/50 flex items-start justify-center p-1 bg-black/25">
            <div className="w-1.5 h-2.5 bg-[#D4B26A] rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-semibold">
            Scroll to step inside H&amp;S Salon
          </span>
        </div>
      </div>
    </div>
  );
}
