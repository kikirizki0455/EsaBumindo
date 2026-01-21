import Image from "next/image";
import imgImagePt3 from "@/public/asset/image/factory.webp";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function LevelSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#ff4136]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-[#060771]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-[#ff4136]/20 rounded-tl-[60px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[#060771]/20 rounded-br-[60px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>

              {/* Main Image Container */}
              <div className="relative rounded-tl-[60px] sm:rounded-tl-[100px] md:rounded-tl-[155px] overflow-hidden shadow-2xl ring-4 ring-white">
                <Image
                  src={imgImagePt3}
                  alt="Industrial Tanks - ESABOND Chemical Solutions"
                  className="w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] xl:h-[520px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff4136]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Stats Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#ff4136]/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#ff4136]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#060771]">
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
              {/* Section Label */}
              <div className="inline-block mb-4 md:mb-6">
                <span className="text-[#ff4136] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-[#ff4136]/10 rounded-full flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t("home.levelSection.badge")}
                </span>
              </div>

              {/* Main Heading - Mobile First Typography */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] leading-tight font-bold mb-6 md:mb-8">
                <span className="text-[#ff4136] inline-block transform hover:scale-105 transition-transform duration-300">
                  {t("home.levelSection.title.line1")}
                </span>
                <br />
                <span className="text-gray-800 inline-block transform hover:scale-105 transition-transform duration-300">
                  {t("home.levelSection.title.line2")}
                </span>
                <br />
                <span className="text-[#060771] inline-block transform hover:scale-105 transition-transform duration-300">
                  {t("home.levelSection.title.line3")}
                </span>
              </h2>

              {/* Decorative Divider */}
              <div className="relative mb-6 md:mb-8">
                <div className="h-1 w-full bg-gradient-to-r from-[#ff4136] via-[#ff4136]/50 to-transparent rounded-full"></div>
                <div className="absolute top-0 left-0 h-1 w-20 bg-[#ff4136] rounded-full animate-pulse"></div>
              </div>

              {/* Description Card */}
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

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
                <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-8 h-8 bg-[#ff4136]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-[#ff4136]"
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
                      {t("home.levelSection.features.performance.title")}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      {t("home.levelSection.features.performance.subtitle")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-8 h-8 bg-[#060771]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-[#060771]"
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
                      {t("home.levelSection.features.efficiency.title")}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      {t("home.levelSection.features.efficiency.subtitle")}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button className="group bg-[#ff4136] hover:bg-[#ff4136]/90 text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide text-sm md:text-base flex items-center justify-center gap-2">
                  {t("home.levelSection.cta.primary")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button className="bg-white hover:bg-gray-50 border-2 border-[#ff4136] text-[#ff4136] font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 uppercase tracking-wide text-sm md:text-base">
                  {t("home.levelSection.cta.secondary")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
