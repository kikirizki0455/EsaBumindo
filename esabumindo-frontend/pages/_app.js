import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { ToastProvider } from "@/components/ui/toast-context";
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
    return (
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    );
  }

  // 🌍 PUBLIC: pakai LanguageProvider dan ToastProvider dengan initial translations
  return (
    <LanguageProvider initialTranslations={initialTranslations}>
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
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
