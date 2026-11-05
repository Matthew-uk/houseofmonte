"use client";

import Image from "next/image";
import { useState } from "react";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  blurDataUrl?: string;
}

// DESIGN.md §5 Gallery: native swipe carousel with a counter on mobile, a
// vertical stack of full-width images from md.
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return <div className="aspect-[4/5] bg-surface" />;

  return (
    <div className="relative">
      <div
        role="group"
        aria-label={`${label} images`}
        tabIndex={0}
        onScroll={(e) => {
          const { scrollLeft, clientWidth } = e.currentTarget;
          if (clientWidth > 0) setCurrent(Math.round(scrollLeft / clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:flex-col md:gap-0.5 md:overflow-visible"
      >
        {images.map((img, i) => (
          <div key={img.id} className="relative aspect-[4/5] w-full shrink-0 snap-start bg-surface">
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
      {images.length > 1 && (
        <p className="absolute bottom-2 right-2 bg-bg px-2 py-0.5 text-meta md:hidden">
          {Math.min(current + 1, images.length)} / {images.length}
        </p>
      )}
    </div>
  );
}
