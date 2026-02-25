import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { ToastProvider } from "@/components/ui/toast-context";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const isAdminPage = Component.isAdmin === true;

  // 🔒 ADMIN: tanpa LanguageProvider
  if (isAdminPage) {
    return (
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    );
  }

  // 🌍 PUBLIC: pakai LanguageProvider dan ToastProvider
  return (
    <LanguageProvider>
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    </LanguageProvider>
  );
}
