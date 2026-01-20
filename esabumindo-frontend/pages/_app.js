import "@/styles/globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/pages/footer";
import "../styles/globals.css";
import { LanguageProvider } from "../contexts/language-context";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
