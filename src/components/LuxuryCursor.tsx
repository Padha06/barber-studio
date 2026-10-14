"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function LuxuryCursor() {
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useSpring(0, { stiffness: 450, damping: 35 });
  const mouseY = useSpring(0, { stiffness: 450, damping: 35 });

  useEffect(() => {
    // Only run on desktop devices with fine pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>("[data-cursor]");
      if (interactive) {
        setCursorText(interactive.getAttribute("data-cursor") || "VIEW");
        setIsHovered(true);
      } else {
        const clickable = target.closest("button, a, summary, [role='button']");
        if (clickable) {
          setCursorText("");
          setIsHovered(true);
        } else {
          setCursorText("");
          setIsHovered(false);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", handlePointerOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", handlePointerOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: mouseX,
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center rounded-full transition-all duration-200 ${
        cursorText
          ? "w-20 h-20 bg-[#0E4A35] text-[#D4B26A] shadow-[0_10px_30px_rgba(14,74,53,0.45)] border border-[#D4B26A]/40"
          : isHovered
          ? "w-10 h-10 bg-[#D4B26A]/30 backdrop-blur-xs border border-[#D4B26A]"
          : "w-3.5 h-3.5 bg-[#D4B26A] shadow-[0_0_12px_#D4B26A]"
      }`}
    >
      {cursorText && (
        <span className="text-[10px] font-mono tracking-[0.2em] font-bold uppercase select-none text-center px-1">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}
