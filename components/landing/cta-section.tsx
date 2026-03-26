"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
          }}
        />
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 relative z-10 text-balance">
          Ready to explore the market universe?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 relative z-10 text-pretty leading-relaxed">
          Join thousands of traders who use NovaStar to make smarter investment
          decisions. Start with a free account today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-base font-semibold gap-2 glow-cyan"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/screener">
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-10 py-6 text-base bg-transparent"
            >
              Explore Screener
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
