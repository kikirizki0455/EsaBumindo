import Navigation from "@/components/navigation";
import Footer from "@/pages/footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
