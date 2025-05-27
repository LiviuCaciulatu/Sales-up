"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Translations = Record<string, string>;

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const languageFiles: Record<string, () => Promise<Translations>> = {
  en: () => import('../../public/locales/en/translation.json').then(m => m.default),
  ro: () => import('../../public/locales/ro/translation.json').then(m => m.default),
  de: () => import('../../public/locales/de/translation.json').then(m => m.default),
  it: () => import('../../public/locales/it/translation.json').then(m => m.default),
  fr: () => import('../../public/locales/fr/translation.json').then(m => m.default),
  es: () => import('../../public/locales/es/translation.json').then(m => m.default),
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<string>("en");
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem("lang") : null;
    if (storedLang && languageFiles[storedLang]) {
      setLanguageState(storedLang);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("lang", language);
    }
    if (languageFiles[language]) {
      languageFiles[language]().then(setTranslations);
    }
  }, [language]);

  const setLanguage = (lang: string) => {
    if (languageFiles[lang]) setLanguageState(lang);
  };

  const t = (key: string) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
