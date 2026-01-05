import { Quote, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Profile Avatar Component
function Founder({ name, imageSrc }) {
  return (
    <div className="relative group">
      {/* Decorative Ring */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060771] to-[#ff4136] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

      {/* Avatar Container */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[#060771]/20 group-hover:ring-[#060771]/40 transition-all duration-500 transform group-hover:scale-105">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <svg
              className="w-16 h-16 md:w-20 md:h-20 text-[#060771]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Timeline Item Component with Scroll Animation
function TimelineItem({ name, quote, imageSrc, index, isVisible }) {
  const isLeft = index % 2 === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 mb-20 md:mb-32 relative">
      {/* Left Side - Founder or Quote */}
      <div
        className={`flex ${
          isLeft ? "md:justify-end" : "md:justify-start"
        } md:pr-8 lg:pr-16`}
      >
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : `opacity-0 ${isLeft ? "-translate-x-20" : "translate-x-20"}`
          }`}
        >
          {isLeft ? (
            /* Founder on Left */
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <Founder name={name} imageSrc={imageSrc} />
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-4">
                {name}
              </h3>
              <p className="text-sm text-[#060771] font-medium mt-1">
                Co-Founder
              </p>
            </div>
          ) : (
            /* Quote on Left */
            <div className="relative max-w-xl">
              <div className="absolute -top-4 left-4 w-12 h-12 bg-gradient-to-br from-[#060771] to-[#ff4136] rounded-full flex items-center justify-center shadow-lg z-10">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 italic">
                  "{quote}"
                </p>
              </div>
              <div className="absolute -bottom-3 right-3 w-24 h-24 bg-[#ff4136]/10 rounded-full blur-2xl -z-10"></div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Quote or Founder */}
      <div
        className={`flex ${
          isLeft ? "md:justify-start" : "md:justify-end"
        } md:pl-8 lg:pl-16`}
      >
        <div
          className={`transition-all duration-1000 ease-out delay-300 ${
            isVisible
              ? "opacity-100 translate-x-0"
              : `opacity-0 ${isLeft ? "translate-x-20" : "-translate-x-20"}`
          }`}
        >
          {isLeft ? (
            /* Quote on Right */
            <div className="relative max-w-xl">
              <div className="absolute -top-4 left-4 md:right-4 md:left-auto w-12 h-12 bg-gradient-to-br from-[#060771] to-[#ff4136] rounded-full flex items-center justify-center shadow-lg z-10">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 italic">
                  "{quote}"
                </p>
              </div>
              <div className="absolute -bottom-3 left-3 md:right-3 md:left-auto w-24 h-24 bg-[#ff4136]/10 rounded-full blur-2xl -z-10"></div>
            </div>
          ) : (
            /* Founder on Right */
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Founder name={name} imageSrc={imageSrc} />
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-4">
                {name}
              </h3>
              <p className="text-sm text-[#060771] font-medium mt-1">
                Co-Founder
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Center Divider Line with Node */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#060771]/30 via-[#ff4136]/40 to-[#060771]/30 transform -translate-x-1/2">
        {/* Animated Node */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className={`w-6 h-6 rounded-full bg-gradient-to-br from-[#060771] to-[#ff4136] shadow-lg transition-all duration-700 ${
              isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#060771] to-[#ff4136] animate-ping opacity-75"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Co-Founder Section
export default function CoFounderSection() {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRefs = useRef([]);

  const coFounders = [
    {
      name: "Eman Suratman",
      quote:
        "ESABOND lahir dari pengalaman panjang kami di industri adhesive. Kami melihat bagaimana banyak bisnis terhambat oleh suplai yang lambat dan kualitas yang tidak konsisten. Dari situ, kami bertekad menciptakan solusi yang benar-benar responsif dan dapat diandalkan untuk mendukung pertumbuhan industri Indonesia.",
      imageSrc: null,
    },
    {
      name: "Sarjana",
      quote:
        "Visi kami sederhana: memberikan produk adhesive berkualitas tinggi dengan waktu produksi yang cepat. Kami percaya bahwa setiap bisnis berhak mendapatkan partner yang tidak hanya menyediakan produk, tetapi juga memahami kebutuhan mereka secara menyeluruh. Itulah komitmen ESABOND untuk setiap klien kami.",
      imageSrc: null,
    },
  ];

  useEffect(() => {
    const observers = observerRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set([...prev, index]));
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#060771]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff4136]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#060771]/10 rounded-full mb-4">
            <Users className="w-4 h-4 text-[#060771]" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#060771]">
              Pendiri Kami
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Co-Founder <span className="text-[#ff4136]">ESABOND</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Dipimpin oleh para profesional berpengalaman yang berkomitmen
            membawa inovasi ke industri adhesive Indonesia
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-7xl ">
          {/* Timeline Items */}
          <div className="relative ">
            {coFounders.map((coFounder, index) => (
              <div key={index} ref={(el) => (observerRefs.current[index] = el)}>
                <TimelineItem
                  name={coFounder.name}
                  quote={coFounder.quote}
                  imageSrc={coFounder.imageSrc}
                  index={index}
                  isVisible={visibleItems.has(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 md:mt-20 lg:mt-24 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#060771] to-[#060771]/90 rounded-3xl p-8 md:p-12 shadow-2xl text-white text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4136]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Bergabunglah dengan Visi Kami
              </h3>
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Mari bersama-sama membangun masa depan industri adhesive
                Indonesia yang lebih baik
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#ff4136] hover:bg-[#ff4136]/90 text-white font-semibold px-8 py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide">
                  Hubungi Kami
                </button>
                <button className="bg-white hover:bg-gray-100 text-[#060771] font-semibold px-8 py-4 rounded-tl-[15px] rounded-br-[15px] transition-all duration-300 uppercase tracking-wide">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
