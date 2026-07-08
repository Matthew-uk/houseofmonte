import { useState, useEffect, useRef } from "react";

export function useAnimatedCounter(target: number, durationMs = 800): number {
  const [value, setValue] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const diff = target - from;
    if (diff === 0) return;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + diff * eased);
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        prev.current = target;
      }
    }

    requestAnimationFrame(tick);
  }, [target, durationMs]);

  return value;
}
