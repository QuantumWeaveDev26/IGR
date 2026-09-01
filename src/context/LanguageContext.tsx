import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, UiLanguage, Translations } from '../lib/translations';

interface LanguageContextType {
  language: UiLanguage;
  setLanguage: (lang: UiLanguage) => void;
  t: Translations;
}

const STORAGE_KEY = 'igr_ui_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<UiLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'kn') {
        return stored;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: UiLanguage) => {
    if (lang !== 'en' && lang !== 'kn') return;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside LanguageProvider
    return {
      language: 'en',
      setLanguage: () => {},
      t: translations.en
    };
  }
  return context;
};
