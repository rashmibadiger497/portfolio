"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-6"
    >
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0, 212, 255, 0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            NSE & BSE Live Market Analysis
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance leading-tight">
          <span className="text-foreground">Navigate the </span>
          <span className="text-primary glow-text">Universe</span>
          <br />
          <span className="text-foreground">of Indian Stocks</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
          Professional-grade charting, real-time technical analysis, and smart
          portfolio tools. Simpler, faster, and more powerful than any other
          stock platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/screener">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold gap-2 glow-cyan"
            >
              Start Analyzing
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/stock/RELIANCE">
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base gap-2 bg-transparent"
            >
              <Play className="w-4 h-4 text-primary" />
              View Live Charts
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { label: "Listed Stocks", value: "5,000+" },
            { label: "Analysis Tools", value: "25+" },
            { label: "Active Traders", value: "120K+" },
            { label: "Data Accuracy", value: "99.9%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
