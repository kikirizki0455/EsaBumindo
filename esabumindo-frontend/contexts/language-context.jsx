import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const LanguageContext = createContext();

export { LanguageContext };

export function LanguageProvider({ children, initialTranslations = {} }) {
  const router = useRouter();
  const { locale, locales, defaultLocale, pathname, query, asPath } = router;
  const [translations, setTranslations] = useState(initialTranslations);
  const [isHydrated, setIsHydrated] = useState(false);

  // Set hydrated flag setelah component mount di client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (locale && isHydrated) {
      loadTranslations(locale);
    }
  }, [locale, pathname, isHydrated]);

  const loadTranslations = async (lang) => {
    try {
      const common = await import(`../locales/${lang}/common.json`);

      let combined = {
        common: common.default,
      };

      const currentPath = pathname === "" ? "/" : pathname;

      if (currentPath === "/") {
        const home = await import(`../locales/${lang}/home.json`);
        combined = {
          ...combined,
          home: home.default,
        };
      } else if (currentPath.includes("/about")) {
        const about = await import(`../locales/${lang}/about.json`);
        combined = {
          ...combined,
          ...about.default,
        };
      }

      setTranslations(combined);
    } catch (error) {
      console.warn(`Failed to load translations for ${lang}:`, error);
      setTranslations(initialTranslations);
    }
  };

  const changeLanguage = (newLocale) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        locales,
        defaultLocale,
        changeLanguage,
        t,
        translations,
        isHydrated,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
