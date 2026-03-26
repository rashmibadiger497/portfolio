import { StarBackground } from "@/components/star-background";
import { Header } from "@/components/header";
import { MarketTicker } from "@/components/market-ticker";
import { Footer } from "@/components/footer";
import { StockChartClient } from "@/components/stock/stock-chart-client";
import { getStockBySymbol, trendingStocks } from "@/lib/stock-data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return trendingStocks.map((stock) => ({
    symbol: stock.symbol,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const stock = getStockBySymbol(symbol);
  if (!stock) return { title: "Stock Not Found - NovaStar" };
  return {
    title: `${stock.symbol} - ${stock.name} | NovaStar Charts`,
    description: `Live chart and technical analysis for ${stock.name} (${stock.symbol}) on ${stock.exchange}. Price, volume, indicators, and more.`,
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const stock = getStockBySymbol(symbol);
  if (!stock) notFound();

  return (
    <>
      <StarBackground />
      <Header />
      <MarketTicker />
      <main className="relative z-10 pt-28 pb-16 px-4 md:px-6 min-h-screen">
        <StockChartClient stock={stock} />
      </main>
      <Footer />
    </>
  );
}
