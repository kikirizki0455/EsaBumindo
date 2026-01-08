import "@/styles/globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/pages/footer";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* <Navigation /> */}
      <Component {...pageProps} />
      {/* <Footer /> */}
    </>
  );
}
