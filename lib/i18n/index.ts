import vi from "./vi";
import en from "./en";

export type Locale = "vi" | "en";

type DeepStringify<T> = T extends string
  ? string
  : T extends Array<infer U>
  ? Array<DeepStringify<U>>
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T;

export type Translations = DeepStringify<typeof vi>;

export const LOCALE_COOKIE = "httech_locale";
export const DEFAULT_LOCALE: Locale = "vi";

const map: Record<Locale, Translations> = { vi, en: en as unknown as Translations };

export function t(locale: Locale): Translations {
  return map[locale];
}
