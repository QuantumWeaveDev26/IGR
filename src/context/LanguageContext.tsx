import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations, { type Lang } from '../lib/translations';

const STORAGE_KEY = 'igr_ui_language';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'kn') return stored;
  } catch {}
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
    document.documentElement.lang = newLang;
  }, []);

  // Sync document.lang on mount
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[lang];
      if (dict && key in dict) return dict[key];
      // Fallback to English, then to the key itself
      const enDict = translations['en'];
      if (enDict && key in enDict) return enDict[key];
      return key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
