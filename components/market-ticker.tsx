"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { trendingStocks, formatPrice } from "@/lib/stock-data";
import Link from "next/link";

export function MarketTicker() {
  const doubled = [...trendingStocks, ...trendingStocks];

  return (
    <div className="fixed top-[56px] left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border overflow-hidden">
      <div className="flex animate-ticker" style={{ width: "max-content" }}>
        {doubled.map((stock, i) => (
          <Link
            key={`${stock.symbol}-${i}`}
            href={`/stock/${stock.symbol}`}
            className="flex items-center gap-2 px-5 py-1.5 hover:bg-secondary/50 transition-colors whitespace-nowrap"
          >
            <span className="text-xs font-mono font-semibold text-foreground">
              {stock.symbol}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {formatPrice(stock.price)}
            </span>
            <span
              className={`flex items-center gap-0.5 text-xs font-mono ${
                stock.change >= 0 ? "text-chart-2" : "text-chart-3"
              }`}
            >
              {stock.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stock.change >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
