import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

export type Locale = "en" | "ar";

/** Add a language by dropping a JSON file next to these and listing it here. */
const DICTIONARIES: Record<Locale, typeof en> = { en, ar };

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: en.meta.name },
  { code: "ar", label: ar.meta.name },
];

type Vars = Record<string, string | number>;

type I18nValue = {
  locale: Locale;
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  /** Looks up a dotted key, e.g. t("home.title"), with {placeholder} substitution. */
  t: (key: string, vars?: Vars) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

/** Walks "a.b.c" through the dictionary. Returns the key itself when missing. */
function lookup(dictionary: unknown, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined,
      dictionary,
    );
  return typeof value === "string" ? value : key;
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Reads the device language once; anything that isn't Arabic falls back to English. */
function detectLocale(): Locale {
  try {
    const tag = new Intl.DateTimeFormat().resolvedOptions().locale ?? "en";
    return tag.toLowerCase().startsWith("ar") ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  const t = useCallback(
    (key: string, vars?: Vars) => interpolate(lookup(DICTIONARIES[locale], key), vars),
    [locale],
  );

  const value = useMemo<I18nValue>(
    () => ({ locale, isRTL: DICTIONARIES[locale].meta.dir === "rtl", setLocale, t }),
    [locale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside an <I18nProvider>.");
  return value;
}
