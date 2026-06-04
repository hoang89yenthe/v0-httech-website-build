import vi from "./vi";
import en from "./en";

export type Locale = "vi" | "en";
export type Translations = typeof vi;

export const LOCALE_COOKIE = "httech_locale";
export const DEFAULT_LOCALE: Locale = "vi";

const map = { vi, en } as const;

export function t(locale: Locale): Translations {
  return map[locale];
}
