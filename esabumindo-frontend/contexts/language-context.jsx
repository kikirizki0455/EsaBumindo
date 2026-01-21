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
      const common = await import(`../locales/${lang}/common.json`);

      // Inisialisasi dengan data common
      let combined = {
        common: common.default,
      };

      // LOGIKA PENGECEKAN PATH YANG LEBIH AKURAT
      // Kita gunakan normalisasi path untuk memastikan "/" terdeteksi dengan benar
      const currentPath = pathname === "" ? "/" : pathname;

      if (currentPath === "/") {
        // KHUSUS HALAMAN HOME
        const home = await import(`../locales/${lang}/home.json`);

        combined = {
          ...combined,
          home: home.default, // Pakai key 'home' supaya t("home.hero...") jalan
        };

        console.log("Berhasil load data HOME"); // Cek di console browser
      } else if (currentPath.includes("/about")) {
        // KHUSUS HALAMAN ABOUT
        const about = await import(`../locales/${lang}/about.json`);

        combined = {
          ...combined,
          ...about.default, // Sesuai kebutuhan komponen About kamu
        };

        console.log("Berhasil load data ABOUT");
      }

      setTranslations(combined);
    } catch (error) {
      console.error("Gagal load translation:", error);
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
