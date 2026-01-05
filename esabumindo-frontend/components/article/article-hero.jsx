import Image from "next/image";

export function ArticleHero() {
  return (
    <section className="relative bg-white py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2">Esabond Article</h1>
          <div className="mx-auto h-px w-64 bg-black"></div>
        </div>

        {/* Featured Article */}
        <article className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1720036236694-d0a231c52563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwYWRoZXNpdmUlMjBmYWN0b3J5fGVufDF8fHx8MTc2NTM0ODExNHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Industrial adhesive manufacturing facility"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
          </div>

          <div className="p-6 lg:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <time dateTime="2025-12-10">10 Desember 2025</time>
              <span>•</span>
              <span>Industri & Manufaktur</span>
            </div>

            <h2 className="mb-4">
              Inovasi Terbaru dalam Teknologi Adhesive untuk Industri Modern
            </h2>

            <p className="mb-6 text-gray-700 leading-relaxed">
              ESABUMINDO terus berinovasi dalam menghadirkan solusi adhesive
              berkualitas tinggi yang memenuhi kebutuhan industri Indonesia.
              Dengan pengalaman bertahun-tahun dan komitmen terhadap kualitas,
              kami menghadirkan produk-produk adhesive yang tidak hanya efektif
              namun juga ramah lingkungan.
            </p>

            <button className="rounded-bl-[15px] rounded-tr-[15px] border border-[#060771] bg-[#060771] px-6 py-2.5 text-white transition-colors hover:bg-white hover:text-[#060771]">
              Baca Selengkapnya
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ArticleHero;
