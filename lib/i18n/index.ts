import { en, I18nKeys, Translation } from "./en";
import { yo } from "./yo";
import { ha } from "./ha";
import { fr } from "./fr";
import { ig } from "./ig";

export type { I18nKeys, Translation };
export type SupportedLang = "en" | "yo" | "ha" | "fr" | "ig";

export const TRANSLATIONS: Record<SupportedLang, Translation> = { en, yo, ha, fr, ig };

export const LANG_OPTIONS: Array<{ code: SupportedLang; label: string; flag: string }> = [
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "yo", label: "Yorùbá",   flag: "🇳🇬" },
  { code: "ha", label: "Hausa",    flag: "🇳🇬" },
  { code: "ig", label: "Igbo",     flag: "🇳🇬" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export function t(lang: SupportedLang, key: I18nKeys): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

export { en };
