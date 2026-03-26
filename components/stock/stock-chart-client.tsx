"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Info,
  Activity,
  BarChart3,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Stock,
  type CandleData,
  generateCandleData,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  formatPrice,
  formatNumber,
} from "@/lib/stock-data";
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  LineChart,
} from "recharts";

type TimeFrame = "1W" | "1M" | "3M" | "6M" | "1Y";
type ChartType = "candle" | "line" | "area";

interface IndicatorConfig {
  sma20: boolean;
  sma50: boolean;
  ema12: boolean;
  ema26: boolean;
  bollinger: boolean;
  rsi: boolean;
  macd: boolean;
  volume: boolean;
}

const timeFrameDays: Record<TimeFrame, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-strong rounded-lg p-3 text-xs min-w-[180px]">
      <p className="text-muted-foreground mb-2 font-mono">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </span>
          <span className="font-mono text-foreground">
            {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StockChartClient({ stock }: { stock: Stock }) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("3M");
  const [chartType, setChartType] = useState<ChartType>("candle");
  const [indicators, setIndicators] = useState<IndicatorConfig>({
    sma20: true,
    sma50: false,
    ema12: false,
    ema26: false,
    bollinger: false,
    rsi: true,
    macd: false,
    volume: true,
  });

  const toggleIndicator = (key: keyof IndicatorConfig) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rawData = useMemo(
    () => generateCandleData(stock.price, timeFrameDays[timeFrame]),
    [stock.price, timeFrame]
  );

  const sma20 = useMemo(() => calculateSMA(rawData, 20), [rawData]);
  const sma50 = useMemo(() => calculateSMA(rawData, 50), [rawData]);
  const ema12 = useMemo(() => calculateEMA(rawData, 12), [rawData]);
  const ema26 = useMemo(() => calculateEMA(rawData, 26), [rawData]);
  const rsiData = useMemo(() => calculateRSI(rawData), [rawData]);
  const macdData = useMemo(() => calculateMACD(rawData), [rawData]);
  const bbands = useMemo(() => calculateBollingerBands(rawData), [rawData]);

  const chartData = useMemo(() => {
    return rawData.map((d, i) => ({
      date: d.date.substring(5),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
      sma20: sma20[i],
      sma50: sma50[i],
      ema12: ema12[i],
      ema26: ema26[i],
      bbUpper: bbands.upper[i],
      bbMiddle: bbands.middle[i],
      bbLower: bbands.lower[i],
      rsi: rsiData[i],
      macd: macdData.macd[i],
      signal: macdData.signal[i],
      histogram: macdData.histogram[i],
      // For candlestick rendering
      candleBody: [d.open, d.close],
      isGreen: d.close >= d.open,
    }));
  }, [rawData, sma20, sma50, ema12, ema26, bbands, rsiData, macdData]);

  const latestCandle = rawData[rawData.length - 1];
  const prevCandle = rawData[rawData.length - 2];
  const dayChange = latestCandle.close - prevCandle.close;
  const dayChangePercent = (dayChange / prevCandle.close) * 100;

  const indicatorButtons: { key: keyof IndicatorConfig; label: string }[] = [
    { key: "sma20", label: "SMA 20" },
    { key: "sma50", label: "SMA 50" },
    { key: "ema12", label: "EMA 12" },
    { key: "ema26", label: "EMA 26" },
    { key: "bollinger", label: "Bollinger" },
    { key: "rsi", label: "RSI" },
    { key: "macd", label: "MACD" },
    { key: "volume", label: "Volume" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Back + Stock Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <Link href="/screener">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Screener
          </Button>
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary font-mono">
              {stock.symbol.substring(0, 3)}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                {stock.symbol}
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {stock.exchange}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold font-mono text-foreground">
              {formatPrice(latestCandle.close)}
            </div>
            <div
              className={`flex items-center justify-end gap-1 text-sm font-mono ${
                dayChange >= 0 ? "text-chart-2" : "text-chart-3"
              }`}
            >
              {dayChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {dayChange >= 0 ? "+" : ""}
              {dayChange.toFixed(2)} ({dayChange >= 0 ? "+" : ""}
              {dayChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass rounded-xl p-4 mb-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Time Frame */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {(Object.keys(timeFrameDays) as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                  timeFrame === tf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {(
              [
                { key: "candle", label: "Candle", icon: BarChart3 },
                { key: "line", label: "Line", icon: Activity },
                { key: "area", label: "Area", icon: Layers },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setChartType(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  chartType === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs text-muted-foreground mr-1 whitespace-nowrap">
              Indicators:
            </span>
            {indicatorButtons.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleIndicator(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  indicators[key]
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass rounded-xl p-4 mb-4">
        <div className="h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(230, 30%, 18%)"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toFixed(0)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Bollinger Bands */}
              {indicators.bollinger && (
                <>
                  <Area
                    type="monotone"
                    dataKey="bbUpper"
                    stroke="none"
                    fill="hsl(190, 100%, 50%)"
                    fillOpacity={0.05}
                    name="BB Upper"
                    dot={false}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="bbLower"
                    stroke="none"
                    fill="hsl(190, 100%, 50%)"
                    fillOpacity={0.05}
                    name="BB Lower"
                    dot={false}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bbUpper"
                    stroke="hsl(190, 60%, 50%)"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="4 2"
                    name="BB Upper"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bbLower"
                    stroke="hsl(190, 60%, 50%)"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="4 2"
                    name="BB Lower"
                    connectNulls={false}
                  />
                </>
              )}

              {/* Price rendering */}
              {chartType === "area" && (
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(190, 100%, 50%)"
                  fill="hsl(190, 100%, 50%)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  name="Close"
                />
              )}

              {chartType === "line" && (
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(190, 100%, 50%)"
                  strokeWidth={2}
                  dot={false}
                  name="Close"
                />
              )}

              {chartType === "candle" && (
                <>
                  {/* High-Low line (wick) */}
                  <Bar
                    dataKey="high"
                    fill="transparent"
                    name="High"
                  />
                  {/* Candle Body using close price as the line */}
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(190, 100%, 50%)"
                    strokeWidth={2}
                    dot={false}
                    name="Close"
                  />
                  <Line
                    type="monotone"
                    dataKey="open"
                    stroke="hsl(190, 70%, 40%)"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="2 2"
                    name="Open"
                    strokeOpacity={0.5}
                  />
                </>
              )}

              {/* Overlays */}
              {indicators.sma20 && (
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="hsl(45, 93%, 58%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="SMA 20"
                  connectNulls={false}
                />
              )}
              {indicators.sma50 && (
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="hsl(270, 70%, 60%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="SMA 50"
                  connectNulls={false}
                />
              )}
              {indicators.ema12 && (
                <Line
                  type="monotone"
                  dataKey="ema12"
                  stroke="hsl(0, 72%, 60%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="EMA 12"
                  connectNulls={false}
                />
              )}
              {indicators.ema26 && (
                <Line
                  type="monotone"
                  dataKey="ema26"
                  stroke="hsl(142, 72%, 50%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="EMA 26"
                  connectNulls={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sub Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Volume Chart */}
        {indicators.volume && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Volume
            </h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(230, 30%, 18%)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatNumber(v)}
                    width={50}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="volume"
                    name="Volume"
                    fill="hsl(190, 100%, 50%)"
                    fillOpacity={0.4}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* RSI Chart */}
        {indicators.rsi && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              RSI (14)
            </h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(230, 30%, 18%)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    ticks={[0, 30, 50, 70, 100]}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={70}
                    stroke="hsl(0, 72%, 51%)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.5}
                  />
                  <ReferenceLine
                    y={30}
                    stroke="hsl(142, 72%, 50%)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="rsi"
                    stroke="hsl(270, 70%, 60%)"
                    strokeWidth={1.5}
                    dot={false}
                    name="RSI"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* MACD */}
      {indicators.macd && (
        <div className="glass rounded-xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            MACD (12, 26, 9)
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(230, 30%, 18%)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="hsl(215, 20%, 35%)" strokeWidth={0.5} />
                <Bar
                  dataKey="histogram"
                  name="Histogram"
                  fill="hsl(190, 100%, 50%)"
                  fillOpacity={0.4}
                  radius={[1, 1, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="macd"
                  stroke="hsl(190, 100%, 50%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="MACD"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="signal"
                  stroke="hsl(0, 72%, 60%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Signal"
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stock Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open", value: formatPrice(stock.open) },
          { label: "High", value: formatPrice(stock.high) },
          { label: "Low", value: formatPrice(stock.low) },
          { label: "Prev Close", value: formatPrice(stock.prevClose) },
          { label: "52W High", value: formatPrice(stock.high52) },
          { label: "52W Low", value: formatPrice(stock.low52) },
          { label: "Volume", value: formatNumber(stock.volume) },
          { label: "Market Cap", value: `${formatNumber(stock.marketCap)} Cr` },
          { label: "P/E Ratio", value: stock.pe.toFixed(1) },
          { label: "Sector", value: stock.sector },
          { label: "Exchange", value: stock.exchange },
          {
            label: "Day Range",
            value: `${formatPrice(stock.low)} - ${formatPrice(stock.high)}`,
          },
        ].map((item) => (
          <div key={item.label} className="glass rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
            <div className="text-sm font-mono font-semibold text-foreground">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
