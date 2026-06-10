import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { memo } from "react";

const imgImagePt3 = "/asset/image/esabumindo-factory 1.webp";

export const LevelSection = memo(function LevelSection() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="hidden md:block absolute top-20 left-0 w-72 h-72 bg-[#ff4136]/5 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-20 right-0 w-72 h-72 bg-[#060771]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative rounded-tl-[60px] sm:rounded-tl-[100px] md:rounded-tl-[155px] overflow-hidden shadow-2xl">
                <Image
                  src={imgImagePt3}
                  alt="Industrial Tanks - ESABOND Chemical Solutions"
                  width={520}
                  height={480}
                  className="w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] object-cover"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ff4136]/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#ff4136]" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#060771]">
                        98%
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("home.levelSection.stats.performance")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
            <div className="max-w-2xl">
              <div className="inline-block mb-4 md:mb-6">
                <span className="text-[#ff4136] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-[#ff4136]/10 rounded-full flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t("home.levelSection.badge")}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight font-bold mb-6 md:mb-8">
                <span className="text-[#ff4136]">
                  {t("home.levelSection.title.line1")}
                </span>
                <br />
                <span className="text-gray-800">
                  {t("home.levelSection.title.line2")}
                </span>
                <br />
                <span className="text-[#060771]">
                  {t("home.levelSection.title.line3")}
                </span>
              </h2>

              <div className="h-1 w-full bg-gradient-to-r from-[#ff4136] via-[#ff4136]/50 to-transparent rounded-full mb-6 md:mb-8" />

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg mb-6 md:mb-8">
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                  {t("home.levelSection.description.text1")}
                </p>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800 font-medium mt-3">
                  {t("home.levelSection.description.text2")}{" "}
                  <span className="text-[#060771] font-bold">
                    {t("home.levelSection.description.brand")}
                  </span>{" "}
                  {t("home.levelSection.description.text3")}
                </p>
              </div>

              {/* ✅ FIX: Gunakan full class string, bukan template dinamis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
                <FeatureItem
                  bgClass="bg-[#ff4136]/10"
                  textClass="text-[#ff4136]"
                  title={t("home.levelSection.features.performance.title")}
                  subtitle={t(
                    "home.levelSection.features.performance.subtitle"
                  )}
                />
                <FeatureItem
                  bgClass="bg-[#060771]/10"
                  textClass="text-[#060771]"
                  title={t("home.levelSection.features.efficiency.title")}
                  subtitle={t("home.levelSection.features.efficiency.subtitle")}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href="/product"
                  className="group bg-[#ff4136] hover:bg-[#ff4136]/90 text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 shadow-lg uppercase tracking-wide text-sm md:text-base flex items-center justify-center gap-2"
                >
                  {t("home.levelSection.cta.primary")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-gray-50 border-2 border-[#ff4136] text-[#ff4136] font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 uppercase tracking-wide text-sm md:text-base text-center"
                >
                  {t("home.levelSection.cta.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ✅ FIX: Props berubah dari `color` ke `bgClass` dan `textClass`
const FeatureItem = memo(function FeatureItem({
  bgClass,
  textClass,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4 shadow-sm">
      <div
        className={`w-8 h-8 ${bgClass} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}
      >
        <svg
          className={`w-5 h-5 ${textClass}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <div className="font-semibold text-gray-800 text-sm md:text-base">
          {title}
        </div>
        <div className="text-xs md:text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>
    </div>
  );
});
