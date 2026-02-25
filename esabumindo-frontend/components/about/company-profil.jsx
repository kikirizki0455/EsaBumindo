import { Award, Target, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";
import { memo } from "react";

// Memoized Strength Card Component
const StrengthCard = memo(function StrengthCard({ number, title, color }) {
  const colorClasses = {
    blue: "bg-[#060771]/85 hover:bg-[#060771]",
    red: "bg-[#ff4136]/85 hover:bg-[#ff4136]",
  };

  const borderClasses = {
    blue: "rounded-br-[20px]",
    red: "rounded-tl-[20px]",
  };

  return (
    <div
      className={`${colorClasses[color]} ${borderClasses[color]} p-6 md:p-8 transition-colors duration-300`}
    >
      <div className="text-center space-y-3">
        <div className="text-3xl md:text-4xl font-black text-white mb-2">
          {number}
        </div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#f9f9f9] leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
});

// Memoized Info Card Component
const InfoCard = memo(function InfoCard({
  icon: Icon,
  iconColor,
  title,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`w-10 h-10 bg-[${iconColor}]/10 rounded-lg flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-6 h-6 text-[${iconColor}]`} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
});

// Main Company Section Component
function CompanySection() {
  const { t, isHydrated } = useTranslation();

  // Skeleton loading
  if (!isHydrated) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const strengths = [
    {
      number: "01",
      title: t("companyProfile.strengths.items.0"),
      color: "blue",
    },
    {
      number: "02",
      title: t("companyProfile.strengths.items.1"),
      color: "red",
    },
    {
      number: "03",
      title: t("companyProfile.strengths.items.2"),
      color: "red",
    },
    {
      number: "04",
      title: t("companyProfile.strengths.items.3"),
      color: "blue",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background - Hidden on mobile */}
      <div className="hidden md:block absolute top-0 left-0 w-96 h-96 bg-[#060771]/5 rounded-full blur-3xl z-0" />
      <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-[#ff4136]/5 rounded-full blur-3xl z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content Container */}
        <div className="bg-white border-2 border-[#060771] rounded-tl-[40px] sm:rounded-tl-[60px] md:rounded-tl-[100px] rounded-br-[40px] sm:rounded-br-[60px] md:rounded-br-[100px] shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="text-[#060771] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-[#060771]/10 rounded-full">
                {t("companyProfile.header.badge")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              {t("companyProfile.header.title")}{" "}
              <span className="text-[#ff4136]">
                {t("companyProfile.header.titleHighlight")}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              {t("companyProfile.header.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              <InfoCard
                icon={Target}
                iconColor="#ff4136"
                title={t("companyProfile.vision.title")}
              >
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                  {t("companyProfile.vision.content")}{" "}
                  <span className="font-bold text-[#060771]">
                    {t("companyProfile.vision.highlight")}
                  </span>
                  {t("companyProfile.vision.description")}
                </p>
              </InfoCard>

              <InfoCard
                icon={Award}
                iconColor="#060771"
                title={t("companyProfile.experience.title")}
              >
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  {t("companyProfile.experience.content")}{" "}
                  <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                  <span className="font-bold text-[#060771]">
                    {t("companyProfile.experience.highlight")}
                  </span>
                  {t("companyProfile.experience.description")}{" "}
                  <span className="font-bold text-[#060771]">
                    {t("companyProfile.experience.highlight2")}
                  </span>
                  .
                </p>
              </InfoCard>

              <InfoCard
                icon={TrendingUp}
                iconColor="#ff4136"
                title={t("companyProfile.commitment.title")}
              >
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                  {t("companyProfile.commitment.content")}{" "}
                  <span className="font-bold text-[#060771]">
                    {t("companyProfile.commitment.highlight")}
                  </span>
                  {t("companyProfile.commitment.description")}{" "}
                  <span className="font-bold text-[#060771]">
                    {t("companyProfile.commitment.highlight2")}
                  </span>
                  {t("companyProfile.commitment.description2")}{" "}
                  <span className="font-bold text-[#060771]">
                    {t("companyProfile.commitment.highlight3")}
                  </span>
                  .
                </p>
              </InfoCard>
            </div>

            {/* Right Content - Strength Grid */}
            <div className="space-y-6 md:space-y-8">
              <div className="text-center lg:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#060771]/10 rounded-full mb-4">
                  <Zap className="w-4 h-4 text-[#060771]" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#060771]">
                    {t("companyProfile.strengths.badge")}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {t("companyProfile.strengths.title")}{" "}
                  <span className="text-[#ff4136]">
                    {t("companyProfile.strengths.titleHighlight")}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {strengths.map((strength, index) => (
                  <StrengthCard
                    key={index}
                    number={strength.number}
                    title={strength.title}
                    color={strength.color}
                  />
                ))}
              </div>

              {/* CTA Card */}
              <div className="bg-[#060771] rounded-2xl p-6 md:p-8 shadow-2xl text-white">
                <h4 className="text-xl md:text-2xl font-bold mb-3">
                  {t("companyProfile.cta.title")}
                </h4>
                <p className="text-sm md:text-base text-white/90 mb-6">
                  {t("companyProfile.cta.description")}
                </p>
                <Link
                  href="/contact"
                  className="block w-full bg-[#ff4136] hover:bg-[#ff4136]/90 text-white font-semibold px-6 py-3 rounded-tl-[15px] rounded-br-[15px] transition-colors duration-300 shadow-lg uppercase tracking-wide text-sm text-center"
                >
                  {t("companyProfile.cta.button")}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Statement */}
          <div className="mt-10 md:mt-14 lg:mt-16 text-center">
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                {t("companyProfile.bottomStatement.content")}{" "}
                <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                <span className="font-bold text-[#060771]">
                  {t("companyProfile.bottomStatement.highlight")}
                </span>{" "}
                <span className="font-bold text-[#060771]">
                  {t("companyProfile.bottomStatement.highlight2")}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CompanySection);
