import imgImagePt2 from "@/public/asset/image/esabumindo-home.webp";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import parse, { domToReact } from "html-react-parser";

export function HomeSection() {
  const { t, isHydrated } = useTranslation();

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

  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50"
      id="about"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <div className="max-w-2xl">
              {/* Section Label */}
              <div className="inline-block mb-4 md:mb-6">
                <span className="text-[#060771] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-[#060771]/10 rounded-full">
                  {isHydrated ? t("home.homeSection.title") : ""}
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] leading-tight font-bold mb-4 md:mb-6">
                {isHydrated ? renderTitle(t("home.homeSection.heroTitle")) : ""}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-8">
                {isHydrated ? t("home.homeSection.description") : ""}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#060771] hover:bg-[#060771]/90 text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide text-sm md:text-base">
                  {isHydrated ? t("home.homeSection.ctaPrimary") : ""}
                </button>

                <button className="border-2 border-[#060771] text-[#060771] hover:bg-[#060771] hover:text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 uppercase tracking-wide text-sm md:text-base">
                  {isHydrated ? t("home.homeSection.ctaSecondary") : ""}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 md:pt-8 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#060771] mb-1">
                  15+
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {isHydrated ? t("home.homeSection.stats.experience") : ""}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#ff4136] mb-1">
                  500+
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {isHydrated ? t("home.homeSection.stats.projects") : ""}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#060771] mb-1">
                  100%
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {isHydrated ? t("home.homeSection.stats.satisfaction") : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[#060771]/10 rounded-tl-[60px] rounded-br-[60px] -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-[#ff4136]/10 rounded-tl-[60px] rounded-br-[60px] -z-10"></div>

              <div className="relative rounded-tl-[80px] sm:rounded-tl-[120px] md:rounded-tl-[150px] rounded-br-[80px] sm:rounded-br-[120px] md:rounded-br-[150px] overflow-hidden shadow-2xl ring-4 ring-white">
                <Image
                  src={imgImagePt2}
                  alt="Industrial Worker - Professional Manufacturing"
                  className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] object-cover"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
