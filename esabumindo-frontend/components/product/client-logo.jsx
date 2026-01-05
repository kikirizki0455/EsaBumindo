import Image from "next/image"; // ← WAJIB, ini yang bikin error kemarin!!
import { useState } from "react";

const ClientLogo = ({ name, logo }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="flex-shrink-0 w-64 sm:w-72 md:w-80 px-6 md:px-8">
      <div
        className="
        relative bg-white rounded-2xl p-10 md:p-12 shadow-lg hover:shadow-2xl 
        transition-all duration-300 border border-gray-200 group cursor-grab 
        active:cursor-grabbing h-48 md:h-56 flex items-center justify-center
      "
      >
        {/* Skeleton loading */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
        )}

        {/* Logo Image */}
        <div className="relative w-full h-full">
          <Image
            src={logo}
            alt={`${name} logo`}
            fill // 🔥 BIKIN LOGO FULLY RESPONSIVE TANPA W/H FIX
            className={`
              object-contain transition-all duration-500 grayscale 
              group-hover:grayscale-0 
              ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[.90]"}
            `}
            onLoadingComplete={() => setIsLoaded(true)} // 🔥 lebih akurat dari onLoad
            draggable="false"
            priority={false}
          />
        </div>

        {/* Hover gradient effect */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          rounded-2xl pointer-events-none"
        />
      </div>
    </div>
  );
};

export default ClientLogo;
