"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TopLandingScrollytellingProps {
  onBookChair: () => void;
  onExploreServices: () => void;
}

const TOTAL_FRAMES = 290;

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE: 7 pre-rendered scene images (one per scene, already in public/).
// Total: ~127 KB — loads in under a second on any connection.
// CSS opacity transitions run 100% on GPU compositor — ZERO JavaScript cost
// during touch scrolling.
// ─────────────────────────────────────────────────────────────────────────────
const MOBILE_SCENE_SRCS = [
  "/frames-mobile/frame-015.webp", // Scene 1 – Exterior   (frames  1-30)
  "/frames-mobile/frame-045.webp", // Scene 2 – Interior   (frames 31-60)
  "/frames-mobile/frame-075.webp", // Scene 3 – Stations   (frames 61-90)
  "/frames-mobile/frame-118.webp", // Scene 4 – Haircut    (frames 91-145)
  "/frames-mobile/frame-175.webp", // Scene 5 – Wash       (frames 146-205)
  "/frames-mobile/frame-220.webp", // Scene 6 – Products   (frames 206-235)
  "/frames-mobile/frame-263.webp", // Scene 7 – Finished   (frames 236-290)
];

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

  // ── Desktop canvas (unused on mobile) ──────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ── Mobile: direct refs to 7 <img> elements ─────────────────────────────
  // We manipulate img.style.opacity directly — never triggers React re-render.
  const mobileImgRefs = useRef<(HTMLImageElement | null)[]>(
    Array(7).fill(null)
  );
  const activeMobileSceneRef = useRef<number>(-1); // -1 = nothing shown yet

  // ── Shared state (captions & scroll hint) ───────────────────────────────
  const [activeScene, setActiveScene] = useState<CaptionScene>(SCENES[0]);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // ── Desktop frame store ──────────────────────────────────────────────────
  const framesRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(
    new Map()
  );
  const loadedSetRef = useRef<Set<number>>(new Set());

  // ── Shared refs ──────────────────────────────────────────────────────────
  const lastDrawnFrameRef = useRef<number>(-1);
  const activeSceneIdRef = useRef<number>(1);
  const showScrollHintRef = useRef<boolean>(true);
  const isMobileRef = useRef<boolean>(false);
  const lastWidthRef = useRef<number>(0);
  const totalScrollableRef = useRef<number>(5000);

  // ── Desktop spring physics ───────────────────────────────────────────────
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const drawRectRef = useRef<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 1920,
    h: 1080,
  });

  // ────────────────────────────────────────────────────────────────────────
  // drawFrame — desktop only
  // ────────────────────────────────────────────────────────────────────────
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    let targetIdx = frameIdx;
    if (!loadedSetRef.current.has(frameIdx)) {
      let best = -1;
      let bestDist = Infinity;
      for (const idx of loadedSetRef.current) {
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

    const source = framesRef.current.get(targetIdx);
    if (!source) return;

    lastDrawnFrameRef.current = targetIdx;
    const { x, y, w, h } = drawRectRef.current;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    ctx.drawImage(source, x, y, w, h);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // handleResize — recalculates totalScrollable for BOTH mobile & desktop.
  //                Only sets up canvas on desktop.
  // ────────────────────────────────────────────────────────────────────────
  const handleResize = useCallback(
    (forceInit = false) => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      // Ignore address-bar hide/show on mobile (vertical-only resize)
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

      // Always update scroll height (needed on BOTH mobile and desktop)
      if (container) {
        totalScrollableRef.current = Math.max(
          1,
          container.offsetHeight - height
        );
      }

      if (!isMobile && canvas) {
        const rawDpr = Math.min(window.devicePixelRatio || 1, 2);
        const maxScaleW = 1920 / Math.max(width, 1);
        const maxScaleH = 1080 / Math.max(height, 1);
        const effectiveDpr = Math.min(
          rawDpr,
          Math.max(maxScaleW, maxScaleH, 1)
        );

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

        const p = currentProgressRef.current;
        const currentFrame = Math.max(
          1,
          Math.min(TOTAL_FRAMES, Math.round(p * (TOTAL_FRAMES - 1)) + 1)
        );
        drawFrame(currentFrame, true);
      }
    },
    [drawFrame]
  );

  // ────────────────────────────────────────────────────────────────────────
  // Preload pipeline — desktop only.
  // On mobile we skip canvas entirely; the 7 <img> tags handle themselves.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    // Always run resize to populate totalScrollableRef
    handleResize(true);

    if (isMobile) return; // mobile images are self-loading <img> elements

    let isCancelled = false;
    const loadingSet = new Set<number>();

    const loadFrame = (idx: number): Promise<void> =>
      new Promise((resolve) => {
        if (
          isCancelled ||
          idx < 1 ||
          idx > TOTAL_FRAMES ||
          loadedSetRef.current.has(idx) ||
          loadingSet.has(idx)
        ) {
          resolve();
          return;
        }
        loadingSet.add(idx);
        const img = new Image();
        img.decoding = "async";
        img.src = `/frames/frame-${String(idx).padStart(3, "0")}.webp`;

        const done = () => {
          loadingSet.delete(idx);
          if (isCancelled) { resolve(); return; }
          framesRef.current.set(idx, img);
          loadedSetRef.current.add(idx);
          if (idx === 1) { handleResize(true); drawFrame(1, true); }
          resolve();
        };

        if (img.decode) {
          img.decode().then(done).catch(() => {
            img.onload = done;
            img.onerror = () => resolve();
          });
        } else {
          img.onload = done;
          img.onerror = () => resolve();
        }
      });

    const run = async () => {
      await loadFrame(1);

      const queued = new Set<number>([1]);
      const queue: number[] = [];
      for (const stride of [4, 2, 1]) {
        for (let i = 2; i <= TOTAL_FRAMES; i += stride) {
          if (!queued.has(i)) { queued.add(i); queue.push(i); }
        }
      }

      let cursor = 0;
      const next = (): number | null => {
        const curr = Math.max(
          1,
          Math.min(
            TOTAL_FRAMES,
            Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)) + 1
          )
        );
        for (let o = 0; o <= 40; o++) {
          const t = curr + o;
          if (
            t >= 1 &&
            t <= TOTAL_FRAMES &&
            !loadedSetRef.current.has(t) &&
            !loadingSet.has(t)
          )
            return t;
        }
        while (cursor < queue.length) {
          const c = queue[cursor++];
          if (!loadedSetRef.current.has(c) && !loadingSet.has(c)) return c;
        }
        return null;
      };

      const worker = async () => {
        while (!isCancelled) {
          const idx = next();
          if (idx === null) break;
          await loadFrame(idx);
        }
      };

      await Promise.all(Array.from({ length: 8 }, () => worker()));
    };

    run();
    return () => { isCancelled = true; };
  }, [handleResize, drawFrame]);

  // ── Resize / orientation listener ─────────────────────────────────────
  useEffect(() => {
    const onResize = () => handleResize(false);
    const onOrient = () => handleResize(true);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrient);
    handleResize(true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrient);
    };
  }, [handleResize]);

  // ── Desktop scroll target ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (isMobileRef.current) return;
      const t = totalScrollableRef.current;
      if (t > 0)
        targetProgressRef.current = Math.max(
          0,
          Math.min(1, window.scrollY / t)
        );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // rAF render loop
  //
  // MOBILE PATH:
  //   • Reads window.scrollY every frame — zero interpolation.
  //   • Maps scroll progress → scene index (0-6).
  //   • Sets img.style.opacity directly (no React re-render during scroll).
  //   • CSS "transition: opacity 0.55s ease" on each <img> handles the
  //     smooth crossfade — runs on GPU compositor, 0 ms JS cost.
  //   • Only setActiveScene() (caption text) fires on scene change.
  //
  // DESKTOP PATH:
  //   • Exact 40%-slower spring-damped wheel physics. UNCHANGED.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 16.667, 0.25), 2.5);
      lastTime = now;

      const isMob = isMobileRef.current;

      if (isMob) {
        // ── MOBILE ────────────────────────────────────────────────────────
        const total = totalScrollableRef.current;
        const p =
          total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;

        // 7 equal zones — each 1/7 of scroll range = one natural swipe
        const idx = Math.min(6, Math.floor(p * 7));

        if (idx !== activeMobileSceneRef.current) {
          // Direct DOM mutation — bypasses React reconciler completely
          const imgs = mobileImgRefs.current;
          for (let i = 0; i < 7; i++) {
            const img = imgs[i];
            if (img) img.style.opacity = i === idx ? "1" : "0";
          }
          activeMobileSceneRef.current = idx;

          // Only state update: caption text (very cheap)
          if (activeSceneIdRef.current !== SCENES[idx].id) {
            activeSceneIdRef.current = SCENES[idx].id;
            setActiveScene(SCENES[idx]);
          }
        }

        const shouldShowHint = p < 0.04;
        if (shouldShowHint !== showScrollHintRef.current) {
          showScrollHintRef.current = shouldShowHint;
          setShowScrollHint(shouldShowHint);
        }
      } else {
        // ── DESKTOP: exact 40%-slower spring physics (unchanged) ──────────
        const diff = targetProgressRef.current - currentProgressRef.current;

        if (
          Math.abs(diff) > 0.00003 ||
          Math.abs(velocityRef.current) > 0.00003
        ) {
          const desiredVel = diff * 0.044;
          velocityRef.current +=
            (desiredVel - velocityRef.current) * Math.min(1, 0.24 * dt);
          const clamped = Math.max(
            -0.0038,
            Math.min(0.0038, velocityRef.current)
          );
          currentProgressRef.current = Math.max(
            0,
            Math.min(1, currentProgressRef.current + clamped * dt)
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
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [drawFrame]);

  // ──────────────────────────────────────────────────────────────────────────
  // JSX
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      id="hero"
      // Mobile: 700svh = 100svh × 7 scenes → one full natural swipe = one scene
      // Desktop: 1120vh unchanged
      className="relative bg-white w-full h-[700svh] md:h-[1120vh]"
    >
      {/* Sticky fullscreen viewport — WHOLE SCREEN EDGE-TO-EDGE */}
      <div className="sticky top-0 left-0 w-full h-svh md:h-[100dvh] overflow-hidden flex items-center justify-center bg-[#0B1510]">

        {/* ── Desktop canvas (hidden on mobile) ─────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center z-0 will-change-transform transform-gpu"
        />

        {/* ── Mobile: 7 full-screen scene images, CSS crossfade ─────────── */}
        {/*   All 7 stacked absolutely. Active one has opacity:1, rest 0.    */}
        {/*   The CSS transition runs on the GPU compositor — 0 JS cost.     */}
        <div className="md:hidden absolute inset-0 z-0" aria-hidden="true">
          {MOBILE_SCENE_SRCS.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              ref={(el) => {
                mobileImgRefs.current[i] = el;
              }}
              src={src}
              alt=""
              // All 7 are tiny (~18 KB) — load eagerly so they're ready before scroll
              loading="eager"
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                // Only first scene visible initially
                opacity: i === 0 ? 1 : 0,
                // Smooth crossfade — GPU-composited, zero JS paint cost
                transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "opacity",
              }}
            />
          ))}
        </div>

        {/* Subtle directional shadow for text contrast */}
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

            {/* Main Caption */}
            <h1
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
            >
              {activeScene.title}
            </h1>

            {/* Supporting Line */}
            <p
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-xl md:text-2xl text-[#EAD39C] italic font-normal mb-5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            >
              {activeScene.subtitle}
            </p>

            {/* Services strip */}
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

            {/* CTAs on Scene 7 */}
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
        {/* MOBILE CAPTIONS (< MD) — text only, zero remount              */}
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

            {/* Services pill */}
            <div
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
              className="flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-white/85 mb-4"
            >
              <Sparkles className="w-3 h-3 text-[#D4B26A]" />
              <span>Hair • Skin • Makeup • Nails</span>
            </div>

            {/* CTAs on Scene 7 / scroll hint on others */}
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

        {/* Desktop Scroll Indicator */}
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
