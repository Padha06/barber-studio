"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";

interface TopLandingScrollytellingProps {
  onBookChair: () => void;
  onExploreServices: () => void;
}

const TOTAL_FRAMES = 290;
// Mobile canvas matches the regenerated 540×960 frames 1:1. CSS object-cover
// scales it on the hardware compositor — no CPU resample, no black edge
// from mismatched crop math.
const MOBILE_W = 540;
const MOBILE_H = 960;
// Mobile ships an expanded 170-frame set (35 drone/storefront intro + 135 balanced luxury interior).
// Preloaded via createImageBitmap off-main-thread with zero GPU tearing.
const MOBILE_TOTAL_FRAMES = 170;

interface CaptionScene {
  id: number;
  tag: string;
  timecode: string;
  title: string;
  subtitle: string;
  // Normalized scroll progress [0, 1], breakpoint-agnostic so captions swap
  // at the same scroll position on both 290-frame desktop and 180-frame
  // mobile sequences.
  progressStart: number;
  progressEnd: number;
}

const SCENES: CaptionScene[] = [
  {
    id: 1,
    tag: "01 / THE ARRIVAL • NERUL WEST",
    timecode: "00:00 — 00:01",
    title: "Where luxury begins.",
    subtitle: "Welcome to H&S Salon.",
    progressStart: 0,
    progressEnd: 30 / 289,
  },
  {
    id: 2,
    tag: "02 / THE SANCTUARY",
    timecode: "00:01 — 00:02",
    title: "Designed for those who notice the details.",
    subtitle: "Every corner curated with intention.",
    progressStart: 30 / 289,
    progressEnd: 60 / 289,
  },
  {
    id: 3,
    tag: "03 / STYLING STATIONS",
    timecode: "00:02 — 00:03",
    title: "Precision. Atmosphere. Presence.",
    subtitle: "A space that elevates every visit.",
    progressStart: 60 / 289,
    progressEnd: 90 / 289,
  },
  {
    id: 4,
    tag: "04 / BESPOKE CRAFTSMANSHIP",
    timecode: "00:03 — 00:05",
    title: "Craftsmanship you can feel.",
    subtitle: "Every cut. Every line. Perfected.",
    progressStart: 90 / 289,
    progressEnd: 145 / 289,
  },
  {
    id: 5,
    tag: "05 / WASH LOUNGE & RITUALS",
    timecode: "00:05 — 00:07",
    title: "A ritual of care.",
    subtitle: "Where your hair finds its best version.",
    progressStart: 145 / 289,
    progressEnd: 205 / 289,
  },
  {
    id: 6,
    tag: "06 / MASTER ARSENAL",
    timecode: "00:07 — 00:08",
    title: "The tools of excellence.",
    subtitle: "Only the finest, always chosen with purpose.",
    progressStart: 205 / 289,
    progressEnd: 235 / 289,
  },
  {
    id: 7,
    tag: "07 / THE FINISHED LOOK",
    timecode: "00:08 — 00:10",
    title: "Confidence, redefined.",
    subtitle: "This is the H&S standard.",
    progressStart: 235 / 289,
    progressEnd: 1,
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
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadFinished, setPreloadFinished] = useState(false);

  // Decoded frames ready to draw (HTMLImageElement on both breakpoints)
  const framesRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(
    new Map()
  );
  const loadedSetRef = useRef<Set<number>>(new Set());

  // Scroll state — single source of truth, read directly from DOM
  const lastDrawnFrameRef = useRef<number>(-1);
  const activeSceneIdRef = useRef<number>(1);
  const showScrollHintRef = useRef<boolean>(true);
  const isMobileRef = useRef<boolean>(false);
  const lastWidthRef = useRef<number>(0);
  const totalScrollableRef = useRef<number>(5000);
  const scrollYRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(1);
  const visibleRef = useRef<boolean>(true);
  const scrollDirRef = useRef<number>(1);
  const lastScrollYRef = useRef<number>(0);

  // Desktop & mobile spring physics state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const mobileVelocityRef = useRef(0);

  const drawRectRef = useRef<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 1920,
    h: 1080,
  });

  const getFrameUrl = useCallback((frameIdx: number, isMobile: boolean) => {
    const padded = String(frameIdx).padStart(3, "0");
    return isMobile
      ? `/frames-mobile/frame-${padded}.webp`
      : `/frames/frame-${padded}.webp`;
  }, []);

  // ─── drawFrame ────────────────────────────────────────────────────────────
  // Both paths draw an already-decoded HTMLImageElement.
  // Mobile:  1:1 blit onto the fixed 540×960 buffer; CSS object-cover
  //          scales it on the HW compositor — no CPU cost.
  // Desktop: exact cover-scaled draw into the DPR-aware canvas buffer.
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    const isMob = isMobileRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Never blank: fall back to the closest resident frame while the exact
    // one decodes (the loop re-draws the moment it arrives).
    let targetIdx = frameIdx;
    if (!framesRef.current.has(targetIdx)) {
      let best = -1;
      let bestDist = Infinity;
      for (const idx of framesRef.current.keys()) {
        const d = Math.abs(idx - frameIdx);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      }
      if (best === -1) return;
      targetIdx = best;
    }

    if (!force && lastDrawnFrameRef.current === targetIdx) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: false,
      });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const source = framesRef.current.get(targetIdx);
    if (!source) return;

    lastDrawnFrameRef.current = targetIdx;

    if (isMob) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(source, 0, 0, MOBILE_W, MOBILE_H);
    } else {
      const { x, y, w, h } = drawRectRef.current;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(source, x, y, w, h);
    }
  }, []);

  // ─── handleResize ─────────────────────────────────────────────────────────
  const handleResize = useCallback(
    (forceInit = false) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      // On mobile browsers, ignore vertical-only resize events (address bar hiding/showing)
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
      ctxRef.current = null;

      if (container) {
        totalScrollableRef.current = Math.max(
          1,
          container.offsetHeight - height
        );
      }

      if (isMobile) {
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

        let drawW: number, drawH: number, drawX: number, drawY: number;
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

      const p = isMobileRef.current
        ? Math.max(
            0,
            Math.min(1, scrollYRef.current / totalScrollableRef.current)
          )
        : currentProgressRef.current;
      const frameLimit = isMobileRef.current
        ? MOBILE_TOTAL_FRAMES
        : TOTAL_FRAMES;
      const currentFrame = Math.max(
        1,
        Math.min(frameLimit, Math.round(p * (frameLimit - 1)) + 1)
      );
      drawFrame(currentFrame, true);
    },
    [drawFrame]
  );

  // ─── Frame preload pipeline ───────────────────────────────────────────────
  // Identical for mobile and desktop: HTMLImageElement + img.decode().
  // The browser owns the decode cache and LRU-evicts it internally — far more
  // reliable than a hand-rolled ImageBitmap window that falls behind on flings.
  // Mobile warms the first MOBILE_CRITICAL_FRAMES frames sequentially so the
  // opening scroll (Scene 1 → end of Scene 2) never stalls, then falls into
  // the shared stride queue for the rest, which keeps loading in the background.
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    const totalFrames = isMobile ? MOBILE_TOTAL_FRAMES : TOTAL_FRAMES;
    const progressDenominator = totalFrames;
    let isCancelled = false;

    const loadingSet = new Set<number>();
    // Frames that are settled (loaded OR failed). Failed frames must be
    // marked settled so getNextFrameToLoad never retries them forever.
    const settledSet = new Set<number>(loadedSetRef.current);
    let lastReportedPercent = Math.floor(
      (settledSet.size / progressDenominator) * 100
    );
    const reportProgress = () => {
      if (isCancelled) return;
      const pct = Math.floor((settledSet.size / progressDenominator) * 100);
      if (pct !== lastReportedPercent) {
        lastReportedPercent = pct;
        setPreloadProgress(
          Math.min(1, settledSet.size / progressDenominator)
        );
      }
    };
    reportProgress();

    const loadAndDecodeFrame = async (idx: number): Promise<void> => {
      if (
        isCancelled ||
        idx < 1 ||
        idx > totalFrames ||
        settledSet.has(idx) ||
        loadingSet.has(idx)
      ) {
        return;
      }
      loadingSet.add(idx);
      const url = getFrameUrl(idx, isMobile);

      // On mobile, decode off-main-thread via createImageBitmap into GPU VRAM
      if (isMobile && typeof window.createImageBitmap === "function") {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          if (isCancelled) return;
          const bitmap = await createImageBitmap(blob);
          if (isCancelled) {
            bitmap.close();
            return;
          }
          framesRef.current.set(idx, bitmap);
          loadedSetRef.current.add(idx);
          settledSet.add(idx);
          reportProgress();
          if (idx === 1) {
            handleResize(true);
            drawFrame(1, true);
          }
          loadingSet.delete(idx);
          return;
        } catch {
          // Fall through to HTMLImageElement on error
        }
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
          loadedSetRef.current.add(idx);
          settledSet.add(idx);
          reportProgress();
          if (idx === 1) {
            handleResize(true);
            drawFrame(1, true);
          }
          resolve();
        };

        const fail = () => {
          loadingSet.delete(idx);
          if (!isCancelled) {
            settledSet.add(idx);
            reportProgress();
          }
          resolve();
        };

        if (img.decode) {
          img.decode()
            .then(finalize)
            .catch(() => {
              img.onload = finalize;
              img.onerror = fail;
            });
        } else {
          img.onload = finalize;
          img.onerror = fail;
        }
      });
      loadingSet.delete(idx);
    };

    const runPreloadPipeline = async () => {
      // Warm up frame 1 immediately for instant display
      await loadAndDecodeFrame(1);
      if (isCancelled) return;

      const queuedSet = new Set<number>([1]);
      const queue: number[] = [];
      for (const stride of [4, 2, 1]) {
        for (let i = 2; i <= totalFrames; i += stride) {
          if (!queuedSet.has(i)) {
            queuedSet.add(i);
            queue.push(i);
          }
        }
      }

      let cursor = 0;

      const getNextFrameToLoad = (): number | null => {
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            window.scrollY / Math.max(1, totalScrollableRef.current)
          )
        );
        const curr = Math.max(
          1,
          Math.min(
            totalFrames,
            Math.round(scrollProgress * (totalFrames - 1)) + 1
          )
        );

        for (let offset = 0; offset <= 40; offset++) {
          const t = curr + offset;
          if (
            t >= 1 &&
            t <= totalFrames &&
            !settledSet.has(t) &&
            !loadingSet.has(t)
          ) {
            return t;
          }
        }

        while (cursor < queue.length) {
          const candidate = queue[cursor++];
          if (!settledSet.has(candidate) && !loadingSet.has(candidate)) {
            return candidate;
          }
        }
        return null;
      };

      const CONCURRENCY = 8;
      const worker = async () => {
        while (!isCancelled) {
          const nextIdx = getNextFrameToLoad();
          if (nextIdx === null) break;
          await loadAndDecodeFrame(nextIdx);
        }
      };

      await Promise.all(
        Array.from({ length: CONCURRENCY }, () => worker())
      );

      if (!isCancelled) {
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            window.scrollY / Math.max(1, totalScrollableRef.current)
          )
        );
        const exactFrame = Math.max(
          1,
          Math.min(
            totalFrames,
            Math.round(scrollProgress * (totalFrames - 1)) + 1
          )
        );
        drawFrame(exactFrame, true);

        setPreloadProgress(1);
        const MIN_OVERLAY_MS = 600;
        setTimeout(() => {
          if (!isCancelled) setPreloadFinished(true);
        }, MIN_OVERLAY_MS);
      }
    };

    runPreloadPipeline();
    return () => {
      isCancelled = true;
    };
  }, [handleResize, drawFrame, getFrameUrl]);

  // Lock body scroll while the loading overlay is visible.
  useEffect(() => {
    if (preloadFinished) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [preloadFinished]);

  // ─── Resize / orientation listener ───────────────────────────────────────
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

  // ─── Scroll listener ──────────────────────────────────────────────────────
  // Coalesced to one read per frame. Mobile reads the cached value in rAF so it
  // never forces a synchronous layout while scrolling; desktop updates the
  // spring target from the same read.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      scrollYRef.current = y;
      const totalScrollable = totalScrollableRef.current;
      if (totalScrollable > 0) {
        targetProgressRef.current = Math.max(
          0,
          Math.min(1, y / totalScrollable)
        );
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── rAF render loop (paused while the hero is off-screen) ────────────────
  // Mobile:  responsive touch-momentum smoothing (0.35 * dt) — glides seamlessly
  //          across every frame at 60/120fps with zero perceived lag.
  // Desktop: exact 40%-slower spring-damped wheel physics (100% untouched).
  useEffect(() => {
    let animId = 0;
    let running = false;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 16.667, 0.25), 2.5);
      lastTime = now;

      const isMob = isMobileRef.current;
      let frameIdx: number;

      if (isMob) {
        // Direct, stable tracking on mobile:
        // Follows the touch scroll smoothly and settles immediately when touch stops,
        // stopping runaway auto-scrolling so each scroll rests on a stable, crisp frame.
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.0001) {
          currentProgressRef.current += diff * Math.min(1, 0.65 * dt);
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }

        const p = currentProgressRef.current;
        const shouldShowHint = p < 0.04;
        if (shouldShowHint !== showScrollHintRef.current) {
          showScrollHintRef.current = shouldShowHint;
          setShowScrollHint(shouldShowHint);
        }

        frameIdx = Math.max(
          1,
          Math.min(
            MOBILE_TOTAL_FRAMES,
            Math.round(p * (MOBILE_TOTAL_FRAMES - 1)) + 1
          )
        );
      } else {
        const diff = targetProgressRef.current - currentProgressRef.current;

        if (
          Math.abs(diff) > 0.00003 ||
          Math.abs(velocityRef.current) > 0.00003
        ) {
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

        const p = currentProgressRef.current;
        const shouldShowHint = p < 0.04;
        if (shouldShowHint !== showScrollHintRef.current) {
          showScrollHintRef.current = shouldShowHint;
          setShowScrollHint(shouldShowHint);
        }

        frameIdx = Math.max(
          1,
          Math.min(TOTAL_FRAMES, Math.round(p * (TOTAL_FRAMES - 1)) + 1)
        );
      }

      currentFrameRef.current = frameIdx;
      drawFrame(frameIdx);

      // Caption matching uses smooth scroll progress (breakpoint-agnostic)
      const matchProgress = currentProgressRef.current;
      for (const scene of SCENES) {
        if (
          matchProgress >= scene.progressStart &&
          matchProgress <= scene.progressEnd
        ) {
          if (activeSceneIdRef.current !== scene.id) {
            activeSceneIdRef.current = scene.id;
            setActiveScene(scene);
          }
          break;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      animId = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animId);
    };

    // Only burn frames while the hero is actually on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        visibleRef.current = visible;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    start();
    return () => {
      stop();
      observer.disconnect();
    };
  }, [drawFrame]);

  return (
    <>
      {/* Loading overlay — holds until every hero frame is settled. */}
      <AnimatePresence>
        {!preloadFinished && (
          <motion.div
            key="hero-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#0B1510] flex flex-col items-center justify-center select-none"
          >
            {/* Brand mark */}
            <div
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-5xl font-bold text-white tracking-tight mb-1"
            >
              H<span className="text-[#D4B26A]">&amp;</span>S
            </div>
            <div className="text-[10px] font-mono font-semibold tracking-[0.45em] text-[#D4B26A] uppercase mb-10">
              Salon
            </div>

            {/* Progress bar */}
            <div className="w-56">
              <div className="flex justify-between text-[10px] font-mono tracking-[0.25em] text-[#D4B26A]/80 mb-2">
                <span>LOADING</span>
                <span className="tabular-nums">
                  {Math.round(preloadProgress * 100)}%
                </span>
              </div>
              <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
                <div
                  className="h-full bg-[#D4B26A] rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${preloadProgress * 100}%` }}
                />
              </div>
            </div>

            <p className="mt-6 text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
              Preparing your experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    <div
      ref={containerRef}
      id="hero"
      className="relative bg-white w-full h-[480vh] md:h-[1120vh]"
    >
      {/* Sticky Fullscreen Landing Viewport: WHOLE SCREEN EDGE-TO-EDGE */}
      <div className="sticky top-0 left-0 w-full h-svh md:h-[100dvh] overflow-hidden flex items-center justify-center bg-[#0B1510]">
        {/* Fullscreen Video Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover object-center block z-0 transform-gpu"
        />

        {/* Subtle directional shadow gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent md:bg-gradient-to-r md:from-black/65 md:via-black/15 md:to-transparent pointer-events-none z-10" />

        {/* ============================================================= */}
        {/* DESKTOP FLOATING SIDE CAPTIONS (MD & UP)                      */}
        {/* ============================================================= */}
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

        {/* ============================================================= */}
        {/* MOBILE FLOATING CAPTIONS (< MD) — ZERO-REMOUNT GPU LAYER      */}
        {/* ============================================================= */}
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
    </>
  );
}
