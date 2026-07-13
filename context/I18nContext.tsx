"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLang, Translation, TRANSLATIONS, t as translate, I18nKeys } from "@/lib/i18n";

interface I18nCtx {
  lang: SupportedLang;
  setLang: (l: SupportedLang) => void;
  t: (key: I18nKeys) => string;
  tr: Translation;
}

const Ctx = createContext<I18nCtx | null>(null);
const STORAGE_KEY = "aharrie_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLang | null;
    if (saved && TRANSLATIONS[saved]) setLangState(saved);
  }, []);

  function setLang(l: SupportedLang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <Ctx.Provider value={{
      lang,
      setLang,
      t: (key: I18nKeys) => translate(lang, key),
      tr: TRANSLATIONS[lang],
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
