"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TopLandingScrollytellingProps {
  onBookChair: () => void;
  onExploreServices: () => void;
}

const TOTAL_FRAMES = 290;
const MOBILE_W = 576;
const MOBILE_H = 1024;

// ── Mobile memory budget ───────────────────────────────────────────────────
// A decoded 504×896 RGBA frame is ~1.8 MB. Holding all 290 pinned (ImageBitmap)
// means ~520 MB resident → memory pressure / GC thrash / dropped frames on any
// phone. We instead keep the compressed frames (~5 MB total) and only decode a
// sliding window around the current scroll position, evicting the rest.
const MOBILE_WINDOW = 30; // decode ±N frames around current position
const MOBILE_MAX_DECODED = 78; // hard ceiling on resident decoded frames (~140 MB)
const MOBILE_EVICT_RADIUS = 34; // never evict frames within this distance
const MOBILE_BLOB_CONCURRENCY = 8;

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

  // Decoded frames ready to draw (ImageBitmap on mobile, HTMLImageElement on desktop)
  const framesRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(
    new Map()
  );
  const loadedSetRef = useRef<Set<number>>(new Set());

  // Mobile-only: compressed blobs + bounded decode window bookkeeping
  const blobCacheRef = useRef<Map<number, Blob>>(new Map());
  const blobPromiseRef = useRef<Map<number, Promise<Blob | null>>>(new Map());
  const decodingRef = useRef<Set<number>>(new Set());
  const decodedUsageRef = useRef<Map<number, number>>(new Map());
  const usageTickRef = useRef(0);

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

  // Desktop-only spring physics state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const velocityRef = useRef(0);

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

  // ─── Mobile decode helpers ────────────────────────────────────────────────
  const getBlob = useCallback(
    (idx: number): Promise<Blob | null> => {
      const cached = blobCacheRef.current.get(idx);
      if (cached) return Promise.resolve(cached);
      const pending = blobPromiseRef.current.get(idx);
      if (pending) return pending;

      const p = fetch(getFrameUrl(idx, true))
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("http"))))
        .then((blob) => {
          blobCacheRef.current.set(idx, blob);
          return blob;
        })
        .catch(() => null)
        .finally(() => {
          blobPromiseRef.current.delete(idx);
        });

      blobPromiseRef.current.set(idx, p);
      return p;
    },
    [getFrameUrl]
  );

  const touchFrame = useCallback((idx: number) => {
    decodedUsageRef.current.set(idx, ++usageTickRef.current);
  }, []);

  const evictIfNeeded = useCallback((center: number) => {
    const frames = framesRef.current;
    if (frames.size <= MOBILE_MAX_DECODED) return;

    const evictable: number[] = [];
    for (const idx of frames.keys()) {
      if (Math.abs(idx - center) > MOBILE_EVICT_RADIUS) evictable.push(idx);
    }
    evictable.sort(
      (a, b) =>
        (decodedUsageRef.current.get(a) ?? 0) -
        (decodedUsageRef.current.get(b) ?? 0)
    );

    let need = frames.size - MOBILE_MAX_DECODED;
    for (const idx of evictable) {
      if (need <= 0) break;
      const value = frames.get(idx);
      if (value instanceof ImageBitmap) value.close();
      frames.delete(idx);
      loadedSetRef.current.delete(idx);
      decodedUsageRef.current.delete(idx);
      need--;
    }
  }, []);

  const decodeFrame = useCallback(
    (idx: number): Promise<void> => {
      if (idx < 1 || idx > TOTAL_FRAMES) return Promise.resolve();
      if (framesRef.current.has(idx) || decodingRef.current.has(idx)) {
        touchFrame(idx);
        return Promise.resolve();
      }
      decodingRef.current.add(idx);

      const store = (value: ImageBitmap | HTMLImageElement) => {
        if (framesRef.current.has(idx)) {
          if (value instanceof ImageBitmap) value.close();
          return;
        }
        framesRef.current.set(idx, value);
        loadedSetRef.current.add(idx);
        touchFrame(idx);
        evictIfNeeded(currentFrameRef.current);
      };

      return getBlob(idx)
        .then((blob) => {
          if (!blob) return;
          if (typeof createImageBitmap === "function") {
            return createImageBitmap(blob).then(store);
          }
          // Fallback for engines without createImageBitmap
          return new Promise<void>((resolve) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
              URL.revokeObjectURL(url);
              store(img);
              resolve();
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            img.src = url;
          });
        })
        .catch(() => {})
        .finally(() => {
          decodingRef.current.delete(idx);
        }) as Promise<void>;
    },
    [getBlob, touchFrame, evictIfNeeded]
  );

  // ─── drawFrame ────────────────────────────────────────────────────────────
  // Mobile:  1:1 unscaled GPU blit onto fixed 504×896 buffer (<0.02ms).
  //          CSS object-cover on the canvas scales it on the HW compositor.
  // Desktop: exact cover-scaled draw into the DPR-aware canvas buffer.
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    const isMob = isMobileRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If the exact frame isn't decoded yet, fall back to the closest resident
    // frame so the canvas never goes blank while the window top-up catches up.
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
        desynchronized: true,
      });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const source = framesRef.current.get(targetIdx);
    if (!source) return;

    lastDrawnFrameRef.current = targetIdx;

    if (isMob) {
      ctx.imageSmoothingEnabled = false;
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
      const currentFrame = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(p * (TOTAL_FRAMES - 1)) + 1)
      );
      drawFrame(currentFrame, true);
    },
    [drawFrame]
  );

  // ─── Frame preload pipeline ───────────────────────────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    let isCancelled = false;

    if (isMobile) {
      // Mobile: decode the very first frame for instant paint, then stream the
      // compressed frames into the blob cache in the background. Decoding is
      // driven by the bounded window manager (see below).
      decodeFrame(1).then(() => {
        if (isCancelled) return;
        handleResize(true);
        drawFrame(1, true);
      });

      const prefetchBlobs = async () => {
        let cursor = 1;
        const worker = async () => {
          while (!isCancelled) {
            const idx = cursor++;
            if (idx > TOTAL_FRAMES) break;
            await getBlob(idx);
          }
        };
        await Promise.all(
          Array.from({ length: MOBILE_BLOB_CONCURRENCY }, () => worker())
        );
      };
      void prefetchBlobs();

      return () => {
        isCancelled = true;
      };
    }

    // ── Desktop strategy (unchanged): stride 4 → 2 → 1 as HTMLImageElement ──
    const loadingSet = new Set<number>();

    const loadAndDecodeFrame = async (idx: number): Promise<void> => {
      if (
        isCancelled ||
        idx < 1 ||
        idx > TOTAL_FRAMES ||
        loadedSetRef.current.has(idx) ||
        loadingSet.has(idx)
      ) {
        return;
      }
      loadingSet.add(idx);
      const url = getFrameUrl(idx, false);

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
          if (idx === 1) {
            handleResize(true);
            drawFrame(1, true);
          }
          resolve();
        };

        if (img.decode) {
          img.decode()
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
      await loadAndDecodeFrame(1);

      const queuedSet = new Set<number>([1]);
      const queue: number[] = [];
      for (const stride of [4, 2, 1]) {
        for (let i = 2; i <= TOTAL_FRAMES; i += stride) {
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
            TOTAL_FRAMES,
            Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1
          )
        );

        for (let offset = 0; offset <= 40; offset++) {
          const t = curr + offset;
          if (
            t >= 1 &&
            t <= TOTAL_FRAMES &&
            !loadedSetRef.current.has(t) &&
            !loadingSet.has(t)
          ) {
            return t;
          }
        }

        while (cursor < queue.length) {
          const candidate = queue[cursor++];
          if (
            !loadedSetRef.current.has(candidate) &&
            !loadingSet.has(candidate)
          ) {
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
            TOTAL_FRAMES,
            Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1
          )
        );
        drawFrame(exactFrame, true);
      }
    };

    runPreloadPipeline();
    return () => {
      isCancelled = true;
    };
  }, [decodeFrame, getBlob, handleResize, drawFrame, getFrameUrl]);

  // ─── Mobile sliding-window decoder ────────────────────────────────────────
  // Keeps a bounded, sharp window around the current frame and evicts the rest.
  // Decoding is prioritised along the scroll direction so a fast fling never
  // outruns the window, and the batch grows when we fall behind.
  useEffect(() => {
    const MAX_INFLIGHT = 8;

    const topUp = () => {
      if (!isMobileRef.current || !visibleRef.current) return;
      const center = currentFrameRef.current;
      const dir = scrollDirRef.current >= 0 ? 1 : -1;
      const lo = Math.max(1, center - MOBILE_WINDOW);
      const hi = Math.min(TOTAL_FRAMES, center + MOBILE_WINDOW);

      // Nearest-first, biased in the direction of travel.
      const order: number[] = [];
      for (let d = 0; d <= MOBILE_WINDOW; d++) {
        const ahead = center + d * dir;
        const behind = center - d * dir;
        if (ahead >= lo && ahead <= hi) order.push(ahead);
        if (d !== 0 && behind >= lo && behind <= hi) order.push(behind);
      }

      let missingAhead = 0;
      for (const idx of order) {
        if (!framesRef.current.has(idx)) {
          missingAhead++;
          if (missingAhead >= 24) break;
        }
      }
      const batchSize = missingAhead >= 20 ? 10 : missingAhead >= 8 ? 6 : 3;

      let inflight = decodingRef.current.size;
      let dispatched = 0;
      for (const idx of order) {
        if (dispatched >= batchSize || inflight >= MAX_INFLIGHT) break;
        if (framesRef.current.has(idx)) continue;
        if (decodingRef.current.has(idx)) continue;
        void decodeFrame(idx);
        inflight++;
        dispatched++;
      }

      evictIfNeeded(center);
    };

    const timer = setInterval(topUp, 60);
    topUp();
    return () => clearInterval(timer);
  }, [decodeFrame, evictIfNeeded]);

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
      if (!isMobileRef.current) {
        const totalScrollable = totalScrollableRef.current;
        if (totalScrollable > 0) {
          targetProgressRef.current = Math.max(
            0,
            Math.min(1, y / totalScrollable)
          );
        }
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
  // Mobile:  reads the cached scroll position each frame — ZERO layout reads
  //          and zero interpolation lag. The phone OS handles inertia.
  // Desktop: exact 40%-slower spring-damped wheel physics (unchanged).
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
        const y = scrollYRef.current;
        const dy = y - lastScrollYRef.current;
        lastScrollYRef.current = y;
        if (dy > 1) scrollDirRef.current = 1;
        else if (dy < -1) scrollDirRef.current = -1;

        const totalScrollable = totalScrollableRef.current;
        const rawProgress =
          totalScrollable > 0
            ? Math.max(0, Math.min(1, y / totalScrollable))
            : 0;
        frameIdx = Math.max(
          1,
          Math.min(
            TOTAL_FRAMES,
            Math.round(rawProgress * (TOTAL_FRAMES - 1)) + 1
          )
        );

        const shouldShowHint = rawProgress < 0.04;
        if (shouldShowHint !== showScrollHintRef.current) {
          showScrollHintRef.current = shouldShowHint;
          setShowScrollHint(shouldShowHint);
        }
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
    <div
      ref={containerRef}
      id="hero"
      className="relative bg-white w-full h-[560vh] md:h-[1120vh]"
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
  );
}
