"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Warm ambient background drone (low-pass filtered noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(260, ctx.currentTime);

    const ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.3, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(masterGain);
    whiteNoise.start(0);

    audioCtxRef.current = ctx;
    gainNodeRef.current = masterGain;

    // Periodic gentle scissor snip acoustic simulation
    const scheduleSnip = () => {
      if (!ctx || ctx.state !== "running") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const snipFilter = ctx.createBiquadFilter();
      const snipGain = ctx.createGain();

      osc.type = "highpass" as unknown as OscillatorType;
      // High frequency metal snip
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      snipFilter.type = "bandpass";
      snipFilter.frequency.setValueAtTime(2800 + Math.random() * 800, now);
      snipFilter.Q.setValueAtTime(5, now);

      snipGain.gain.setValueAtTime(0.001, now);
      snipGain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      snipGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      noise.connect(snipFilter);
      snipFilter.connect(snipGain);
      snipGain.connect(masterGain);

      noise.start(now);
      noise.stop(now + 0.15);

      const nextDelay = 3500 + Math.random() * 5000;
      timerRef.current = setTimeout(scheduleSnip, nextDelay);
    };

    scheduleSnip();
  };

  const toggleSound = () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        initAudio();
      } else if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Mute Studio Ambience" : "Play Studio Ambience"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 bg-[#FAF9F7] hover:bg-black/5 text-[#4A4640] hover:text-[#0F0F0F] transition-all duration-200 text-[11px] font-semibold tracking-wider uppercase group cursor-pointer"
      aria-label="Toggle salon audio atmosphere"
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-[#9E7B3A] animate-pulse rounded-full" />
            <span className="w-0.5 h-3 bg-[#9E7B3A] animate-pulse rounded-full delay-75" />
            <span className="w-0.5 h-1.5 bg-[#9E7B3A] animate-pulse rounded-full delay-150" />
          </div>
          <Volume2 className="w-3.5 h-3.5 text-[#9E7B3A]" />
          <span className="hidden sm:inline text-[#9E7B3A] font-semibold">Ambience On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 group-hover:text-[#9E7B3A]" />
          <span className="hidden sm:inline font-medium">Ambience</span>
        </>
      )}
    </button>
  );
}
