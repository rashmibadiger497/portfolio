"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  SlidersHorizontal,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  trendingStocks,
  sectors,
  formatPrice,
  formatNumber,
  type Stock,
} from "@/lib/stock-data";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { generateCandleData } from "@/lib/stock-data";

type SortKey = "symbol" | "price" | "changePercent" | "volume" | "marketCap" | "pe";
type SortDir = "asc" | "desc";

function MiniSparkline({ positive }: { positive: boolean }) {
  const data = useMemo(() => {
    return generateCandleData(100, 20).map((c) => ({ v: c.close }));
  }, []);

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`spark-${positive ? "g" : "r"}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? "hsl(142, 72%, 50%)" : "hsl(0, 72%, 51%)"} stopOpacity={0.3} />
              <stop offset="100%" stopColor={positive ? "hsl(142, 72%, 50%)" : "hsl(0, 72%, 51%)"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={positive ? "hsl(142, 72%, 50%)" : "hsl(0, 72%, 51%)"}
            fill={`url(#spark-${positive ? "g" : "r"})`}
            strokeWidth={1.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScreenerClient() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [exchange, setExchange] = useState<"All" | "NSE" | "BSE">("All");

  const filteredStocks = useMemo(() => {
    let stocks = [...trendingStocks];

    if (search) {
      const q = search.toLowerCase();
      stocks = stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      );
    }

    if (selectedSector !== "All") {
      stocks = stocks.filter((s) => s.sector === selectedSector);
    }

    if (exchange !== "All") {
      stocks = stocks.filter((s) => s.exchange === exchange);
    }

    stocks.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return stocks;
  }, [search, selectedSector, sortKey, sortDir, exchange]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortButton = ({
    label,
    sortKeyVal,
    className = "",
  }: {
    label: string;
    sortKeyVal: SortKey;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={() => handleSort(sortKeyVal)}
      className={`flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {label}
      <ArrowUpDown
        className={`w-3 h-3 ${sortKey === sortKeyVal ? "text-primary" : ""}`}
      />
    </button>
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Market Screener
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Live analysis of NSE & BSE listed stocks. Click any stock to open
            detailed charts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
          Market Open &middot; {filteredStocks.length} stocks
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Exchange toggle */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {(["All", "NSE", "BSE"] as const).map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setExchange(ex)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  exchange === ex
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Sector filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {sectors.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  selectedSector === sector
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 border-b border-border">
          <SortButton label="Stock" sortKeyVal="symbol" />
          <SortButton label="Price (INR)" sortKeyVal="price" className="justify-end" />
          <SortButton label="Change" sortKeyVal="changePercent" className="justify-end" />
          <SortButton label="Volume" sortKeyVal="volume" className="justify-end" />
          <SortButton label="Market Cap" sortKeyVal="marketCap" className="justify-end" />
          <SortButton label="P/E" sortKeyVal="pe" className="justify-end" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Trend
          </span>
        </div>

        {/* Rows */}
        {filteredStocks.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-sm">
              No stocks match your filters.
            </p>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
              className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_100px] gap-2 lg:gap-4 items-center px-6 py-4 hover:bg-secondary/30 transition-colors border-b border-border/40 last:border-0"
            >
              {/* Stock info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono flex-shrink-0">
                  {stock.symbol.substring(0, 3)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {stock.name}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right font-mono text-sm text-foreground">
                {formatPrice(stock.price)}
              </div>

              {/* Change */}
              <div className="col-span-2 lg:col-span-1">
                <div
                  className={`flex items-center justify-end gap-1 font-mono text-sm ${
                    stock.change >= 0 ? "text-chart-2" : "text-chart-3"
                  }`}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {stock.change >= 0 ? "+" : ""}
                    {formatPrice(stock.change)}
                  </span>
                  <span className="text-xs">
                    ({stock.change >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Volume */}
              <div className="hidden lg:block text-right font-mono text-xs text-muted-foreground">
                {formatNumber(stock.volume)}
              </div>

              {/* Market Cap */}
              <div className="hidden lg:block text-right font-mono text-xs text-muted-foreground">
                {formatNumber(stock.marketCap)} Cr
              </div>

              {/* P/E */}
              <div className="hidden lg:block text-right font-mono text-xs text-muted-foreground">
                {stock.pe.toFixed(1)}
              </div>

              {/* Mini chart */}
              <div className="hidden lg:flex justify-end">
                <MiniSparkline positive={stock.change >= 0} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
