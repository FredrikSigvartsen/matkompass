"use client";

import { useEffect } from "react";

const todayId = "middag-i-dag";

export function ScrollToToday() {
  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    const today = document.getElementById(todayId);

    if (!today) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      today.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return null;
}
