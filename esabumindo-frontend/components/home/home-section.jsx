import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import parse, { domToReact } from "html-react-parser";
import { memo } from "react";
import Link from "next/link";

// Use string path for better code splitting
const imgImagePt2 = "/asset/image/esabumindo-home.webp";

const components = {
  blue: "text-[#060771]",
  red: "text-[#ff4136]",
  gray: "text-gray-800",
};

const renderTitle = (text) =>
  parse(text, {
    replace: (domNode) => {
      if (domNode.type === "tag" && components[domNode.name]) {
        return (
          <span className={components[domNode.name]}>
            {domToReact(domNode.children)}
          </span>
        );
      }
    },
  });

export const HomeSection = memo(function HomeSection() {
  const { t, isHydrated } = useTranslation();

  // Skeleton loading
  if (!isHydrated) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded-full w-40 animate-pulse" />
              <div className="h-14 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-100 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-12 bg-gray-100 rounded w-32 animate-pulse" />
              </div>
            </div>
            <div className="h-[400px] bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50"
      id="about"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <div className="max-w-2xl">
              {/* Section Label */}
              <div className="inline-block mb-4 md:mb-6">
                <span className="text-[#060771] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-[#060771]/10 rounded-full">
                  {t("home.homeSection.title")}
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] leading-tight font-bold mb-4 md:mb-6">
                {renderTitle(t("home.homeSection.heroTitle"))}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-8">
                {t("home.homeSection.description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/product"
                  className="bg-[#060771] hover:bg-[#060771]/90 text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 shadow-lg uppercase tracking-wide text-sm md:text-base text-center"
                >
                  {t("home.homeSection.ctaPrimary")}
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-[#060771] text-[#060771] hover:bg-[#060771] hover:text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 uppercase tracking-wide text-sm md:text-base text-center"
                >
                  {t("home.homeSection.ctaSecondary")}
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 md:pt-8 border-t border-gray-200">
              <StatItem
                value="15+"
                label={t("home.homeSection.stats.experience")}
                color="060771"
              />
              <StatItem
                value="500+"
                label={t("home.homeSection.stats.projects")}
                color="ff4136"
              />
              <StatItem
                value="100%"
                label={t("home.homeSection.stats.satisfaction")}
                color="060771"
              />
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Decorative elements - hidden on mobile */}
              <div className="hidden md:block absolute -top-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[#060771]/10 rounded-tl-[60px] rounded-br-[60px] -z-10" />
              <div className="hidden md:block absolute -bottom-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-[#ff4136]/10 rounded-tl-[60px] rounded-br-[60px] -z-10" />

              <div className="relative rounded-tl-[80px] sm:rounded-tl-[120px] md:rounded-tl-[150px] rounded-br-[80px] sm:rounded-br-[120px] md:rounded-br-[150px] overflow-hidden shadow-2xl">
                <Image
                  src={imgImagePt2}
                  alt="Industrial Worker - Professional Manufacturing"
                  width={550}
                  height={500}
                  className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-cover"
                  loading="lazy"
                  quality={75}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Memoized StatItem component
const StatItem = memo(function StatItem({ value, label, color }) {
  return (
    <div className="text-center lg:text-left">
      <div
        className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#${color}] mb-1`}
      >
        {value}
      </div>
      <div className="text-xs md:text-sm text-gray-600">{label}</div>
    </div>
  );
});
