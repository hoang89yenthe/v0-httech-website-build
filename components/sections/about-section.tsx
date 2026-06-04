"use client";

import { useLanguage } from "@/components/language-provider";
import { t } from "@/lib/i18n";

const brands = ["Siemens", "ABB", "Mitsubishi", "Schneider", "Omron", "Delta", "LS Electric", "Phoenix Contact"];

export function AboutSection() {
  const { locale } = useLanguage();
  const tr = t(locale).about;

  return (
    <section id="about" aria-labelledby="about-heading" className="pt-16 pb-14 md:pt-20 md:pb-18 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 id="about-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {tr.heading}<br />
            <span className="text-primary">{tr.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">{tr.body}</p>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" role="list" aria-label={tr.statsLabel}>
          {tr.stats.map(({ value, label }) => (
            <li key={label} className="text-center p-5 rounded-2xl bg-muted/50 border border-border/40">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{label}</p>
            </li>
          ))}
        </ul>
      </div>

      <div aria-label={tr.brandLabel} className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex overflow-hidden">
          {[0, 1].map((i) => (
            <ul key={i} className="animate-marquee flex shrink-0 gap-4 pr-4" role="list" aria-hidden="true">
              {brands.map((brand) => (
                <li key={brand} className="shrink-0">
                  <span className="inline-block px-6 py-2.5 bg-background border border-border rounded-full text-sm font-medium whitespace-nowrap">
                    {brand}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <p className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-4 py-2 rounded-full">
            {tr.cert}
          </span>
        </p>
      </div>
    </section>
  );
}
