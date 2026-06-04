"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type Locale, DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n";

interface LanguageCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const Ctx = createContext<LanguageCtx>({ locale: DEFAULT_LOCALE, setLocale: () => {} });

export function useLanguage() {
  return useContext(Ctx);
}

export function LanguageProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Đọc locale đã lưu từ cookie/localStorage khi mount
  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((r) => r.startsWith(LOCALE_COOKIE + "="))
      ?.split("=")[1] as Locale | undefined;
    if (saved === "vi" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    // Lưu vào cookie (đọc được server-side) — 1 năm
    document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;SameSite=Lax`;
  }, []);

  return <Ctx.Provider value={{ locale, setLocale }}>{children}</Ctx.Provider>;
}
