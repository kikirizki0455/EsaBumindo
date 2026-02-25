import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/router";

const LanguageContext = createContext();

export { LanguageContext };

// Cache untuk translations - persist di memory
const translationsCache = new Map();

// Preload common translations
const preloadedTranslations = {
  id: null,
  en: null,
};

export function LanguageProvider({ children }) {
  const router = useRouter();
  const {
    locale = "id",
    locales,
    defaultLocale,
    pathname,
    query,
    asPath,
  } = router;
  const [translations, setTranslations] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate cache key
  const getCacheKey = useCallback((lang, path) => {
    const normalizedPath = path === "" ? "/" : path;
    return `${lang}:${normalizedPath}`;
  }, []);

  // Load translations dengan caching
  const loadTranslations = useCallback(
    async (lang, path) => {
      const cacheKey = getCacheKey(lang, path);

      // Check cache first
      if (translationsCache.has(cacheKey)) {
        setTranslations(translationsCache.get(cacheKey));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const currentPath = path === "" ? "/" : path;

        // Load common dan footer sekali saja (dengan caching)
        let common, footer;

        const commonCacheKey = `${lang}:common`;
        const footerCacheKey = `${lang}:footer`;

        if (translationsCache.has(commonCacheKey)) {
          common = translationsCache.get(commonCacheKey);
        } else {
          const commonModule = await import(`../locales/${lang}/common.json`);
          common = commonModule.default;
          translationsCache.set(commonCacheKey, common);
        }

        if (translationsCache.has(footerCacheKey)) {
          footer = translationsCache.get(footerCacheKey);
        } else {
          const footerModule = await import(`../locales/${lang}/footer.json`);
          footer = footerModule.default;
          translationsCache.set(footerCacheKey, footer);
        }

        let combined = {
          common,
          footer,
        };

        // Load page-specific translations
        if (currentPath === "/") {
          const home = await import(`../locales/${lang}/home.json`);
          combined.home = home.default;
        } else if (currentPath.includes("/about")) {
          const about = await import(`../locales/${lang}/about.json`);
          combined = { ...combined, ...about.default };
        } else if (currentPath.includes("/contact")) {
          const contact = await import(`../locales/${lang}/contact.json`);
          combined.contact = contact.default;
        } else if (
          currentPath.includes("/product") ||
          currentPath.includes("/pre-order")
        ) {
          const products = await import(`../locales/${lang}/products.json`);
          combined.products = products.default;
        } else if (currentPath.includes("/article")) {
          const article = await import(`../locales/${lang}/article.json`);
          combined.article = article.default;
        }

        // Cache the result
        translationsCache.set(cacheKey, combined);
        setTranslations(combined);
      } catch (error) {
        console.warn(`Failed to load translations for ${lang}:`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [getCacheKey]
  );

  // Set hydrated flag dan load translations saat mount
  useEffect(() => {
    setIsHydrated(true);
    loadTranslations(locale, pathname);
  }, []);

  // Load translations saat locale atau pathname berubah
  useEffect(() => {
    if (isHydrated) {
      loadTranslations(locale, pathname);
    }
  }, [locale, pathname, isHydrated, loadTranslations]);

  const changeLanguage = useCallback(
    (newLocale) => {
      router.push({ pathname, query }, asPath, { locale: newLocale });
    },
    [router, pathname, query, asPath]
  );

  const t = useCallback(
    (key, params = {}) => {
      const keys = key.split(".");
      let value = translations;

      for (const k of keys) {
        if (value && typeof value === "object") {
          value = value[k];
        } else {
          return key;
        }
      }

      if (!value) return key;

      // Support template interpolation
      if (typeof value === "string" && Object.keys(params).length > 0) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
          return params[paramName] !== undefined ? params[paramName] : match;
        });
      }

      return value;
    },
    [translations]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      locales,
      defaultLocale,
      changeLanguage,
      t,
      translations,
      isHydrated: isHydrated && !isLoading,
    }),
    [
      locale,
      locales,
      defaultLocale,
      changeLanguage,
      t,
      translations,
      isHydrated,
      isLoading,
    ]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
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
