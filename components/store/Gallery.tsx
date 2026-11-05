"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  blurDataUrl?: string;
}

// From md the whole 4:5 image fits under the sticky header, so the controls
// never fall below the fold.
const SLIDE_WIDTH = "w-full md:w-[min(60vw,calc((100dvh-104px)*0.8))]";

const ARROW =
  "flex size-11 items-center justify-center transition-opacity duration-150 hover:opacity-70";

// DESIGN.md §5 Gallery: one image at a time on native scroll-snap, no JS
// library. Swipe or thumbnails on mobile; arrows, thumbnails and arrow keys from md.
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const slidesRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  // Keep the active thumbnail in view without moving the page.
  useEffect(() => {
    const rail = thumbsRef.current;
    const thumb = rail?.children[current] as HTMLElement | undefined;
    if (!rail || !thumb) return;
    rail.scrollTo({
      left: thumb.offsetLeft - (rail.clientWidth - thumb.offsetWidth) / 2,
      top: thumb.offsetTop - (rail.clientHeight - thumb.offsetHeight) / 2,
    });
  }, [current]);

  if (count === 0) return <div className={`aspect-[4/5] bg-surface ${SLIDE_WIDTH}`} />;

  // The eased slide comes from scroll-smooth, which the reduced-motion rule in
  // globals.css turns off.
  function goTo(index: number) {
    const el = slidesRef.current;
    if (el) el.scrollTo({ left: ((index + count) % count) * el.clientWidth });
  }

  return (
    <div className="flex flex-col gap-0.5 md:sticky md:top-[88px] md:flex-row md:self-start md:pl-4 md:pt-2 xl:pl-6">
      <div className={`relative min-w-0 ${SLIDE_WIDTH}`}>
        <div
          ref={slidesRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${label} images`}
          tabIndex={0}
          onScroll={(e) => {
            const { scrollLeft, clientWidth } = e.currentTarget;
            if (clientWidth > 0) setCurrent(Math.round(scrollLeft / clientWidth));
          }}
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            goTo(current + (e.key === "ArrowRight" ? 1 : -1));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]"
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className="relative aspect-[4/5] w-full shrink-0 snap-start bg-surface"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                preload={i === 0}
                placeholder={img.blurDataUrl ? "blur" : "empty"}
                blurDataURL={img.blurDataUrl}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center bg-bg md:bottom-3 md:right-3">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(current - 1)}
              className={`${ARROW} hidden md:flex`}
            >
              <FaArrowLeftLong aria-hidden className="size-3.5" />
            </button>
            <p className="px-2 py-0.5 text-meta tabular-nums md:px-1">
              {Math.min(current + 1, count)} / {count}
            </p>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(current + 1)}
              className={`${ARROW} hidden md:flex`}
            >
              <FaArrowRightLong aria-hidden className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="px-3 md:relative md:order-first md:w-16 md:shrink-0 md:px-0">
          <div
            ref={thumbsRef}
            className="relative flex gap-0.5 overflow-x-auto [scrollbar-width:none] md:absolute md:inset-0 md:flex-col md:overflow-y-auto md:overflow-x-hidden"
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => goTo(i)}
                className={`relative aspect-[4/5] w-14 shrink-0 bg-surface transition-opacity duration-150 md:w-full ${
                  i === current ? "" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
