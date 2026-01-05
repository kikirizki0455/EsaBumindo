import { Award, Target, Zap, TrendingUp } from "lucide-react";

// Strength Card Component
function StrengthCard({ number, title, color }) {
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
      className={`${colorClasses[color]} ${borderClasses[color]} p-6 md:p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group`}
    >
      <div className="text-center space-y-3">
        <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
          {number}
        </div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#f9f9f9] leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
}

// Main Company Section Component
export default function CompanySection() {
  const strengths = [
    { number: "01", title: "Produksi Cepat", color: "blue" },
    { number: "02", title: "Kualitas Konsisten", color: "red" },
    { number: "03", title: "Inovasi Berkelanjutan", color: "red" },
    { number: "04", title: "Formulasi Andal", color: "blue" },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#060771]/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff4136]/5 rounded-full blur-3xl -z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content Container with Border */}
        <div className="bg-white border-2 border-[#060771] rounded-tl-[40px] sm:rounded-tl-[60px] md:rounded-tl-[100px] rounded-br-[40px] sm:rounded-br-[60px] md:rounded-br-[100px] shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="text-[#060771] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-[#060771]/10 rounded-full">
                Tentang Kami
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Mengenal <span className="text-[#ff4136]">ESABOND</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Solusi adhesive berkualitas untuk industri modern Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
            {/* Left Content - Company Description */}
            <div className="space-y-6 md:space-y-8">
              {/* Paragraph 1 */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#ff4136]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[#ff4136]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                    Visi Kami
                  </h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                  adalah perusahaan manufaktur chemical adhesive yang hadir
                  untuk menjawab tantangan industri yang membutuhkan suplai lem{" "}
                  <span className="font-bold text-[#060771]">
                    berkualitas dengan kecepatan, stabilitas, dan konsistensi
                    tinggi
                  </span>
                  . Sejak awal berdiri, ESABOND berfokus pada pengembangan
                  formulasi adhesive yang dapat mendukung berbagai sektor
                  manufaktur mulai dari furniture, packaging, konstruksi, hingga
                  otomotif dengan kualitas yang terukur dan waktu produksi yang
                  efisien.
                </p>
              </div>

              {/* Paragraph 2 */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#060771]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#060771]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                    Pengalaman
                  </h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  Pengalaman panjang dalam industri adhesive memberikan{" "}
                  <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                  pemahaman mendalam mengenai berbagai hambatan yang sering
                  dialami pelaku industri seperti lead time yang lama, suplai
                  yang tidak menentu, hingga kualitas produk yang tidak
                  konsisten. Pengalaman tersebut menjadi fondasi kami dalam
                  merancang{" "}
                  <span className="font-bold text-[#060771]">
                    sistem produksi yang lebih responsif dan dapat diandalkan
                  </span>
                  .
                </p>
              </div>

              {/* Paragraph 3 */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#ff4136]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#ff4136]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                    Komitmen
                  </h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                  percaya bahwa kebutuhan adhesive tidak hanya tentang kekuatan
                  material, tetapi juga tentang{" "}
                  <span className="font-bold text-[#060771]">
                    efisiensi rantai produksi secara menyeluruh
                  </span>
                  . Oleh karena itu, kami menghadirkan pendekatan end-to-end
                  dari hulu ke hilir mulai dari{" "}
                  <span className="font-bold text-[#060771]">
                    formulasi, pengujian, kontrol kualitas
                  </span>
                  , hingga distribusi cepat untuk memastikan setiap pelanggan
                  mendapatkan produk yang{" "}
                  <span className="font-bold text-[#060771]">
                    siap pakai, stabil, dan tepat waktu
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Right Content - Strength Grid */}
            <div className="space-y-6 md:space-y-8">
              {/* Section Title */}
              <div className="text-center lg:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#060771]/10 rounded-full mb-4">
                  <Zap className="w-4 h-4 text-[#060771]" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#060771]">
                    Keunggulan Kami
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  4 Pilar Kekuatan{" "}
                  <span className="text-[#ff4136]">ESABOND</span>
                </h3>
              </div>

              {/* Strength Cards Grid */}
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
              <div className="bg-gradient-to-br from-[#060771] to-[#060771]/90 rounded-2xl p-6 md:p-8 shadow-2xl text-white transform hover:scale-105 transition-all duration-300">
                <h4 className="text-xl md:text-2xl font-bold mb-3">
                  Siap Berkolaborasi?
                </h4>
                <p className="text-sm md:text-base text-white/90 mb-6">
                  Mari wujudkan produksi yang lebih cepat, stabil, dan
                  berkualitas bersama ESABOND
                </p>
                <button className="w-full bg-[#ff4136] hover:bg-[#ff4136]/90 text-white font-semibold px-6 py-3 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide text-sm">
                  Hubungi Kami Sekarang
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Statement */}
          <div className="mt-10 md:mt-14 lg:mt-16 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#060771]/5 via-[#ff4136]/5 to-[#060771]/5 rounded-2xl p-6 md:p-8 border border-gray-200">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                Dengan menggabungkan keahlian teknis, pemahaman industri, serta
                inovasi berkelanjutan,{" "}
                <span className="font-bold text-[#ff4136]">ESABOND</span>{" "}
                membawa perubahan baru bagi dunia adhesive di Indonesia —{" "}
                <span className="font-bold text-[#060771]">
                  lebih cepat, lebih stabil, dan lebih siap menghadapi kebutuhan
                  industri modern
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
