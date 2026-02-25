import dynamic from "next/dynamic";
import { memo } from "react";

// Lazy load Navigation - critical tapi bisa di-optimize
const Navigation = dynamic(() => import("@/components/navigation"), {
  ssr: true,
  loading: () => (
    <nav className="sticky top-0 z-50 bg-white h-16 md:h-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="hidden md:flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-4 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded md:hidden animate-pulse" />
      </div>
    </nav>
  ),
});

// Lazy load Footer - below the fold, tidak perlu SSR
const Footer = dynamic(() => import("@/pages/footer"), {
  ssr: false,
  loading: () => (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-32" />
          <div className="h-4 bg-slate-800 rounded w-48" />
        </div>
      </div>
    </footer>
  ),
});

function MainLayout({ children }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default memo(MainLayout);
