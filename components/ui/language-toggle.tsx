"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
      aria-label={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold
        border border-border/60 text-foreground/70 hover:text-foreground hover:bg-muted
        transition-colors duration-150 select-none"
    >
      <span className={locale === "vi" ? "opacity-100" : "opacity-40"}>VI</span>
      <span className="text-border/60">|</span>
      <span className={locale === "en" ? "opacity-100" : "opacity-40"}>EN</span>
    </button>
  );
}
