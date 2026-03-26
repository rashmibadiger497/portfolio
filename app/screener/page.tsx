import { StarBackground } from "@/components/star-background";
import { Header } from "@/components/header";
import { MarketTicker } from "@/components/market-ticker";
import { Footer } from "@/components/footer";
import { ScreenerClient } from "@/components/screener/screener-client";

export const metadata = {
  title: "Market Screener - NovaStar",
  description: "Live stock market screener for NSE & BSE listed stocks with real-time data, sector filters, and trend analysis.",
};

export default function ScreenerPage() {
  return (
    <>
      <StarBackground />
      <Header />
      <MarketTicker />
      <main className="relative z-10 pt-28 pb-16 px-6 min-h-screen">
        <ScreenerClient />
      </main>
      <Footer />
    </>
  );
}
