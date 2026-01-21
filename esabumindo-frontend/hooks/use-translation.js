import { useLanguage } from "../contexts/language-context";

export function useTranslation() {
  const { t, locale, changeLanguage, isLoading } = useLanguage();

  return {
    t,
    locale,
    changeLanguage,
    isLoading, // ✅ Expose loading state
  };
}
