import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Events } from "@/components/sections/Events";
import { Collection } from "@/components/sections/Collection";
import { Instagram } from "@/components/sections/Instagram";
import { BrandFaq } from "@/components/sections/BrandFaq";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { SECTION_RHYTHM, SECTION_X } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* About */}
        <AnimatedSection className={`${SECTION_X} ${SECTION_RHYTHM}`}>
          <About />
        </AnimatedSection>

        {/* Events */}
        <AnimatedSection className={`${SECTION_X} ${SECTION_RHYTHM}`}>
          <Events />
        </AnimatedSection>
        <GoldDivider width="w-24" />

        {/* Collection */}
        <AnimatedSection className={`${SECTION_X} ${SECTION_RHYTHM}`}>
          <Collection />
        </AnimatedSection>

        {/* Instagram */}
        <AnimatedSection className={`${SECTION_X} ${SECTION_RHYTHM}`}>
          <Instagram />
        </AnimatedSection>

        {/* Brand FAQ — visible answers mirrored by the FAQPage JSON-LD */}
        <AnimatedSection className={`${SECTION_X} ${SECTION_RHYTHM}`}>
          <BrandFaq />
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
