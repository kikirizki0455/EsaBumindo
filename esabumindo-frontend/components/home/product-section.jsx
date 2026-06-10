import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { memo } from "react";

// Lazy load image - hanya import path, bukan static import
const imgImagePt4 = "/asset/image/esabumindo-founder.webp";
const AdhesiveIcon = "/asset/icon/polymere.svg";
const PRODUCT_CATEGORIES = [
  {
    key: "allAcrylic",
    label: { id: "All Acrylic", en: "All Acrylic" },
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
    desc: { id: "Laminasi & Sablon", en: "Lamination & Printing" },
    count: 3,
  },
  {
    key: "pvac",
    label: { id: "PVAC", en: "PVAC" },
    color: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
    desc: { id: "Aplikasi Kayu & Kertas", en: "Wood & Paper Applications" },
    count: 12,
  },
  {
    key: "eva",
    label: { id: "EVA", en: "EVA" },
    color: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
    desc: { id: "Laminasi & Penjilidan", en: "Lamination & Binding" },
    count: 4,
  },
  {
    key: "styrene",
    label: { id: "Styrene", en: "Styrene" },
    color: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
    desc: { id: "Tinta, Coating & Busa", en: "Ink, Coating & Foam" },
    count: 8,
  },
  {
    key: "psa",
    label: { id: "PSA", en: "PSA" },
    color: "bg-red-50 border-red-200 text-red-700",
    dot: "bg-red-500",
    desc: { id: "Label & Joint Flap", en: "Label & Joint Flap" },
    count: 2,
  },
  {
    key: "vinyl",
    label: { id: "Vinyl", en: "Vinyl" },
    color: "bg-slate-50 border-slate-200 text-slate-700",
    dot: "bg-slate-500",
    desc: { id: "Coating & Cat", en: "Coating & Paint" },
    count: 2,
  },
];
export const ProductSection = memo(function ProductSection() {
  const { t, isHydrated } = useTranslation();
  const { locale } = useTranslation();
  // Skeleton saat belum hydrated
  if (!isHydrated) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-[#edebeb] to-[#edebeb]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-[#edebeb] via-[#f5f3f3] to-[#edebeb] rounded-tl-[30px] sm:rounded-tl-[50px] md:rounded-tl-[80px] rounded-tr-[30px] sm:rounded-tr-[50px] md:rounded-tr-[80px] relative overflow-hidden"
      id="product"
    >
      {/* Decorative Background - Simplified for mobile */}
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-[#060771]/5 rounded-full blur-3xl -z-0" />
      <div className="hidden md:block absolute bottom-0 left-0 w-64 h-64 bg-[#ff4136]/5 rounded-full blur-3xl -z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 lg:mb-16">
          <div className="inline-block mb-3 md:mb-4">
            <span className="text-[#060771] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-white/80 rounded-full shadow-sm">
              {t("home.productSection.badge")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-[#060771] font-bold mb-3 md:mb-4">
            {t("home.productSection.title")}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {t("home.productSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Main Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-8">
                <span className="text-[#ff4136] font-bold">
                  {t("home.productSection.description.brand")}
                </span>
                <span className="text-gray-800">
                  {" "}
                  {t("home.productSection.description.text1")}
                </span>
                <br />
                <span className="text-gray-800">
                  {t("home.productSection.description.text2")}{" "}
                </span>
                <span className="text-[#060771] font-semibold">
                  {t("home.productSection.description.highlight")}
                </span>
              </p>

              <div className="space-y-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {t("home.productSection.about.title")}{" "}
                  <span className="text-[#ff4136]">
                    {t("home.productSection.description.brand")}
                  </span>
                </h3>
                <p className="text-[#060771] text-sm md:text-base font-medium">
                  {t("home.productSection.about.subtitle")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href="/product"
                  className="bg-[#060771] hover:bg-[#060771]/90 text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 shadow-lg uppercase tracking-wide text-sm md:text-base text-center"
                >
                  {t("home.productSection.cta.primary")}
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-gray-50 border-2 border-[#060771] text-[#060771] font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 uppercase tracking-wide text-sm md:text-base text-center"
                >
                  {t("home.productSection.cta.secondary")}
                </Link>
              </div>
            </div>

            {/* Product Icons Section - Simplified */}
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
                {t("home.productSection.categories.title")}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {PRODUCT_CATEGORIES.map((cat) => {
                  // Tentukan locale dari hook router, atau fallback ke "id"

                  const currentLocale = locale ?? "id";
                  return (
                    <Link
                      key={cat.key}
                      href="/product"
                      className={`flex items-center gap-3 p-3 rounded-xl border ${cat.color} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${cat.dot} shrink-0`}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-tight">
                          {cat.label[currentLocale] ?? cat.label.id}
                        </p>
                        <p className="text-xs opacity-70 truncate leading-tight mt-0.5">
                          {cat.desc[currentLocale] ?? cat.desc.id}
                        </p>
                      </div>
                      <span className="ml-auto text-xs font-medium opacity-60 shrink-0">
                        {cat.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/product"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#060771] hover:text-[#060771]/80 transition-colors"
              >
                {t("home.productSection.categories.viewAll")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative rounded-tr-[60px] sm:rounded-tr-[100px] md:rounded-tr-[155px] overflow-hidden shadow-2xl">
                <Image
                  src={imgImagePt4}
                  alt="ESABOND Professional Industrial Solutions"
                  width={500}
                  height={400}
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover"
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
