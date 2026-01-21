import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/language-context";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const isAdminPage = Component.isAdmin === true;

  // 🔒 ADMIN: tanpa LanguageProvider
  if (isAdminPage) {
    return getLayout(<Component {...pageProps} />);
  }

  // 🌍 PUBLIC: pakai LanguageProvider
  return (
    <LanguageProvider>
      {getLayout(<Component {...pageProps} />)}
    </LanguageProvider>
  );
}
