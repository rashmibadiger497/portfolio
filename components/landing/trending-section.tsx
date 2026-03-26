"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import {
  trendingStocks,
  formatPrice,
  formatNumber,
  generateCandleData,
} from "@/lib/stock-data";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
} from "recharts";

function MiniChart({
  symbol,
  isPositive,
}: {
  symbol: string;
  isPositive: boolean;
}) {
  const data = useMemo(() => {
    const candles = generateCandleData(100, 30);
    return candles.map((c) => ({ v: c.close }));
  }, []);

  return (
    <AreaChart width={96} height={40} data={data}>
      <defs>
        <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={isPositive ? "hsl(142, 72%, 50%)" : "hsl(0, 72%, 51%)"}
            stopOpacity={0.3}
          />
          <stop
            offset="100%"
            stopColor={isPositive ? "hsl(142, 72%, 50%)" : "hsl(0, 72%, 51%)"}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="v"
        stroke={isPositive ? "hsl(142, 72%, 50%)" : "hsl(0, 72%, 51%)"}
        fill={`url(#grad-${symbol})`}
        strokeWidth={1.5}
        dot={false}
      />
    </AreaChart>
  );
}

export function TrendingSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const topStocks = trendingStocks.slice(0, 8);

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
              Most active stocks today
            </h2>
          </div>
          <Link href="/screener">
            <Button
              variant="outline"
              className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              View all stocks
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div
          className={`glass rounded-xl overflow-hidden transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
            <span>Stock</span>
            <span className="w-24 text-right">Price</span>
            <span className="w-24 text-right">Change</span>
            <span className="w-24 text-right">Volume</span>
            <span className="w-24">Chart</span>
          </div>

          {topStocks.map((stock, i) => (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
              className={`grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 items-center px-6 py-4 hover:bg-secondary/30 transition-all border-b border-border/50 last:border-0 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${i * 60}ms`,
                transitionDuration: "500ms",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono">
                  {stock.symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stock.sector} &middot; {stock.exchange}
                  </div>
                </div>
              </div>

              <div className="w-24 text-right font-mono text-sm text-foreground">
                {formatPrice(stock.price)}
              </div>

              <div
                className={`w-24 text-right font-mono text-sm flex items-center justify-end gap-1 ${
                  stock.change >= 0 ? "text-chart-2" : "text-chart-3"
                }`}
              >
                {stock.change >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {stock.change >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </div>

              <div className="w-24 text-right font-mono text-xs text-muted-foreground">
                {formatNumber(stock.volume)}
              </div>

              <div className="hidden md:block">
                <MiniChart
                  symbol={stock.symbol}
                  isPositive={stock.change >= 0}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
