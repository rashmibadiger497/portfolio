"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Play,
  BarChart3,
  Target,
  ArrowRight,
  X,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  trendingStocks,
  formatPrice,
  formatNumber,
  generateCandleData,
  type Stock,
} from "@/lib/stock-data";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Holding {
  stock: Stock;
  quantity: number;
  avgPrice: number;
}

interface StrategyResult {
  totalReturn: number;
  winRate: number;
  trades: number;
  maxDrawdown: number;
  sharpeRatio: number;
  equityCurve: { date: string; value: number }[];
}

const COLORS = [
  "hsl(190, 100%, 50%)",
  "hsl(142, 72%, 50%)",
  "hsl(45, 93%, 58%)",
  "hsl(270, 70%, 60%)",
  "hsl(0, 72%, 51%)",
  "hsl(25, 90%, 55%)",
  "hsl(170, 80%, 45%)",
  "hsl(320, 70%, 55%)",
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg p-3 text-xs">
      <p className="text-muted-foreground mb-1 font-mono">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-foreground font-mono">{formatPrice(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function PortfolioClient() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "strategy">("portfolio");
  const [holdings, setHoldings] = useState<Holding[]>([
    { stock: trendingStocks[0], quantity: 50, avgPrice: 2350.0 },
    { stock: trendingStocks[2], quantity: 100, avgPrice: 1580.0 },
    { stock: trendingStocks[3], quantity: 75, avgPrice: 1780.0 },
    { stock: trendingStocks[6], quantity: 200, avgPrice: 690.0 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addQty, setAddQty] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Strategy tester state
  const [strategyStock, setStrategyStock] = useState<Stock>(trendingStocks[0]);
  const [strategyType, setStrategyType] = useState<"sma_cross" | "rsi" | "macd">("sma_cross");
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Portfolio calculations
  const portfolioStats = useMemo(() => {
    let totalInvested = 0;
    let currentValue = 0;

    for (const h of holdings) {
      totalInvested += h.avgPrice * h.quantity;
      currentValue += h.stock.price * h.quantity;
    }

    const totalPnL = currentValue - totalInvested;
    const totalReturn = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, totalPnL, totalReturn };
  }, [holdings]);

  const pieData = useMemo(() => {
    return holdings.map((h) => ({
      name: h.stock.symbol,
      value: h.stock.price * h.quantity,
    }));
  }, [holdings]);

  const addHolding = () => {
    if (!selectedStock || !addQty || !addPrice) return;
    const exists = holdings.find((h) => h.stock.symbol === selectedStock.symbol);
    if (exists) return;
    setHoldings([
      ...holdings,
      {
        stock: selectedStock,
        quantity: Number.parseInt(addQty),
        avgPrice: Number.parseFloat(addPrice),
      },
    ]);
    setShowAddModal(false);
    setSearchTerm("");
    setAddQty("");
    setAddPrice("");
    setSelectedStock(null);
  };

  const removeHolding = (symbol: string) => {
    setHoldings(holdings.filter((h) => h.stock.symbol !== symbol));
  };

  const runStrategy = () => {
    setIsRunning(true);
    setTimeout(() => {
      const data = generateCandleData(strategyStock.price, 365);
      const initial = 100000;
      let cash = initial;
      let shares = 0;
      let trades = 0;
      let wins = 0;
      let peak = initial;
      let maxDrawdown = 0;
      const equityCurve: { date: string; value: number }[] = [];
      let lastBuyPrice = 0;

      for (let i = 26; i < data.length; i++) {
        const equity = cash + shares * data[i].close;
        equityCurve.push({ date: data[i].date.substring(5), value: equity });

        if (equity > peak) peak = equity;
        const dd = ((peak - equity) / peak) * 100;
        if (dd > maxDrawdown) maxDrawdown = dd;

        // Simple SMA crossover strategy simulation
        const sma5 = data.slice(i - 5, i).reduce((s, d) => s + d.close, 0) / 5;
        const sma20 = data.slice(i - 20, i).reduce((s, d) => s + d.close, 0) / 20;

        let buySignal = false;
        let sellSignal = false;

        if (strategyType === "sma_cross") {
          const prevSma5 = data.slice(i - 6, i - 1).reduce((s, d) => s + d.close, 0) / 5;
          const prevSma20 = data.slice(i - 21, i - 1).reduce((s, d) => s + d.close, 0) / 20;
          buySignal = prevSma5 <= prevSma20 && sma5 > sma20;
          sellSignal = prevSma5 >= prevSma20 && sma5 < sma20;
        } else if (strategyType === "rsi") {
          const changes = data.slice(i - 14, i).map((d, j, arr) =>
            j === 0 ? 0 : d.close - arr[j - 1].close
          );
          const gains = changes.filter((c) => c > 0).reduce((s, c) => s + c, 0) / 14;
          const losses = changes.filter((c) => c < 0).reduce((s, c) => s + Math.abs(c), 0) / 14;
          const rsi = losses === 0 ? 100 : 100 - 100 / (1 + gains / losses);
          buySignal = rsi < 30 && shares === 0;
          sellSignal = rsi > 70 && shares > 0;
        } else {
          buySignal = sma5 > sma20 && data[i].close > sma5;
          sellSignal = sma5 < sma20 && data[i].close < sma5;
        }

        if (buySignal && shares === 0 && cash > data[i].close) {
          shares = Math.floor(cash / data[i].close);
          cash -= shares * data[i].close;
          lastBuyPrice = data[i].close;
          trades++;
        } else if (sellSignal && shares > 0) {
          cash += shares * data[i].close;
          if (data[i].close > lastBuyPrice) wins++;
          shares = 0;
          trades++;
        }
      }

      const finalEquity = cash + shares * data[data.length - 1].close;
      const totalReturn = ((finalEquity - initial) / initial) * 100;
      const tradePairs = Math.floor(trades / 2);

      setStrategyResult({
        totalReturn,
        winRate: tradePairs > 0 ? (wins / tradePairs) * 100 : 0,
        trades,
        maxDrawdown,
        sharpeRatio: Number.parseFloat((totalReturn / (maxDrawdown || 1) * 0.5).toFixed(2)),
        equityCurve,
      });
      setIsRunning(false);
    }, 800);
  };

  const filteredAddStocks = trendingStocks.filter(
    (s) =>
      !holdings.find((h) => h.stock.symbol === s.symbol) &&
      (s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Portfolio & Strategy
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your holdings and backtest trading strategies.
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "portfolio"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Portfolio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("strategy")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "strategy"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Strategy Tester
          </button>
        </div>
      </div>

      {activeTab === "portfolio" ? (
        <>
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Invested",
                value: formatPrice(portfolioStats.totalInvested),
                prefix: "INR ",
              },
              {
                label: "Current Value",
                value: formatPrice(portfolioStats.currentValue),
                prefix: "INR ",
              },
              {
                label: "Total P&L",
                value: formatPrice(Math.abs(portfolioStats.totalPnL)),
                prefix: portfolioStats.totalPnL >= 0 ? "+" : "-",
                color: portfolioStats.totalPnL >= 0 ? "text-chart-2" : "text-chart-3",
              },
              {
                label: "Returns",
                value: `${portfolioStats.totalReturn.toFixed(2)}%`,
                prefix: portfolioStats.totalReturn >= 0 ? "+" : "",
                color: portfolioStats.totalReturn >= 0 ? "text-chart-2" : "text-chart-3",
              },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-2">
                  {stat.label}
                </div>
                <div
                  className={`text-lg md:text-xl font-bold font-mono ${stat.color || "text-foreground"}`}
                >
                  {stat.prefix}
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Holdings Table */}
            <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Holdings ({holdings.length})
                </h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Stock
                </Button>
              </div>

              {holdings.length === 0 ? (
                <div className="py-16 text-center">
                  <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No holdings yet. Add stocks to start tracking.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <span>Stock</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Avg Price</span>
                    <span className="text-right">Current</span>
                    <span className="text-right">P&L</span>
                    <span className="w-8" />
                  </div>
                  {holdings.map((h) => {
                    const pnl = (h.stock.price - h.avgPrice) * h.quantity;
                    const pnlPercent = ((h.stock.price - h.avgPrice) / h.avgPrice) * 100;
                    return (
                      <div
                        key={h.stock.symbol}
                        className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-3 items-center px-5 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <Link
                          href={`/stock/${h.stock.symbol}`}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary font-mono">
                            {h.stock.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">
                              {h.stock.symbol}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {h.stock.sector}
                            </div>
                          </div>
                        </Link>
                        <div className="text-right font-mono text-sm text-foreground">
                          {h.quantity}
                        </div>
                        <div className="text-right font-mono text-sm text-muted-foreground">
                          {formatPrice(h.avgPrice)}
                        </div>
                        <div className="text-right font-mono text-sm text-foreground">
                          {formatPrice(h.stock.price)}
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-mono text-sm ${pnl >= 0 ? "text-chart-2" : "text-chart-3"}`}
                          >
                            {pnl >= 0 ? "+" : ""}
                            {formatPrice(pnl)}
                          </div>
                          <div
                            className={`font-mono text-[10px] ${pnl >= 0 ? "text-chart-2" : "text-chart-3"}`}
                          >
                            ({pnlPercent >= 0 ? "+" : ""}
                            {pnlPercent.toFixed(2)}%)
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHolding(h.stock.symbol)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-chart-3 transition-colors rounded-md hover:bg-chart-3/10"
                          aria-label={`Remove ${h.stock.symbol}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Allocation Pie */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Allocation
              </h3>
              {holdings.length > 0 ? (
                <>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) =>
                            active && payload?.length ? (
                              <div className="glass-strong rounded-lg p-2 text-xs">
                                <span className="text-foreground font-mono">
                                  {payload[0].name}: {formatPrice(payload[0].value as number)}
                                </span>
                              </div>
                            ) : null
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {pieData.map((d, i) => {
                      const total = pieData.reduce((s, p) => s + p.value, 0);
                      const pct = ((d.value / total) * 100).toFixed(1);
                      return (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            <span className="text-muted-foreground">{d.name}</span>
                          </span>
                          <span className="font-mono text-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="h-[220px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Add stocks to see allocation</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Stock Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                onClick={() => setShowAddModal(false)}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
                aria-label="Close modal"
              />
              <div className="relative glass-strong rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Add to Portfolio</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <Input
                  placeholder="Search stock..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedStock(null);
                  }}
                  className="mb-3 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                />

                {!selectedStock && searchTerm && (
                  <div className="max-h-40 overflow-y-auto mb-3 rounded-lg border border-border">
                    {filteredAddStocks.map((s) => (
                      <button
                        key={s.symbol}
                        type="button"
                        onClick={() => {
                          setSelectedStock(s);
                          setSearchTerm(s.symbol);
                          setAddPrice(s.price.toString());
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary/50 transition-colors text-foreground"
                      >
                        <span className="font-mono font-semibold">{s.symbol}</span>
                        <span className="text-muted-foreground text-xs">{s.name}</span>
                      </button>
                    ))}
                    {filteredAddStocks.length === 0 && (
                      <p className="px-3 py-2 text-sm text-muted-foreground">No matches</p>
                    )}
                  </div>
                )}

                {selectedStock && (
                  <div className="glass rounded-lg p-3 mb-3 text-sm">
                    <span className="font-mono font-semibold text-foreground">
                      {selectedStock.symbol}
                    </span>
                    <span className="text-muted-foreground ml-2">{selectedStock.name}</span>
                    <span className="text-muted-foreground ml-2">
                      CMP: {formatPrice(selectedStock.price)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block" htmlFor="qty">
                      Quantity
                    </label>
                    <Input
                      id="qty"
                      type="number"
                      placeholder="100"
                      value={addQty}
                      onChange={(e) => setAddQty(e.target.value)}
                      className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block" htmlFor="price">
                      Avg Price
                    </label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="1500.00"
                      value={addPrice}
                      onChange={(e) => setAddPrice(e.target.value)}
                      className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <Button
                  onClick={addHolding}
                  disabled={!selectedStock || !addQty || !addPrice}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add to Portfolio
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Strategy Tester */
        <div>
          {/* Strategy Config */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Configure Strategy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stock Selection */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block" htmlFor="strategy-stock">
                  Stock
                </label>
                <select
                  id="strategy-stock"
                  value={strategyStock.symbol}
                  onChange={(e) => {
                    const s = trendingStocks.find((t) => t.symbol === e.target.value);
                    if (s) setStrategyStock(s);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm"
                >
                  {trendingStocks.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Strategy Type */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Strategy</label>
                <div className="flex gap-2">
                  {[
                    { key: "sma_cross" as const, label: "SMA Cross" },
                    { key: "rsi" as const, label: "RSI" },
                    { key: "macd" as const, label: "MACD" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStrategyType(key)}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        strategyType === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground border border-border hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Run button */}
              <div className="flex items-end">
                <Button
                  onClick={runStrategy}
                  disabled={isRunning}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Backtest
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {strategyType === "sma_cross" &&
                  "SMA Crossover: Buy when 5-day SMA crosses above 20-day SMA. Sell when it crosses below. Initial capital: INR 1,00,000. Period: 1 year."}
                {strategyType === "rsi" &&
                  "RSI Strategy: Buy when RSI(14) drops below 30 (oversold). Sell when RSI rises above 70 (overbought). Initial capital: INR 1,00,000. Period: 1 year."}
                {strategyType === "macd" &&
                  "MACD Strategy: Buy when price is above SMA5 and SMA5 > SMA20. Sell when price drops below and SMA5 < SMA20. Initial capital: INR 1,00,000. Period: 1 year."}
              </p>
            </div>
          </div>

          {/* Strategy Results */}
          {strategyResult && (
            <div>
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                  {
                    label: "Total Return",
                    value: `${strategyResult.totalReturn >= 0 ? "+" : ""}${strategyResult.totalReturn.toFixed(2)}%`,
                    color: strategyResult.totalReturn >= 0 ? "text-chart-2" : "text-chart-3",
                  },
                  {
                    label: "Win Rate",
                    value: `${strategyResult.winRate.toFixed(1)}%`,
                    color: strategyResult.winRate >= 50 ? "text-chart-2" : "text-chart-3",
                  },
                  {
                    label: "Total Trades",
                    value: strategyResult.trades.toString(),
                    color: "text-foreground",
                  },
                  {
                    label: "Max Drawdown",
                    value: `-${strategyResult.maxDrawdown.toFixed(2)}%`,
                    color: "text-chart-3",
                  },
                  {
                    label: "Sharpe Ratio",
                    value: strategyResult.sharpeRatio.toFixed(2),
                    color: strategyResult.sharpeRatio >= 1 ? "text-chart-2" : "text-chart-4",
                  },
                ].map((m) => (
                  <div key={m.label} className="glass rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                    <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Equity Curve */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Equity Curve
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={strategyResult.equityCurve} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 30%, 18%)" opacity={0.4} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        width={50}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(190, 100%, 50%)"
                        fill="url(#equityGrad)"
                        strokeWidth={2}
                        dot={false}
                        name="Equity"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {!strategyResult && !isRunning && (
            <div className="glass rounded-xl py-20 flex flex-col items-center justify-center">
              <Cpu className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No backtest results yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select a stock and strategy, then hit Run Backtest.
              </p>
              <Button
                onClick={runStrategy}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Play className="w-4 h-4" />
                Run your first backtest
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
