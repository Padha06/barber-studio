"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Compass, ArrowRight, ShieldCheck, Sparkles, Layers } from "lucide-react";

interface CinematicExperienceProps {
  onBookAppointment: () => void;
  onExploreGrooming: () => void;
  onDiscoverServices: () => void;
}

const TOTAL_FRAMES = 300;

interface StageInfo {
  id: number;
  title: string;
  subtitle: string;
  copy: string;
  start: number;
  end: number;
  tag: string;
}

const STAGES: StageInfo[] = [
  {
    id: 1,
    tag: "STAGE 01 — THE ARRIVAL",
    title: "YOUR TIME. YOUR SPACE.",
    subtitle: "A considered space. A personal experience. A better standard of grooming.",
    copy: "Step into our Mayfair atelier. Dark walnut, hand-stitched leather, warm amber pendant lighting, and an atmosphere designed to let you disconnect.",
    start: 0.0,
    end: 0.2,
  },
  {
    id: 2,
    tag: "STAGE 02 — THE RITUAL",
    title: "PRECISION IN EVERY DETAIL.",
    subtitle: "Every line, every blend, every finish—shaped by skill and attention.",
    copy: "Our master barbers sculpt with surgical exactness. From crisp zero-gap skin fades to tailored scissor work that contours your facial architecture.",
    start: 0.2,
    end: 0.46,
  },
  {
    id: 3,
    tag: "STAGE 03 — MASTER INSTRUMENTS",
    title: "TOOLS OF THE TRADE.",
    subtitle: "Professional precision. Reliable performance. A flawless finish.",
    copy: "Handcrafted Japanese steel shears, rotary motor clippers with micro-guard gradations, and sterilized straight razors tuned for uncompromised sharpness.",
    start: 0.46,
    end: 0.68,
  },
  {
    id: 4,
    tag: "STAGE 04 — APOTHECARY",
    title: "THE FINISHING TOUCH.",
    subtitle: "From the first wash to the final detail, discover the essentials behind a well-groomed look.",
    copy: "Botanical pomades, organic argan beard balms, and sandalwood astringents formulated to nourish, protect, and leave an unforgettable signature aroma.",
    start: 0.68,
    end: 0.88,
  },
  {
    id: 5,
    tag: "STAGE 05 — THE SIGNATURE",
    title: "LOOK SHARP. FEEL DIFFERENT.",
    subtitle: "Your style, refined by professionals who care about every detail.",
    copy: "A timeless silhouette, immaculate lines, and the confidence that comes from master artisans who refuse to cut corners.",
    start: 0.88,
    end: 1.0,
  },
];

