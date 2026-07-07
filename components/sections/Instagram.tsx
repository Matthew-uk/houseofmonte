"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SOCIAL, CONTAINER } from "@/lib/constants";

const IMAGES = [
  "/images/instagram/instagram1.png",
//   "/images/instagram/instagram2.DNG",
  "/images/instagram/instagram3.png",
  "/images/instagram/instagram4.png",
  "/images/instagram/instagram5.JPG",
  "/images/instagram/instagram6.png",
  "/images/instagram/instagram7.PNG",
  "/images/instagram/instagram8.JPG",
  "/images/instagram/instagram9.JPG",
  "/images/instagram/instagram10.png",
  "/images/instagram/instagram11.JPG",
];

const AUTOPLAY_MS = 5000;

export function Instagram() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  // Real number of scroll positions: on desktop 3 tiles share a view, so 6
  // slides collapse to ~4 pages. Dots/arrows/autoplay all key off this.
  const [pageCount, setPageCount] = useState(IMAGES.length);
  // Once the visitor touches the carousel, autoplay stays off for good.
  const userInteracted = useRef(false);
  const [paused, setPaused] = useState(false);

  const slideStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const [a, b] = [track.children[0], track.children[1]] as [
      HTMLElement,
      HTMLElement,
    ];
    return b.offsetLeft - a.offsetLeft;
  }, []);

  const pagesFor = useCallback(
    (track: HTMLElement) => {
      const step = slideStep();
      if (step <= 0) return 1;
      return (
        Math.round((track.scrollWidth - track.clientWidth) / step) + 1
      );
    },
    [slideStep],
  );

  // Keep pageCount in sync with the responsive layout (tile widths change
  // across breakpoints, which changes how many scroll positions exist).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const pages = pagesFor(track);
      setPageCount(pages);
      setIndex((i) => Math.min(i, pages - 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, [pagesFor]);

  // Active page derives from scroll position, so swipes, arrows and dots
  // can never fall out of sync.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = slideStep();
        if (step > 0) {
          setIndex(
            Math.max(
              0,
              Math.min(
                pagesFor(track) - 1,
                Math.round(track.scrollLeft / step),
              ),
            ),
          );
        }
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [slideStep, pagesFor]);

  const scrollTo = useCallback(
    (i: number) => {
      trackRef.current?.scrollTo({
        left: i * slideStep(),
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [slideStep, reduce],
  );

  const goTo = useCallback(
    (i: number) => {
      userInteracted.current = true;
      scrollTo(i);
    },
    [scrollTo],
  );

  // Autoplay: wraps around; skipped under reduced motion; pauses on
  // hover/focus/hidden tab; stops permanently after any manual interaction.
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      if (userInteracted.current || document.hidden) return;
      const track = trackRef.current;
      if (!track) return;
      const step = slideStep();
      if (step <= 0) return;
      const current = Math.round(track.scrollLeft / step);
      scrollTo(current >= pagesFor(track) - 1 ? 0 : current + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduce, paused, slideStep, pagesFor, scrollTo]);

  const atStart = index === 0;
  const atEnd = index === pageCount - 1;

  return (
    <div className={`${CONTAINER} text-center`}>
      <Reveal>
        <h2 className="font-display text-3xl uppercase tracking-wide text-white md:text-4xl">
          From Instagram
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="From Instagram"
          className="relative mt-10 sm:mt-12"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => {
            userInteracted.current = true;
          }}
        >
          <ul
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 scrollbar-none"
          >
            {IMAGES.map((src, i) => (
              <li
                key={src}
                aria-label={`Slide ${i + 1} of ${IMAGES.length}`}
                className="w-[70vw] max-w-[420px] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)]"
              >
                <div
                  aria-hidden
                  className="aspect-square rounded-card bg-cover bg-center transition-transform duration-400 ease-out hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${src})` }}
                />
              </li>
            ))}
          </ul>

          {/* Arrows — desktop only; touch users swipe */}
          <button
            type="button"
            aria-label="Previous posts"
            disabled={atStart}
            onClick={() => goTo(index - 1)}
            className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-medium bg-black/70 p-2.5 text-text-primary backdrop-blur-sm transition-[color,border-color,opacity] duration-300 hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30 sm:flex"
          >
            <ChevronLeft size={18} strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next posts"
            disabled={atEnd}
            onClick={() => goTo(index + 1)}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-border-medium bg-black/70 p-2.5 text-text-primary backdrop-blur-sm transition-[color,border-color,opacity] duration-300 hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30 sm:flex"
          >
            <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
          </button>

          {/* Dots — one per scroll position, not per image */}
          <div className="mt-6 flex justify-center gap-2.5">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide group ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className="flex h-4 w-4 items-center justify-center"
              >
                <span
                  aria-hidden
                  className={`block h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-300 ${
                    i === index ? "scale-125 bg-gold" : "bg-white/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 flex justify-center sm:mt-12">
          <Button
            as="a"
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="gap-2.5"
          >
            <FaInstagram size={15} aria-hidden />
            Follow {SOCIAL.instagramHandle}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
