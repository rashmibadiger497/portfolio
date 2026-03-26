"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  LineChart,
  Briefcase,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Advanced Charts",
    description:
      "Interactive candlestick charts with 25+ technical indicators. Draw trendlines, set alerts, and analyze patterns.",
  },
  {
    icon: BarChart3,
    title: "Live Screener",
    description:
      "Filter thousands of NSE & BSE stocks by sector, performance, volume, and custom technical criteria in real-time.",
  },
  {
    icon: Cpu,
    title: "Strategy Tester",
    description:
      "Backtest your trading strategies against historical data. Simulate orders and see how they would have performed.",
  },
  {
    icon: Briefcase,
    title: "Portfolio Tracker",
    description:
      "Track your holdings across exchanges. Monitor P&L, allocation, and get smart diversification insights.",
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description:
      "AI-powered trend identification spots breakouts, reversals, and momentum shifts before the crowd.",
  },
  {
    icon: Zap,
    title: "Real-time Data",
    description:
      "Lightning-fast live prices with sub-second updates. Never miss a move in the market.",
  },
  {
    icon: Shield,
    title: "Risk Analytics",
    description:
      "Understand your risk exposure with beta analysis, drawdown metrics, and volatility measurements.",
  },
  {
    icon: Globe,
    title: "Market News",
    description:
      "Curated financial news and analysis from top sources, filtered by your watchlist and sectors.",
  },
];

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        }
      },
      { threshold: 0.15 }
    );

    for (const card of cardsRef.current) {
      if (card) observer.observe(card);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4 text-balance">
            Everything you need to trade smarter
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty leading-relaxed">
            Professional-grade tools that were once reserved for institutional
            traders, now available to everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              data-index={i}
              className={`group glass rounded-xl p-6 hover:glow-cyan transition-all duration-500 cursor-default ${
                visibleCards.has(i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
