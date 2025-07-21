"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface LottieButtonProps {
  onClick: () => void;
  path: string;
  width?: string;
  height?: string;
}

export default function LottieButton({
  onClick,
  path,
  width = "40px",
  height = "40px",
}: LottieButtonProps) {
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lottieRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [path]);

  return (
    <div
      ref={lottieRef}
      onClick={onClick}
      style={{ width, height, cursor: "pointer" }}
      className="relative group animate-quantumPulse"
      aria-label="Return to Previous Universe"
    >
      <span className="absolute inset-0 bg-lumen-cyan/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
      <span className="absolute inset-0 border border-lumen-cyan/40 rounded-full animate-quantumPulseBorder" />
    </div>
  );
}