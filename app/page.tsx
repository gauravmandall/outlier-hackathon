import Hero from "@/components/hero";
import About from "@/components/about";
import FAQ from "@/components/faq";
import BotCTA from "@/components/bot-cta";
import SectionWrapper from "@/components/section-wrapper";
import Footer from "@/components/footer";
import { ScrollAnimation } from "@/components/scroll-animation";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Hero />
      <ScrollAnimation>
        <SectionWrapper className="bg-black py-24">
          <ScrollAnimation delay={0.2}>
            <About />
          </ScrollAnimation>
        </SectionWrapper>
      </ScrollAnimation>
      <ScrollAnimation delay={0.3}>
        <FAQ />
      </ScrollAnimation>
      <ScrollAnimation delay={0.3}>
        <BotCTA />
      </ScrollAnimation>
      <Footer />
    </div>
  );
}
