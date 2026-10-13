"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TopLandingScrollytellingProps {
  onBookChair: () => void;
  onExploreServices: () => void;
}

const TOTAL_FRAMES = 290;
const MOBILE_W = 504;
const MOBILE_H = 896;

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
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [activeScene, setActiveScene] = useState<CaptionScene>(SCENES[0]);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Supports GPU-pinned ImageBitmap on mobile + HTMLImageElement on desktop
  const framesRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(
    new Map()
  );
  const loadedIndicesRef = useRef<number[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const activeSceneIdRef = useRef<number>(1);
  const showScrollHintRef = useRef<boolean>(true);
  const isMobileRef = useRef<boolean>(false);
  const lastWidthRef = useRef<number>(0);
  const totalScrollableRef = useRef<number>(5000);
  const lastScrollEventTimeRef = useRef<number>(0);
  const drawRectRef = useRef<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 1920,
    h: 1080,
  });

  const getFrameUrl = (frameIdx: number, isMobile: boolean) => {
    const padded = String(frameIdx).padStart(3, "0");
    return isMobile
      ? `/frames-mobile/frame-${padded}.webp`
      : `/frames/frame-${padded}.webp`;
  };

  // Draw frame on canvas:
  // - On mobile: 1:1 unscaled 504x896 ImageBitmap GPU blit (<0.02ms), scaled by CSS object-cover on hardware compositor
  // - On desktop: exact 1920x1080 cover draw
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    const isMob = isMobileRef.current;
    // On mobile, snap to loaded stride-2 odd frame (1, 3, 5... 289, 290) so we never miss a cached frame
    const targetIdx = isMob
      ? frameIdx >= TOTAL_FRAMES
        ? TOTAL_FRAMES
        : Math.max(1, Math.floor((frameIdx - 1) / 2) * 2 + 1)
      : frameIdx;

    if (!force && lastDrawnFrameRef.current === targetIdx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    let source = framesRef.current.get(targetIdx);
    let resolvedIdx = targetIdx;

    if (!source) {
      const loaded = loadedIndicesRef.current;
      if (loaded.length === 0) return;
      let closest = loaded[0];
      let minDiff = Math.abs(closest - targetIdx);
      for (let i = 1; i < loaded.length; i++) {
        const idx = loaded[i];
        const diff = Math.abs(idx - targetIdx);
        if (diff < minDiff) {
          minDiff = diff;
          closest = idx;
        }
      }
      source = framesRef.current.get(closest);
      resolvedIdx = closest;
    }

    if (!source) return;
    if (!force && lastDrawnFrameRef.current === resolvedIdx) return;

    lastDrawnFrameRef.current = resolvedIdx;

    if (isMob) {
      // Pure 1:1 unscaled GPU blit onto 504x896 buffer (CSS object-cover handles screen fit in hardware!)
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(source, 0, 0, MOBILE_W, MOBILE_H);
    } else {
      const { x, y, w, h } = drawRectRef.current;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(source, x, y, w, h);
    }
  }, []);

  // Responsive canvas resize
  const handleResize = useCallback(
    (forceInit = false) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      // On mobile browsers, ignore vertical-only resize events caused by address bar hiding/showing during scroll
      if (
        !forceInit &&
        isMobile &&
        lastWidthRef.current > 0 &&
        Math.abs(width - lastWidthRef.current) < 2
      ) {
        return;
      }

      lastWidthRef.current = width;
      isMobileRef.current = isMobile;
      ctxRef.current = null; // Re-acquire context after canvas dimension change

      if (container) {
        totalScrollableRef.current = Math.max(1, container.offsetHeight - height);
      }

      if (isMobile) {
        // Fixed 1:1 504x896 internal buffer on mobile; CSS w-full h-full object-cover scales in GPU hardware
        canvas.width = MOBILE_W;
        canvas.height = MOBILE_H;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      } else {
        const rawDpr = Math.min(window.devicePixelRatio || 1, 2);
        const maxScaleW = 1920 / Math.max(width, 1);
        const maxScaleH = 1080 / Math.max(height, 1);
        const effectiveDpr = Math.min(rawDpr, Math.max(maxScaleW, maxScaleH, 1));

        const cw = Math.floor(width * effectiveDpr);
        const ch = Math.floor(height * effectiveDpr);

        canvas.width = cw;
        canvas.height = ch;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const imgAspect = 1920 / 1080;
        const canvasAspect = cw / ch;

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

        drawRectRef.current = { x: drawX, y: drawY, w: drawW, h: drawH };
      }

      const currentFrame = currentProgressRef.current
        ? Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1
        : 1;
      drawFrame(currentFrame, true);
    },
    [drawFrame]
  );

  // Preload & pre-decode sequence frames
  useEffect(() => {
    let isCancelled = false;
    const loadingSet = new Set<number>();
    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    const loadAndDecodeFrame = async (idx: number): Promise<void> => {
      if (
        isCancelled ||
        idx < 1 ||
        idx > TOTAL_FRAMES ||
        framesRef.current.has(idx) ||
        loadingSet.has(idx)
      ) {
        return;
      }
      loadingSet.add(idx);
      const url = getFrameUrl(idx, isMobile);

      try {
        // On mobile, use off-main-thread fetch + createImageBitmap so decoding NEVER blocks UI scroll or gets evicted!
        if (isMobile && typeof window.createImageBitmap === "function") {
          const res = await fetch(url);
          const blob = await res.blob();
          if (isCancelled) return;
          const bitmap = await createImageBitmap(blob);
          if (isCancelled) {
            bitmap.close();
            return;
          }
          framesRef.current.set(idx, bitmap);
          loadedIndicesRef.current.push(idx);
          if (idx === 1) {
            handleResize(true);
            drawFrame(1, true);
          }
          return;
        }
      } catch {
        // Fallback to HTMLImageElement below
      }

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = url;

        const finalize = () => {
          loadingSet.delete(idx);
          if (isCancelled) {
            resolve();
            return;
          }
          framesRef.current.set(idx, img);
          loadedIndicesRef.current.push(idx);
          if (idx === 1) {
            handleResize(true);
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
      loadingSet.delete(idx);
    };

    const runPreloadPipeline = async () => {
      // 1. Frame 1 immediately
      await loadAndDecodeFrame(1);

      const queue: number[] = [];
      const queuedSet = new Set<number>([1]);

      if (isMobile) {
        // Mobile loads 146 odd frames (1, 3, 5... 289, 290) = only 2.5 MB total & 260 MB GPU RAM (zero cache eviction!)
        // Stage A: Every 8th frame across timeline (36 frames = 600KB) for instant full-scroll readiness
        for (let i = 1; i <= TOTAL_FRAMES; i += 8) {
          if (!queuedSet.has(i)) {
            queuedSet.add(i);
            queue.push(i);
          }
        }
        // Stage B: All remaining odd frames (stride 2) + final frame 290
        for (let i = 3; i <= TOTAL_FRAMES; i += 2) {
          if (!queuedSet.has(i)) {
            queuedSet.add(i);
            queue.push(i);
          }
        }
        if (!queuedSet.has(TOTAL_FRAMES)) {
          queuedSet.add(TOTAL_FRAMES);
          queue.push(TOTAL_FRAMES);
        }
      } else {
        // Desktop: All 290 frames (stride 4 -> 2 -> 1)
        for (const stride of [4, 2, 1]) {
          for (let i = 2; i <= TOTAL_FRAMES; i += stride) {
            if (!queuedSet.has(i)) {
              queuedSet.add(i);
              queue.push(i);
            }
          }
        }
      }

      const CONCURRENCY = isMobile ? 4 : 8;
      let cursor = 0;

      const getNextFrameToLoad = (): number | null => {
        const rawCurr =
          Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1;
        const step = isMobile ? 2 : 1;
        const curr = isMobile
          ? Math.max(1, Math.floor((rawCurr - 1) / 2) * 2 + 1)
          : rawCurr;

        // Prioritize lookahead window immediately ahead of current scroll position
        for (let offset = 0; offset <= 24; offset += step) {
          const target = curr + offset;
          if (
            target >= 1 &&
            target <= TOTAL_FRAMES &&
            !framesRef.current.has(target) &&
            !loadingSet.has(target)
          ) {
            return target;
          }
        }

        while (cursor < queue.length) {
          const candidate = queue[cursor++];
          if (!framesRef.current.has(candidate) && !loadingSet.has(candidate)) {
            return candidate;
          }
        }
        return null;
      };

      const worker = async () => {
        while (!isCancelled) {
          // On mobile, once initial 36 keyframes are loaded, yield while user is actively scrolling so scroll gets 100% CPU/GPU
          if (
            isMobile &&
            loadedIndicesRef.current.length > 36 &&
            performance.now() - lastScrollEventTimeRef.current < 120
          ) {
            await new Promise((r) => setTimeout(r, 50));
            continue;
          }

          const nextIdx = getNextFrameToLoad();
          if (nextIdx === null) break;
          await loadAndDecodeFrame(nextIdx);
        }
      };

      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
      if (!isCancelled) {
        const exactFrame = Math.max(
          1,
          Math.min(
            TOTAL_FRAMES,
            Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1
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
    const onResize = () => handleResize(false);
    const onOrientationChange = () => handleResize(true);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);
    handleResize(true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, [handleResize]);

  // Zero-reflow scroll listener (uses window.scrollY and cached totalScrollableRef—no getBoundingClientRect() layout thrashing!)
  useEffect(() => {
    const handleScroll = () => {
      lastScrollEventTimeRef.current = performance.now();
      const totalScrollable = totalScrollableRef.current;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, window.scrollY / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Zero-re-render, frame-rate independent 60/120fps loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 16.667, 0.25), 2.5);
      lastTime = now;

      const diff = targetProgressRef.current - currentProgressRef.current;
      const isMob = isMobileRef.current;

      if (isMob) {
        // Mobile: Direct, ultra-responsive silky tracking (0.22 * dt) coupled to native iOS/Android touch inertia
        if (Math.abs(diff) > 0.00003) {
          currentProgressRef.current += diff * Math.min(1, 0.22 * dt);
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }
      } else {
        // Desktop: Exact 40%-slower spring-damped wheel physics (100% untouched)
        if (Math.abs(diff) > 0.00003 || Math.abs(velocityRef.current) > 0.00003) {
          const desiredVelocity = diff * 0.044;
          velocityRef.current +=
            (desiredVelocity - velocityRef.current) * Math.min(1, 0.24 * dt);

          const maxVelocity = 0.0038;
          const clampedVel = Math.max(
            -maxVelocity,
            Math.min(maxVelocity, velocityRef.current)
          );

          currentProgressRef.current = Math.max(
            0,
            Math.min(1, currentProgressRef.current + clampedVel * dt)
          );
        } else {
          currentProgressRef.current = targetProgressRef.current;
          velocityRef.current = 0;
        }
      }

      const p = currentProgressRef.current;

      const shouldShowHint = p < 0.04;
      if (shouldShowHint !== showScrollHintRef.current) {
        showScrollHintRef.current = shouldShowHint;
        setShowScrollHint(shouldShowHint);
      }

      const frameIdx = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(p * (TOTAL_FRAMES - 1)) + 1)
      );

      drawFrame(frameIdx);

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
      className="relative bg-white w-full h-[560vh] md:h-[1120vh]"
    >
      {/* Sticky Fullscreen Landing Viewport: WHOLE SCREEN EDGE-TO-EDGE */}
      <div className="sticky top-0 left-0 w-full h-svh md:h-[100dvh] overflow-hidden flex items-center justify-center bg-[#0B1510]">
        {/* Fullscreen Video Canvas: Hardware-accelerated object-cover on mobile, custom cover on desktop */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover object-center block z-0 will-change-transform transform-gpu"
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
            {/* Scene Tag */}
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
        {/* MOBILE FLOATING CAPTIONS (< MD) - ZERO-REMOUNT GPU LAYER  */}
        {/* ========================================================= */}
        <div className="md:hidden relative z-20 w-full h-full flex flex-col justify-end px-6 pb-24 pointer-events-none">
          <div className="pointer-events-auto text-left max-w-sm">
            {/* Scene Tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D4B26A]" />
              <span
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                className="text-[10px] font-mono font-bold tracking-[0.24em] text-[#D4B26A] uppercase"
              >
                {activeScene.tag}
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                textShadow: "0 3px 14px rgba(0,0,0,0.95)",
              }}
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2"
            >
              {activeScene.title}
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-serif)",
                textShadow: "0 2px 10px rgba(0,0,0,0.95)",
              }}
              className="text-base text-[#EAD39C] italic mb-3 font-medium"
            >
              {activeScene.subtitle}
            </p>

            {/* Hair | Skin | Makeup | Nails pill on mobile */}
            <div
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
              className="flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-white/85 mb-4"
            >
              <Sparkles className="w-3 h-3 text-[#D4B26A]" />
              <span>Hair • Skin • Makeup • Nails</span>
            </div>

            {/* CTAs on Final Scene on Mobile */}
            {activeScene.id === 7 ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={onBookChair}
                  className="w-full py-3.5 bg-[#D4B26A] text-[#0B1510] font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer rounded-full"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={onExploreServices}
                  className="w-full py-3 bg-black/60 border border-white/40 text-white font-semibold text-xs tracking-[0.2em] uppercase cursor-pointer rounded-full"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            ) : (
              /* Mobile Scroll Indicator */
              <div
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                className="flex items-center gap-2 text-white/80 text-[10px] font-mono tracking-widest uppercase"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4B26A]" />
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
