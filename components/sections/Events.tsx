import { MapPin } from "lucide-react";
import Image from "next/image";
import { GoldDivider } from "../ui/GoldDivider";
import { Reveal } from "@/components/ui/Reveal";
import { CONTAINER } from "@/lib/constants";

export function Events() {
  return (
    <section className={CONTAINER}>
      <Reveal>
        <div className="mb-12 flex flex-col items-center">
          <GoldDivider className="mb-5" />

          <span className="text-[11px] uppercase tracking-mega text-[#B8965A]">
            Upcoming
          </span>

          <h2 className="mt-3 font-display text-4xl text-[#F5F2EB] md:text-5xl">
            Events
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-8 md:grid-cols-2">
        {/* EVENT CARD */}
        <Reveal delay={0.1} className="h-full">
          <div
            className="group relative h-full overflow-hidden rounded-card border border-[#8E7443]/20 bg-[#090909] min-h-[430px]"
            style={{
              backgroundImage: `
            linear-gradient(
              rgba(0,0,0,.72),
              rgba(0,0,0,.88)
            ),
            url('/images/event-bg.jpg')
          `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            <div className="relative flex h-full flex-col items-center justify-center px-10 py-12 text-center">
              <p className="text-[11px] uppercase tracking-mega text-[#B8965A]">
                July 22
              </p>

              <h3 className="mt-8 font-display text-[42px] leading-none text-[#F5F2EB]">
                MONTÉ
                <br />
                Two Year
                <br />
                Anniversary
              </h3>

              <div className="mt-8 flex items-center gap-2 text-[#C7A56A]">
                <MapPin size={15} strokeWidth={1.8} aria-hidden />

                <span className="text-xs uppercase tracking-[0.3em]">
                  PORT HARCOURT
                </span>
              </div>

              <p className="mt-3 text-[11px] uppercase tracking-mega text-[#8B8B8B]">
                Invitation Only
              </p>

              <p
                aria-disabled
                className="mt-12 cursor-default rounded-button border border-[#B8965A] px-8 py-3 text-[11px] uppercase tracking-wider text-[#B8965A]"
              >
                RSVP Opens Soon
              </p>
            </div>
          </div>
        </Reveal>

        {/* ROOMLY CARD */}
        <Reveal delay={0.2} className="h-full">
          <div
            className="relative h-full overflow-hidden rounded-card border border-[#8E7443]/20 bg-[#090909] min-h-[430px]"
            style={{
              backgroundImage: `
            linear-gradient(
              rgba(0,0,0,.78),
              rgba(0,0,0,.9)
            ),
            url('/images/roomly-bg.jpg')
          `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            <div className="relative flex h-full flex-col items-center justify-center px-10 py-12 text-center">
              <p className="text-[11px] uppercase tracking-mega text-[#B8965A]">
                Powered by Roomly
              </p>

              <p className="mt-3 text-[10px] uppercase tracking-mega text-[#BDBDBD]">
                Official Accommodation Partner
              </p>

              <Image
                src="/images/roomly.png"
                alt="Roomly"
                width={220}
                height={60}
                className="mt-10 w-52"
              />

              <p className="mt-10 max-w-xs text-sm leading-8 text-[#C8C8C8] font-montserrat">
                Book nearby hotels for the anniversary directly through
                Roomly and enjoy a seamless accommodation experience.
              </p>

              <p className="mt-10 text-[11px] uppercase tracking-mega text-[#B8965A]">
                Coming Soon
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
