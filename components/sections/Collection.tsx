import { Lock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CONTAINER } from "@/lib/constants";
import Image from "next/image";

const IMAGES = [
  "/images/collection001(1).PNG",
  "/images/collection001(2).PNG",
  "/images/collection001(3).PNG",
];

export function Collection() {
  return (
    <div className={`${CONTAINER} text-center`}>
      <Reveal>
        <h2 className="font-display text-3xl uppercase tracking-wide text-gold md:text-4xl">
          Collection 001
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
        {IMAGES.map((src, i) => (
          <Reveal
            key={src}
            delay={0.1 + i * 0.1}
            className={
              // 3rd tile spans both columns on the 2-col mobile layout
              i === 2 ? "col-span-2 md:col-span-1" : ""
            }
          >
            <div
              aria-hidden
              className="aspect-4/5 rounded-card bg-cover bg-center opacity-60 transition-opacity duration-500 ease-in-out hover:opacity-[0.85]"
              style={{ backgroundImage: `url('${src}')` }}
            />
          </Reveal>
        // <Image src={src} alt="Image" width={300} height={300}/>
        ))}
      </div>

      <Reveal delay={0.4}>
        <p className="mt-10 flex items-center justify-center gap-2 text-small uppercase tracking-wider text-gold sm:mt-12">
          <Lock size={12} strokeWidth={2} aria-hidden />
          Unlocks July 22
        </p>
      </Reveal>
    </div>
  );
}
