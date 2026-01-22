import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { loadTranslationsForPath } from "../lib/utils";

export default function App({
  Component,
  pageProps,
  initialTranslations = {},
}) {
  const getLayout = Component.getLayout || ((page) => page);
  const isAdminPage = Component.isAdmin === true;

  // 🔒 ADMIN: tanpa LanguageProvider
  if (isAdminPage) {
    return getLayout(<Component {...pageProps} />);
  }

  // 🌍 PUBLIC: pakai LanguageProvider dengan initial translations
  return (
    <LanguageProvider initialTranslations={initialTranslations}>
      {getLayout(<Component {...pageProps} />)}
    </LanguageProvider>
  );
}

// Load initial translations untuk semua pages
App.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const { locale = "id", pathname = "/" } = ctx;

  let initialTranslations = {};

  try {
    initialTranslations = await loadTranslationsForPath(locale, pathname);
  } catch (error) {
    console.warn("Failed to load initial translations:", error);
  }

  return {
    initialTranslations,
  };
};
