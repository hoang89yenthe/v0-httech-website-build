"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";
import { HeroImage } from "./hero-image";
import { useLanguage } from "@/components/language-provider";
import { t } from "@/lib/i18n";

const BRANDS = "Siemens, ABB, Mitsubishi, Schneider";

export function HeroSection() {
  const { locale } = useLanguage();
  const tr = t(locale).hero;

  const trustBadges = [
    { icon: ShieldCheck, text: tr.badge1 },
    { icon: Truck,       text: tr.badge2 },
    { icon: Headphones,  text: tr.badge3 },
  ];

  return (
    <section
      aria-label="Giới thiệu HT TECH"
      className="relative min-h-[92vh] flex items-center bg-slate-950 text-white overflow-hidden"
    >
      {/* Aurora orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.22 255) 0%, transparent 70%)", animation: "orb-1 12s ease-in-out infinite" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.22 290) 0%, transparent 70%)", animation: "orb-2 16s ease-in-out infinite" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.18 200) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-28 lg:py-0 min-h-[92vh] lg:min-h-0 lg:h-[92vh]">

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-5 self-start"
              style={{ animation: "hero-in 0.3s cubic-bezier(0,0,0.2,1) 0ms both" }}>
              <span className="w-5 h-px bg-primary" />
              <span className="text-[11px] font-medium text-primary uppercase tracking-[0.08em]">
                {tr.label}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold mb-5"
              style={{ animation: "hero-in 0.4s cubic-bezier(0,0,0.2,1) 80ms both" }}>
              {tr.line1}<br />{tr.line2}<br />
              <span className="text-shimmer">{tr.line3}</span>
            </h1>

            <p className="text-base text-white/65 mb-8 max-w-[400px]"
              style={{ animation: "hero-in 0.35s cubic-bezier(0,0,0.2,1) 160ms both" }}>
              {tr.subtitle.split("{brands}")[0]}
              <strong className="text-white/85 font-medium">{BRANDS}</strong>
              {tr.subtitle.split("{brands}")[1]}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8"
              style={{ animation: "hero-in 0.3s cubic-bezier(0,0,0.2,1) 240ms both" }}>
              <Link href="/san-pham"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-85 active:scale-[0.97] transition-all duration-200 shadow-md shadow-primary/20">
                {tr.ctaProducts}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/#contact"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-medium transition-colors duration-200">
                {tr.ctaQuote}
              </Link>
            </div>

            <ul className="flex flex-wrap gap-4" role="list" aria-label={locale === "vi" ? "Cam kết dịch vụ" : "Service commitments"}
              style={{ animation: "hero-in 0.3s cubic-bezier(0,0,0.2,1) 320ms both" }}>
              {trustBadges.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-white/45 text-xs">
                  <Icon className="w-3.5 h-3.5 text-primary/70 shrink-0" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <HeroImage />
        </div>
      </div>
    </section>
  );
}
