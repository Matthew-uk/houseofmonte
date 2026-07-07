"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TARGET_TS } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(): TimeLeft {
  const diff = TARGET_TS - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

// External-store subscription drives a 1s tick. Using useSyncExternalStore
// keeps the server snapshot stable (all zeros) so there is no hydration
// mismatch, and avoids setState-in-effect.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

const pad = (n: number) => String(n).padStart(2, "0");

const SEGMENTS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export function CountdownTimer() {
  const reduce = useReducedMotion();

  // getSnapshot returns a stable serialized string so React can bail out of
  // renders when the second hasn't changed; server snapshot is all-zeros.
  const snapshot = useSyncExternalStore(
    subscribe,
    () => serialize(computeTimeLeft()),
    () => serialize({ days: 0, hours: 0, minutes: 0, seconds: 0 }),
  );
  const time = deserialize(snapshot);

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      {SEGMENTS.map((seg, i) => (
        <div key={seg.key} className="flex items-start">
          <motion.div
            className="flex flex-col items-center"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 1.1 + i * 0.05, duration: 0.5 }}
          >
            <span className="font-mono text-3xl font-medium tabular-nums text-gold sm:text-4xl md:text-5xl">
              {pad(time[seg.key])}
            </span>
            <span className="mt-1.5 text-tiny uppercase tracking-wider text-text-secondary">
              {seg.label}
            </span>
          </motion.div>
          {i < SEGMENTS.length - 1 && (
            <span
              aria-hidden
              className="px-1 font-mono text-2xl text-text-tertiary sm:px-2 sm:text-3xl md:text-4xl"
              style={{ lineHeight: 1.15 }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function serialize(t: TimeLeft) {
  return `${t.days}:${t.hours}:${t.minutes}:${t.seconds}`;
}
function deserialize(s: string): TimeLeft {
  const [days, hours, minutes, seconds] = s.split(":").map(Number);
  return { days, hours, minutes, seconds };
}
