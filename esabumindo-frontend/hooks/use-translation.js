import { useLanguage } from "../contexts/language-context";

export function useTranslation() {
  const { t, locale, changeLanguage, isHydrated } = useLanguage();

  return {
    t,
    locale,
    changeLanguage,
    isHydrated,
  };
}
