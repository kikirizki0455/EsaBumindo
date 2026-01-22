import { useContext } from "react";
import { LanguageContext } from "@/contexts/language-context";
import idArticle from "@/locales/id/article.json";
import enArticle from "@/locales/en/article.json";

export function useArticleTranslation() {
  const { locale } = useContext(LanguageContext); // ✅ Ganti language jadi locale
  const lang = locale || "id"; // ✅ locale dari LanguageContext

  // Translation map
  const articlesTranslation = {
    id: idArticle,
    en: enArticle,
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = articlesTranslation[lang];

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(
          `❌ Translation key not found: "${key}" in language "${lang}"`
        );
        return key;
      }
    }

    // If value is still an object, something went wrong
    if (typeof value === "object") {
      console.warn(
        `⚠️ Translation key "${key}" points to an object, not a string`
      );
      return key;
    }

    return value || key;
  };

  return { t, lang };
}
