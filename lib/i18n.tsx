"use client";

// ─────────────────────────────────────────────────────────────────
// i18n — bilingual (EN / JA) language context
// Everything on the site reads through this so a single toggle
// re-renders the entire page in the other language. Extend a language
// by adding a key to `Lang` and a field to every `Bi` object.
// ─────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bi, type Bi, type Lang } from "./bi";

// Re-export the server-safe primitives so client code can keep importing
// them from "@/lib/i18n" as before.
export { bi };
export type { Bi, Lang };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Resolve a bilingual value to the active language. */
  t: (v: Bi) => string;
};

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "dll-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore saved preference (or infer from the browser) after mount so
  // the server/client first paint agree, then upgrade to the real choice.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "ja") {
        setLangState(saved);
      } else if (typeof navigator !== "undefined" && navigator.language.startsWith("ja")) {
        setLangState("ja");
      }
    } catch {
      /* localStorage blocked — stay on default */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: setLangState,
      toggle: () => setLangState((p) => (p === "en" ? "ja" : "en")),
      t: (v: Bi) => (v ? v[lang] : ""),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