export default function CinematicExperience({
  onBookAppointment,
  onExploreGrooming,
  onDiscoverServices,
}: CinematicExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for animation loop
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to format frame path
  const getFrameUrl = (frameIndex: number) => {
    const padded = String(frameIndex).padStart(3, "0");
    return `/sequence/ezgif-frame-${padded}.jpg`;
  };

  // Render a specific image onto the canvas maintaining cover aspect ratio
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Find requested frame or fallback to closest loaded frame
    let img = imagesRef.current.get(frameIdx);
    if (!img || !img.complete) {
      // Find nearest loaded frame
      let closestFrame = 1;
      let minDiff = 999;
      imagesRef.current.forEach((cachedImg, idx) => {
        if (cachedImg.complete) {
          const diff = Math.abs(idx - frameIdx);
          if (diff < minDiff) {
            minDiff = diff;
            closestFrame = idx;
          }
        }
      });
      img = imagesRef.current.get(closestFrame);
    }

    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const canvasAspect = cw / ch;
    const imgAspect = iw / ih;

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

    // Subtle dark ambient vignette on canvas to blend into dark site background
    const gradient = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      Math.min(cw, ch) * 0.35,
      cw / 2,
      ch / 2,
      Math.max(cw, ch) * 0.75
    );
    gradient.addColorStop(0, "rgba(8,8,8,0)");
    gradient.addColorStop(0.7, "rgba(8,8,8,0.25)");
    gradient.addColorStop(1, "rgba(8,8,8,0.85)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cw, ch);
  }, []);

  // Resize canvas according to container and device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    // Redraw current frame immediately
    drawFrame(currentFrame);
  }, [currentFrame, drawFrame]);

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    // Load first frame immediately for instant visual
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current.set(1, firstImg);
      loaded++;
      setLoadedCount(loaded);
      handleResize();
      drawFrame(1);
    };

    // Load remaining frames in priority batches
    const loadQueue = async () => {
      // Priority 1: Every 5th frame for quick full-scrub coverage
      for (let i = 2; i <= TOTAL_FRAMES; i += 5) {
        if (isCancelled) return;
        if (!imagesRef.current.has(i)) {
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            if (isCancelled) return;
            imagesRef.current.set(i, img);
            loaded++;
            setLoadedCount(loaded);
          };
        }
      }

      // Priority 2: All remaining frames sequentially
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (isCancelled) return;
        if (!imagesRef.current.has(i)) {
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            if (isCancelled) return;
            imagesRef.current.set(i, img);
            loaded++;
            setLoadedCount(loaded);
          };
          // Small yield to keep main thread completely unblocked
          if (i % 15 === 0) {
            await new Promise((r) => setTimeout(r, 20));
          }
        }
      }
    };

    loadQueue();

    return () => {
      isCancelled = true;
    };
  }, [handleResize, drawFrame]);

  // Handle window resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Scroll listener to update target progress
  useEffect(() => {
    const handleScroll = () => {
      if (isPlayingAuto) return;
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
  }, [isPlayingAuto]);

  // Smooth lerp animation loop for canvas rendering and active stage detection
  useEffect(() => {
    let animId: number;

    const loop = () => {
      // Lerp progress smoothly towards target
      const lerpSpeed = 0.12;
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpSpeed;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setScrollProgress(p);

      // Map progress to frame index [1 .. TOTAL_FRAMES]
      const frameIdx = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.floor(p * (TOTAL_FRAMES - 1)) + 1)
      );

      setCurrentFrame(frameIdx);
      drawFrame(frameIdx);

      // Identify active stage
      let stageIdx = 0;
      for (let i = 0; i < STAGES.length; i++) {
        if (p >= STAGES[i].start && p <= STAGES[i].end) {
          stageIdx = i;
          break;
        }
      }
      setActiveStageIndex(stageIdx);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    rafIdRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [drawFrame]);

  // Auto-play feature
  const toggleAutoPlay = () => {
    if (!isPlayingAuto) {
      setIsPlayingAuto(true);
      const container = containerRef.current;
      if (!container) return;

      const startTime = Date.now();
      const currentP = targetProgressRef.current;
      const duration = 16000 * (1 - currentP); // 16 seconds full reel

      autoPlayIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, currentP + elapsed / duration);
        targetProgressRef.current = progress;

        // Smoothly scroll window along with auto play
        const totalScrollable = container.offsetHeight - window.innerHeight;
        const containerTop = container.offsetTop;
        window.scrollTo({
          top: containerTop + progress * totalScrollable,
          behavior: "auto",
        });

        if (progress >= 1) {
          setIsPlayingAuto(false);
          if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
          }
        }
      }, 30);
    } else {
      setIsPlayingAuto(false);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    }
  };

  // Jump to specific stage
  const jumpToStage = (stageIdx: number) => {
    const container = containerRef.current;
    if (!container) return;

    const targetP = STAGES[stageIdx].start + 0.05;
    targetProgressRef.current = targetP;

    const totalScrollable = container.offsetHeight - window.innerHeight;
    const containerTop = container.offsetTop;
    window.scrollTo({
      top: containerTop + targetP * totalScrollable,
      behavior: "smooth",
    });
  };

  const activeStage = STAGES[activeStageIndex];
  const percentBuffered = Math.min(
    100,
    Math.round((loadedCount / TOTAL_FRAMES) * 100)
  );

  return (
    <div
      ref={containerRef}
      id="cinematic-story"
      className="relative bg-[#080808] w-full"
      style={{ height: "550vh" }} // Pinned scroll depth
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Fullscreen Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Overlays to ensure text legibility and cinematic atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/70 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/85 via-black/30 to-[#080808]/85 pointer-events-none z-10" />

        {/* Preload Status Bar (Displays discreetly while initial frames load) */}
        {percentBuffered < 100 && (
          <div className="absolute top-20 right-6 z-30 bg-[#111111]/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C6A56B] animate-ping" />
            <span className="text-[10px] tracking-wider uppercase text-[#A6A19A]">
              Buffering Master Sequence {percentBuffered}%
            </span>
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C6A56B] transition-all duration-300"
                style={{ width: `${percentBuffered}%` }}
              />
            </div>
          </div>
        )}

        {/* Top Control Bar: Active Stage Badge & Auto-Play / Interactive Mode */}
        <div className="absolute top-20 left-6 sm:left-12 z-30 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111]/80 border border-[#C6A56B]/30 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#C6A56B]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A56B] font-semibold">
              {activeStage.tag}
            </span>
          </div>

          <button
            onClick={toggleAutoPlay}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs tracking-wider uppercase backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isPlayingAuto
                ? "bg-[#C6A56B] text-[#080808] border-[#C6A56B] shadow-[0_0_15px_rgba(198,165,107,0.4)]"
                : "bg-[#111111]/80 text-[#A6A19A] border-white/10 hover:border-[#C6A56B]/40 hover:text-[#F5F1EB]"
            }`}
          >
            {isPlayingAuto ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Pause Reel</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Auto Cinema</span>
              </>
            )}
          </button>
        </div>

        {/* Center Storytelling Narrative Overlay */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Tagline */}
          <div className="inline-block mb-3 overflow-hidden">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[#C6A56B] transition-all duration-500">
              {activeStage.tag}
            </span>
          </div>

          {/* Main Stage Headline */}
          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.06em] text-[#F5F1EB] uppercase leading-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] transition-all duration-500"
          >
            {activeStage.title}
          </h2>

          {/* Stage Subtitle */}
          <p
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-base sm:text-xl md:text-2xl text-[#DFC79B] italic font-normal tracking-wide mb-4 max-w-2xl drop-shadow-md transition-all duration-500"
          >
            “{activeStage.subtitle}”
          </p>

          {/* Detailed Narrative Copy */}
          <p className="text-xs sm:text-sm md:text-base text-[#A6A19A] max-w-xl leading-relaxed tracking-wide mb-8 drop-shadow-lg hidden sm:block">
            {activeStage.copy}
          </p>

          {/* Stage Specific Action CTAs */}
          <div className="flex items-center gap-4 pt-2">
            {activeStage.id === 4 && (
              <button
                onClick={onExploreGrooming}
                className="px-6 py-3 bg-[#C6A56B] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#DFC79B] transition-all duration-300 shadow-xl cursor-pointer flex items-center gap-2"
              >
                <span>Explore Grooming</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeStage.id === 5 && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onBookAppointment}
                  className="px-8 py-3.5 bg-[#C6A56B] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#DFC79B] transition-all duration-300 shadow-[0_0_25px_rgba(198,165,107,0.35)] cursor-pointer"
                >
                  Book Your Appointment
                </button>
                <button
                  onClick={onDiscoverServices}
                  className="px-6 py-3.5 bg-black/60 border border-[#C6A56B]/50 text-[#F5F1EB] font-medium text-xs tracking-[0.2em] uppercase hover:border-[#C6A56B] hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  Discover Our Services
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Stage Timeline Navigator */}
        <div className="absolute bottom-6 left-6 right-6 z-30 max-w-4xl mx-auto flex flex-col gap-2">
          {/* Progress Scrub Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group">
            <div
              className="h-full bg-gradient-to-r from-[#C6A56B] to-[#DFC79B] transition-all duration-75 relative"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#DFC79B] rounded-full shadow-[0_0_10px_#DFC79B]" />
            </div>
          </div>

          {/* Stage Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {STAGES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => jumpToStage(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded text-[9px] sm:text-[10px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    activeStageIndex === idx
                      ? "bg-[#C6A56B] text-[#080808] font-bold shadow-md"
                      : "bg-[#111111]/70 text-[#A6A19A] hover:text-[#F5F1EB] hover:bg-white/10"
                  }`}
                >
                  <span className="hidden md:inline">{s.title.split(".")[0]}</span>
                  <span className="md:hidden">0{s.id}</span>
                </button>
              ))}
            </div>

            {/* Frame metadata indicator */}
            <div className="flex items-center gap-3 text-[10px] text-[#A6A19A] font-mono tracking-wider">
              <span className="hidden sm:inline">FRAME</span>
              <span className="text-[#C6A56B] font-bold">
                {String(currentFrame).padStart(3, "0")}
              </span>
              <span>/</span>
              <span>{TOTAL_FRAMES}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
