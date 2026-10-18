"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import bn from "@/locales/bn.json";
import mr from "@/locales/mr.json";
import te from "@/locales/te.json";
import ta from "@/locales/ta.json";
import gu from "@/locales/gu.json";
import ur from "@/locales/ur.json";
import kn from "@/locales/kn.json";

export type SupportedLanguage = "en" | "hi" | "bn" | "mr" | "te" | "ta" | "gu" | "ur" | "kn";

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "mr", label: "Marathi", nativeName: "मराठी", dir: "ltr" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr" },
  { code: "ur", label: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "kn", label: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" }
];

const TRANSLATIONS: Record<SupportedLanguage, any> = {
  en,
  hi,
  bn,
  mr,
  te,
  ta,
  gu,
  ur,
  kn
};

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  language: SupportedLanguage; // Alias for backward compatibility
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "hunar_language";
const LEGACY_STORAGE_KEY = "hunar_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>("en");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage or navigator
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY)) as SupportedLanguage | null;

      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setCurrentLanguageState(stored);
        applyDocumentDirection(stored);
        return;
      }

      // Browser language fallback detection
      if (typeof navigator !== "undefined" && navigator.language) {
        const browserCode = navigator.language.split("-")[0]?.toLowerCase() as SupportedLanguage;
        if (SUPPORTED_LANGUAGES.some((l) => l.code === browserCode)) {
          setCurrentLanguageState(browserCode);
          applyDocumentDirection(browserCode);
          localStorage.setItem(STORAGE_KEY, browserCode);
          localStorage.setItem(LEGACY_STORAGE_KEY, browserCode);
          return;
        }
      }

      applyDocumentDirection("en");
    } catch {
      applyDocumentDirection("en");
    }
  }, []);

  const applyDocumentDirection = (lang: SupportedLanguage) => {
    if (typeof document !== "undefined") {
      const isUrdu = lang === "ur";
      document.documentElement.setAttribute("dir", isUrdu ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
      if (isUrdu) {
        document.documentElement.classList.add("lang-rtl");
      } else {
        document.documentElement.classList.remove("lang-rtl");
      }
    }
  };

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === lang)) return;
    setCurrentLanguageState(lang);
    applyDocumentDirection(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(LEGACY_STORAGE_KEY, lang);
    } catch {
      // ignore storage failure in SSR/sandboxed mode
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    // Quick toggle between en and hi for legacy components
    setLanguage(currentLanguage === "en" ? "hi" : "en");
  }, [currentLanguage, setLanguage]);

  const isRTL = currentLanguage === "ur";
  const dir: "ltr" | "rtl" = isRTL ? "rtl" : "ltr";

  // Nested key resolver
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const getNested = (obj: any, path: string) => {
        if (!obj || typeof obj !== "object") return undefined;
        const parts = path.split(".");
        let curr = obj;
        for (const part of parts) {
          if (curr == null || typeof curr !== "object") return undefined;
          curr = curr[part];
        }
        return typeof curr === "string" ? curr : undefined;
      };

      // 1. Check current locale
      const currentDict = TRANSLATIONS[currentLanguage];
      const match = getNested(currentDict, key);
      if (match) return match;

      // 2. Fallback to English
      if (currentLanguage !== "en") {
        const enDict = TRANSLATIONS.en;
        const enMatch = getNested(enDict, key);
        if (enMatch) return enMatch;
      }

      // 3. Fallback parameter
      if (fallback !== undefined) return fallback;

      // 4. Fallback to key itself
      return key;
    },
    [currentLanguage]
  );

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      currentLanguage,
      language: currentLanguage,
      setLanguage,
      toggleLanguage,
      t,
      isRTL,
      dir,
      languages: SUPPORTED_LANGUAGES
    }),
    [currentLanguage, setLanguage, toggleLanguage, t, isRTL, dir]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={dir} className="w-full min-h-full">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
