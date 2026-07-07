import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { CONTAINER } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/faq";

// Server component: native <details>/<summary> — no client JS needed.
export function BrandFaq() {
  return (
    <section className={`${CONTAINER} max-w-[760px]`} aria-label="About Monte Deluxe — frequently asked questions">
      <Reveal>
        <div className="mb-12 flex flex-col items-center text-center">
          <GoldDivider className="mb-5" />
          <span className="text-[11px] uppercase tracking-mega text-[#B8965A]">
            The House
          </span>
          <h2 className="mt-3 font-display text-3xl text-[#F5F2EB] md:text-4xl">
            Monte Deluxe
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#C8C8C8] font-display">
            A premium fashion house from Port Harcourt, Rivers State, Nigeria —
            crafting luxury streetwear and bespoke clothing for men and women.
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question} delay={0.05 * i}>
            <details className="group rounded-card border border-[#8E7443]/20 bg-[#090909] transition-colors duration-300 open:border-[#8E7443]/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm uppercase tracking-wider text-[#F5F2EB] transition-colors duration-200 hover:text-gold [&::-webkit-details-marker]:hidden font-montserrat">
                {item.question}
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden
                  className="shrink-0 text-[#B8965A] transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="px-6 pb-6 text-left text-[15px] leading-8 text-[#C8C8C8] font-bodoni">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
