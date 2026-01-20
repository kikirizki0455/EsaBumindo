import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const router = useRouter();
  const { locale, locales, defaultLocale, pathname, query, asPath } = router;
  const [translations, setTranslations] = useState({});

  // Load translations when locale changes
  useEffect(() => {
    loadTranslations(locale);
  }, [locale]);

  const loadTranslations = async (lang) => {
    try {
      // Load common translations (dipakai di semua halaman)
      const common = await import(`../locales/${lang}/common.json`);

      // Detect current page and load specific translations
      let specific = {};
      if (pathname.includes("/about") || pathname === "/") {
        const about = await import(`../locales/${lang}/about.json`);
        specific = { ...about };
      }
      // Tambahkan kondisi untuk halaman lain di sini
      // if (pathname.includes('/products')) {
      //   const products = await import(`../locales/${lang}/products.json`);
      //   specific = { ...products };
      // }

      setTranslations({
        common: common.default,
        ...specific,
      });
    } catch (error) {
      console.error("Error loading translations:", error);
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
        return key; // Return key if translation not found
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
