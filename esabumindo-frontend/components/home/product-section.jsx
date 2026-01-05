import Image from "next/image";
import imgImagePt4 from "@/public/asset/image/esabumindo-founder.webp";
import AdhesiveIcon from "@/public/asset/icon/polymere.svg";
// import { PolymerIcon } from "./icons/PolymerIcon";
// import { ChemicalIcon } from "./icons/ChemicalIcon";

export function ProductSection() {
  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-[#edebeb] via-[#f5f3f3] to-[#edebeb] rounded-tl-[30px] sm:rounded-tl-[50px] md:rounded-tl-[80px] rounded-tr-[30px] sm:rounded-tr-[50px] md:rounded-tr-[80px] relative overflow-hidden"
      id="product"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#060771]/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff4136]/5 rounded-full blur-3xl -z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 lg:mb-16">
          <div className="inline-block mb-3 md:mb-4">
            <span className="text-[#060771] text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2 bg-white/80 rounded-full shadow-sm">
              Our Products
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[56px] text-[#060771] font-bold mb-3 md:mb-4">
            #KualitasDimulaiDiSini
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Solusi adhesive dan chemical terpercaya untuk industri Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Main Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-8">
                <span className="text-[#ff4136] font-bold">ESABOND</span>
                <span className="text-gray-800">
                  {" "}
                  menghadirkan adhesive dan chemical yang andal.
                </span>
                <br />
                <span className="text-gray-800">
                  Bantu produk Anda jadi lebih{" "}
                </span>
                <span className="text-[#060771] font-semibold">
                  kuat, efisien, dan unggul.
                </span>
              </p>

              <div className="space-y-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Produk & Layanan{" "}
                  <span className="text-[#ff4136]">ESABOND</span>
                </h3>
                <p className="text-[#060771] text-sm md:text-base font-medium">
                  Tentang ESABOND
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button className="bg-[#060771] hover:bg-[#060771]/90 text-white font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide text-sm md:text-base">
                  Cek Produk
                </button>

                <button className="bg-white hover:bg-gray-50 border-2 border-[#060771] text-[#060771] font-semibold px-8 py-3.5 md:px-10 md:py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 uppercase tracking-wide text-sm md:text-base">
                  Hubungi Kami
                </button>
              </div>
            </div>

            {/* Product Icons Section */}
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
                Kategori Produk Kami
              </h4>

              {/* Mobile & Tablet: Horizontal Scroll with indicators */}
              <div className="lg:hidden relative">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  <div className="flex-shrink-0 w-48 sm:w-56 snap-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"></div>
                  </div>
                  <div className="flex-shrink-0 w-48 sm:w-56 snap-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                      <Image
                        src={AdhesiveIcon}
                        width={100}
                        alt="lem tanggerang"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-48 sm:w-56 snap-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"></div>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="flex justify-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-[#060771]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 xl:gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <Image src={AdhesiveIcon} width={100} alt="lem tanggerang" />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"></div>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"></div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 md:w-28 md:h-28 bg-[#ff4136]/20 rounded-tr-[50px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 md:w-28 md:h-28 bg-[#060771]/20 rounded-bl-[50px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>

              {/* Main Image Container */}
              <div className="relative rounded-tr-[60px] sm:rounded-tr-[100px] md:rounded-tr-[155px] overflow-hidden shadow-2xl ring-4 ring-white">
                <Image
                  src={imgImagePt4}
                  alt="ESABOND Conference Room - Professional Industrial Solutions"
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay with Branding */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060771]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-lg md:text-xl mb-2">
                      ESABOND Professional
                    </p>
                    <p className="text-white/90 text-sm">
                      Quality Solutions for Industry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar hide utility - Add to your global CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
