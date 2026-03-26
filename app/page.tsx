import { StarBackground } from "@/components/star-background";
import { Header } from "@/components/header";
import { MarketTicker } from "@/components/market-ticker";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TrendingSection } from "@/components/landing/trending-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <>
      <StarBackground />
      <Header />
      <MarketTicker />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <TrendingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
