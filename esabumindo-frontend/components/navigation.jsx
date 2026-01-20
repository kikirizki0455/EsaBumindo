import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Menggunakan Link dari Next.js untuk routing internal
import { useTranslation } from "@/hooks/use-translation"; // Sesuaikan path hook Anda
import LanguageSwitcher from "@/components/layout/language-switcher"; // Sesuaikan path component Anda

const Navigation = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define Nav Items with Translation Logic
  // Kita mendefinisikan ini di dalam komponen agar bisa akses 't'
  const navItems = [
    {
      name: t("common.nav.home"),
      href: "/",
    },
    {
      name: t("common.nav.products"),
      href: "/products", // Sesuaikan route
      dropdown: [
        {
          name: t("common.nav.services.consulting"),
          href: "/products#consulting",
        },
        { name: t("common.nav.services.training"), href: "/products#training" },
        {
          name: t("common.nav.services.certification"),
          href: "/products#certification",
        },
      ],
    },
    {
      name: t("common.nav.about"),
      href: "/about",
    },
    {
      name: t("common.nav.articles"),
      href: "/articles",
    },
    {
      name: t("common.nav.contact"),
      href: "/contact",
    },
  ];

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
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
              <span>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/asset/image/esabumindo.svg" // Pastikan path logo benar
                  alt="Esabumindo Logo"
                  width={125}
                  height={40} // Beri height agar tidak layout shift
                  className="w-auto h-10 md:h-12" // Responsive size
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <div
                  key={item.href} // Gunakan href sebagai key jika unik
                  className="relative"
                  onMouseEnter={() =>
                    item.dropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 text-gray-700 font-medium hover:text-[#060771] transition-colors duration-200 relative group"
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200 group-hover:rotate-180"
                      />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#060771] to-[#ff4136] group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                        activeDropdown === item.name
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      {item.dropdown.map((dropItem) => (
                        <Link
                          key={dropItem.href}
                          href={dropItem.href}
                          className="block px-4 py-3 text-gray-700 hover:bg-[#060771]/5 hover:text-[#060771] transition-colors duration-200 border-l-2 border-transparent hover:border-[#ff4136]"
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Actions (Lang Switcher & CTA) */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher variant="dropdown" />

              {/* CTA Button */}
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-[#060771] text-white font-medium rounded-lg hover:bg-[#ff4136] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t("common.nav.contact_us_btn") || "Hubungi Kami"}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
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

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100 shadow-lg">
            {navItems.map((item) => (
              <div key={item.name}>
                <div
                  className="flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-[#060771]/5 hover:text-[#060771] rounded-lg transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    if (item.dropdown) {
                      setActiveDropdown(
                        activeDropdown === item.name ? null : item.name
                      );
                    } else {
                      setIsOpen(false);
                      // Navigate manually if needed or wrap in Link if no dropdown
                    }
                  }}
                >
                  {/* Jika tidak ada dropdown, gunakan Link langsung */}
                  {!item.dropdown ? (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="flex-1">{item.name}</span>
                  )}

                  {item.dropdown && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Mobile Dropdown */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="ml-4 mt-1 space-y-1 bg-gray-50 rounded-lg">
                    {item.dropdown.map((dropItem) => (
                      <Link
                        key={dropItem.name}
                        href={dropItem.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-[#060771] hover:bg-[#060771]/10 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {dropItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-gray-100 my-2 pt-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-gray-600 text-sm">
                  {t("common.language") || "Language"}
                </span>
                <LanguageSwitcher variant="dropdown" />
              </div>
            </div>

            {/* Mobile CTA Button */}
            <Link
              href="/contact"
              className="block mt-4 px-4 py-3 bg-gradient-to-r from-[#060771] to-[#ff4136] text-white font-medium text-center rounded-lg hover:shadow-lg transform active:scale-95 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {t("common.nav.contact_us_btn") || "Hubungi Kami"}
            </Link>

            {/* Mobile Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <a
                href="tel:+62123456789"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#060771]"
              >
                <Phone size={16} />
                <span>+62 123 456 789</span>
              </a>
              <a
                href="mailto:info@esabumindo.com"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#060771]"
              >
                <Mail size={16} />
                <span>info@esabumindo.com</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
