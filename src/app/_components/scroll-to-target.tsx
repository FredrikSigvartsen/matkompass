"use client";

import { useEffect } from "react";

interface ScrollToTargetProps {
  block?: ScrollLogicalPosition;
  targetId: string;
}

export function ScrollToTarget({ block = "center", targetId }: ScrollToTargetProps) {
  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block,
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [block, targetId]);

  return null;
}
