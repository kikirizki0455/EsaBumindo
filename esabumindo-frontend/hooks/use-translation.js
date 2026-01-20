import { useLanguage } from "../contexts/language-context";

export function useTranslation() {
  const { t, locale, changeLanguage } = useLanguage();

  return {
    t,
    locale,
    changeLanguage,
  };
}
