import Image from "next/image";
import HeroBg from "@/public/asset/image/esabumindo.webp";

export default function Hero() {
  return (
    // Tambahkan padding-top untuk mengkompensasi fixed navigation (h-20 = 80px)
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={HeroBg}
          alt="Latar Belakang Bangunan Industri"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Overlay - Opacity sudah ada di bg-black/60 */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Hero Content - Mobile First Approach */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center">
          <div className="max-w-4xl w-full text-center lg:text-left">
            {/* Tagline */}
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-[22px] font-light mb-2 sm:mb-3 md:mb-4 animate-fade-in">
              everything is possible? 
            </p>

            {/* Main Heading - Responsive Typography */}
            <h1 className="text-white text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight animate-fade-in-up">
              We Bring Success To Your Business
            </h1>

            {/* CTA Button */}
            <a href="#products" className="inline-block">
              <button className="bg-[#060771] hover:bg-[#060771]/90 text-white font-semibold text-sm sm:text-base md:text-lg px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                Let's see Our Products
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
