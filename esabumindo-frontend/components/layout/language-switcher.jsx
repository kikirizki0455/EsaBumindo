import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../../hooks/use-translation";
import { Globe, ChevronDown } from "lucide-react";

export default function LanguageSwitcher({ variant = "dropdown" }) {
  const { locale, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "id", name: "Indonesia", flag: "🇮🇩" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  // VARIANT 1: DROPDOWN (Default)
  if (variant === "dropdown") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#060771] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Globe className="w-4 h-4 text-[#060771]" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  locale === lang.code
                    ? "bg-[#060771]/5 text-[#060771]"
                    : "text-gray-700"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {locale === lang.code && (
                  <span className="ml-auto w-2 h-2 bg-[#ff4136] rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // VARIANT 2: TOGGLE BUTTONS
  if (variant === "toggle") {
    return (
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              locale === lang.code
                ? "bg-[#060771] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {lang.flag} {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // VARIANT 3: COMPACT FLAG ONLY
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-all duration-200 ${
              locale === lang.code
                ? "bg-[#060771]/10 ring-2 ring-[#060771] scale-110"
                : "hover:bg-gray-100 opacity-60 hover:opacity-100"
            }`}
            title={lang.name}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  return null;
}
