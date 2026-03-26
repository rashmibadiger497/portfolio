import { StarBackground } from "@/components/star-background";
import { Header } from "@/components/header";
import { MarketTicker } from "@/components/market-ticker";
import { Footer } from "@/components/footer";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";

export const metadata = {
  title: "Portfolio & Strategy Tester - NovaStar",
  description:
    "Track your stock portfolio, test trading strategies, and analyze performance with NovaStar's smart portfolio tools.",
};

export default function PortfolioPage() {
  return (
    <>
      <StarBackground />
      <Header />
      <MarketTicker />
      <main className="relative z-10 pt-28 pb-16 px-4 md:px-6 min-h-screen">
        <PortfolioClient />
      </main>
      <Footer />
    </>
  );
}
