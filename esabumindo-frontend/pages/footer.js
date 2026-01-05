export default function Footer() {
  return (
    <footer className="bg-[#060771] text-white py-12 md:py-16" id="contact">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl md:text-[28px] mb-4 capitalize">
              ESABUMINDO
            </h3>
            <p className="text-sm md:text-[15px] leading-relaxed">
              Dengan pengalaman, inovasi, dan proses produksi yang super
              responsif, ESABUMINDO siap menjadi pemimpin dalam penyediaan
              adhesive dan chemical menciptakan standar baru bagi kualitas,
              efisiensi, dan kecepatan layanan di industri Indonesia.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-xl md:text-[20px] mb-4 capitalize">Menu</h3>
            <ul className="space-y-2 text-[#fdfdfd]">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#product"
                  className="hover:text-white transition-colors"
                >
                  Produk & Layanan
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-xl md:text-[20px] mb-4 capitalize">
              Informasi
            </h3>
            <div className="space-y-4 text-[#fdfdfd]">
              <div>
                <p>PT ESABOND</p>
                <p className="text-sm md:text-base leading-relaxed">
                  Jl. Raya Pasarkemis, Ruko Bumi Indah, Blok RD No.1 - 2<br />
                  Pasarkemis - Tangerang, Tangerang 15560
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="size-[19px]"></div>
                <span>@EsaBond</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm md:text-[15px] capitalize">
            &copy; 2025 ESABUMINDO. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
