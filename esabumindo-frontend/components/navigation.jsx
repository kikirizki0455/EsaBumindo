import React, { useState, useEffect, memo, useCallback } from "react";
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import dynamic from "next/dynamic";

// Lazy load LanguageSwitcher - tidak critical untuk initial render
const LanguageSwitcher = dynamic(
  () => import("@/components/layout/language-switcher"),
  { ssr: false, loading: () => <div className="w-24 h-8" /> }
);

// Static nav items - tidak perlu re-create setiap render
const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "products", href: "/product" },
  { key: "about", href: "/about" },
  { key: "articles", href: "/article" },
  { key: "contact", href: "/contact" },
];

// Memoized TopBar untuk menghindari re-render
const TopBar = memo(function TopBar() {
  return (
    <div className="hidden md:block bg-[#060771] text-white">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <a
              href="tel:+62123456789"
              className="flex items-center gap-2 hover:text-[#ff4136] transition-colors"
            >
              <Phone size={14} />
              <span>+62 123 456 789</span>
            </a>
            <a
              href="mailto:info@esabumindo.com"
              className="flex items-center gap-2 hover:text-[#ff4136] transition-colors"
            >
              <Mail size={14} />
              <span>info@esabumindo.com</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>Tangerang, Indonesia</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized NavLink
const NavLink = memo(function NavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 text-gray-700 font-medium hover:text-[#060771] transition-colors duration-200 relative group"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#060771] to-[#ff4136] group-hover:w-full transition-all duration-300" />
    </Link>
  );
});

// Memoized MobileNavLink
const MobileNavLink = memo(function MobileNavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-gray-700 font-medium hover:bg-[#060771]/5 hover:text-[#060771] rounded-lg transition-colors duration-200"
    >
      {label}
    </Link>
  );
});

const Navigation = () => {
  const { t, isHydrated } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Optimized scroll handler dengan throttle
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setIsOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <>
      <TopBar />

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="group"
                aria-label="Esabumindo - Beranda"
              >
                <div className="relative w-28 md:w-32 lg:w-40 h-8 md:h-10 lg:h-12">
                  <Image
                    src="/asset/image/logo-esabumindo.svg"
                    alt="Esabumindo Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 160px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  href={item.href}
                  label={isHydrated ? t(`common.nav.${item.key}`) : ""}
                />
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher variant="dropdown" />
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-[#060771] text-white font-medium rounded-lg hover:bg-[#ff4136] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isHydrated ? t("common.nav.contact_us_btn") : "Hubungi Kami"}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={24} className="text-[#060771]" />
              ) : (
                <Menu size={24} className="text-[#060771]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Simplified */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <MobileNavLink
                  key={item.key}
                  href={item.href}
                  label={isHydrated ? t(`common.nav.${item.key}`) : ""}
                  onClick={closeMobileMenu}
                />
              ))}

              <div className="border-t border-gray-100 my-2 pt-2">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    {isHydrated ? t("common.language") : "Language"}
                  </span>
                  <LanguageSwitcher variant="dropdown" />
                </div>
              </div>

              <Link
                href="/contact"
                className="block mt-4 px-4 py-3 bg-gradient-to-r from-[#060771] to-[#ff4136] text-white font-medium text-center rounded-lg"
                onClick={closeMobileMenu}
              >
                {isHydrated ? t("common.nav.contact_us_btn") : "Hubungi Kami"}
              </Link>

              {/* Mobile Contact Info - Simplified */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <a
                  href="tel:+62123456789"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600"
                >
                  <Phone size={16} />
                  <span>+62 123 456 789</span>
                </a>
                <a
                  href="mailto:info@esabumindo.com"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600"
                >
                  <Mail size={16} />
                  <span>info@esabumindo.com</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default memo(Navigation);
