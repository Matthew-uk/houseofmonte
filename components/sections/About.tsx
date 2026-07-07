import { Reveal } from "@/components/ui/Reveal";
import { CONTAINER } from "@/lib/constants";

export function About() {
  return (
    <section className={CONTAINER}>
      <div
        className="relative overflow-hidden rounded-card border border-[#8E7443]/30 bg-black min-h-[280px]"
        style={{
          backgroundImage: `
        linear-gradient(
          90deg,
          rgba(0,0,0,.92) 0%,
          rgba(0,0,0,.82) 35%,
          rgba(0,0,0,.55) 65%,
          rgba(0,0,0,.75) 100%
        ),
        url('/images/img2.JPG')
      `,
          backgroundSize: "cover",
          backgroundPosition: "right bottom",
        }}
      >
        {/* subtle gold glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(201,168,92,.04)]" />

        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-md px-8 py-12 md:px-12 md:py-14">
            <Reveal>
              <span className="font-sans text-[11px] uppercase tracking-mega text-[#B8965A]">
                About MONTÉ
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-4xl leading-none text-[#F5F2EB] md:text-5xl">
                Fashion.
                <br />
                Culture.
                <br />
                Community.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm text-[15px] leading-8 text-[#C8C8C8] font-display">
                MONTÉ exists where fashion, culture and experience meet —
                a premium fashion house born in Port Harcourt, Nigeria.
                Every collection tells a story.
                Every event creates unforgettable moments.
                Every release brings the community together.
              </p>
            </Reveal>
          </div>
        </div>

        {/* optional subtle vignette */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>
    </section>
  );
}
