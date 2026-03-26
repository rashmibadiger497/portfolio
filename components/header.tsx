"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  BarChart3,
  LineChart,
  Briefcase,
  Newspaper,
  Zap,
  TrendingUp,
  Telescope,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "Products",
    href: "#",
    children: [
      { label: "Stock Screener", href: "/screener", icon: BarChart3 },
      { label: "Charts & Analysis", href: "/stock/RELIANCE", icon: LineChart },
      { label: "Strategy Tester", href: "/portfolio", icon: Cpu },
    ],
  },
  {
    label: "Tools",
    href: "#",
    children: [
      { label: "Technical Analysis", href: "/stock/TCS", icon: TrendingUp },
      { label: "Portfolio Tracker", href: "/portfolio", icon: Briefcase },
      { label: "Market Scanner", href: "/screener", icon: Telescope },
    ],
  },
  { label: "Screener", href: "/screener" },
  { label: "News", href: "#news" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="flex items-center justify-between px-6 py-3 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse-glow" />
            <Zap className="w-5 h-5 text-primary relative z-10" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Nova<span className="text-primary">Star</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
                >
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 glass-strong rounded-lg py-2 shadow-2xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                      >
                        <child.icon className="w-4 h-4 text-primary" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-5">
              Sign up free
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-strong border-t border-border">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full py-3 text-sm text-muted-foreground"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.label ? null : link.label
                      )
                    }
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="flex flex-col pl-4 gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <child.icon className="w-4 h-4 text-primary" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-3 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign up free
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
