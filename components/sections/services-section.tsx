"use client";

import { Settings, Factory, Wrench, Headphones } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { t } from "@/lib/i18n";

const serviceIcons = [Settings, Factory, Wrench, Headphones];
const serviceStyles = [
  { gradient: "from-blue-500/10 to-blue-600/5",   iconBg: "bg-blue-500/10 group-hover:bg-blue-500",   iconColor: "text-blue-600 group-hover:text-white",   accent: "group-hover:border-blue-200" },
  { gradient: "from-violet-500/10 to-violet-600/5", iconBg: "bg-violet-500/10 group-hover:bg-violet-500", iconColor: "text-violet-600 group-hover:text-white", accent: "group-hover:border-violet-200" },
  { gradient: "from-amber-500/10 to-amber-600/5",  iconBg: "bg-amber-500/10 group-hover:bg-amber-500",  iconColor: "text-amber-600 group-hover:text-white",  accent: "group-hover:border-amber-200" },
  { gradient: "from-green-500/10 to-green-600/5",  iconBg: "bg-green-500/10 group-hover:bg-green-500",  iconColor: "text-green-600 group-hover:text-white",  accent: "group-hover:border-green-200" },
];

export function ServicesSection() {
  const { locale } = useLanguage();
  const tr = t(locale).services;

  return (
    <section id="services" aria-labelledby="services-heading" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10 md:mb-14">
          <h2 id="services-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {tr.heading}<br />
            <span className="text-primary">{tr.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">{tr.body}</p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label={tr.listLabel}>
          {tr.items.map((item, idx) => {
            const Icon = serviceIcons[idx];
            const s = serviceStyles[idx];
            return (
              <li key={item.title}>
                <article className={`group rounded-2xl bg-gradient-to-br ${s.gradient} border border-border/60 h-full p-6 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.10)] ${s.accent}`}>
                  <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center mb-5 transition-colors duration-200`} aria-hidden="true">
                    <Icon className={`w-5 h-5 ${s.iconColor} transition-colors duration-200`} />
                  </div>
                  <h3 className="text-sm font-semibold mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
