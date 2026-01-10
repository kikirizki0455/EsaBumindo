import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Beranda", href: "/home" },

    {
      name: "Product",
      href: "#services",
      dropdown: [
        { name: "Konsultasi Bisnis", href: "#konsultasi" },
        { name: "Pelatihan & Workshop", href: "#pelatihan" },
        { name: "Sertifikasi", href: "#sertifikasi" },
      ],
    },
    { name: "Tentang Kami", href: "/about" },
    { name: "artikel", href: "/article" },
    { name: "Kontak", href: "/contact" },
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
            <div className="shrink">
              <a href="#home" className="flex items-center gap-2 group">
                <Image
                  src="/asset/image/esabumindo.svg"
                  alt="Lem Adhesive Terbaik"
                  width={125}
                  height={0}
                  className="mt-4"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.dropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 font-medium hover:text-[#060771] transition-colors duration-200 relative group"
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200 group-hover:rotate-180"
                      />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-[#060771] to-[#ff4136] group-hover:w-full transition-all duration-300"></span>
                  </a>

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
                        <a
                          key={dropItem.name}
                          href={dropItem.href}
                          className="block px-4 py-3 text-gray-700 hover:bg-[#060771]/5 hover:text-[#060771] transition-colors duration-200 border-l-2 border-transparent hover:border-[#ff4136]"
                        >
                          {dropItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <a
                href="/contact"
                className="px-6 py-2.5 bg-[#060771] text-white font-medium rounded-lg hover:bg-[#ff4136] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Hubungi kami
              </a>
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
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 font-medium hover:bg-[#060771]/5 hover:text-[#060771] rounded-lg transition-colors duration-200"
                  onClick={() => !item.dropdown && setIsOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveDropdown(
                            activeDropdown === item.name ? null : item.name
                          );
                        }}
                      />
                    )}
                  </div>
                </a>

                {/* Mobile Dropdown */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((dropItem) => (
                      <a
                        key={dropItem.name}
                        href={dropItem.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-[#060771] hover:bg-[#060771]/5 rounded-lg transition-colors duration-200 border-l-2 border-transparent hover:border-[#ff4136]"
                        onClick={() => setIsOpen(false)}
                      >
                        {dropItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile CTA Button */}
            <a
              href="#consultation"
              className="block mt-4 px-4 py-3 bg-linear-to-r from-[#060771] to-[#ff4136] text-white font-medium text-center rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Konsultasi Gratis
            </a>

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
