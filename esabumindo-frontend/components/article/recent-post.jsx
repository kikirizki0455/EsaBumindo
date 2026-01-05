import { ArticleCard } from "@/components/article/article-card";

const articles = [
  {
    id: 1,
    title: "Keunggulan Adhesive Berkualitas untuk Aplikasi Industri",
    excerpt:
      "Memahami pentingnya pemilihan adhesive yang tepat untuk berbagai aplikasi industri. Pelajari bagaimana produk ESABUMINDO dapat meningkatkan efisiensi produksi Anda.",
    date: "2025-12-08",
    category: "Produk & Layanan",
    imageUrl:
      "https://images.unsplash.com/photo-1614308459036-779d0dfe51ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaWNhbCUyMGxhYm9yYXRvcnklMjByZXNlYXJjaHxlbnwxfHx8fDE3NjUzNDgxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    slug: "keunggulan-adhesive-berkualitas",
  },
  {
    id: 2,
    title: "Proses Produksi yang Responsif: Kunci Kesuksesan ESABUMINDO",
    excerpt:
      "Mengenal lebih dekat sistem produksi ESABUMINDO yang mengutamakan kecepatan, kualitas, dan efisiensi untuk memenuhi kebutuhan pelanggan secara optimal.",
    date: "2025-12-05",
    category: "Industri & Manufaktur",
    imageUrl:
      "https://images.unsplash.com/photo-1758269445774-61a540a290a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtYW51ZmFjdHVyaW5nJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NjUzNDgxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    slug: "proses-produksi-responsif",
  },
  {
    id: 3,
    title: "Standar Kualitas Internasional dalam Setiap Produk",
    excerpt:
      "ESABUMINDO berkomitmen menghadirkan produk chemical dan adhesive dengan standar kualitas internasional untuk mendukung pertumbuhan industri Indonesia.",
    date: "2025-12-03",
    category: "Kualitas & Inovasi",
    imageUrl:
      "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGlubm92YXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NTI3NTUzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    slug: "standar-kualitas-internasional",
  },
];

export function RecentPosts() {
  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-8 lg:mb-12">Recent Posts</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              category={article.category}
              imageUrl={article.imageUrl}
              slug={article.slug}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="rounded-bl-[15px] rounded-tr-[15px] border border-[#060771] bg-white px-8 py-3 text-[#060771] transition-colors hover:bg-[#060771] hover:text-white">
            Muat Artikel Lainnya
          </button>
        </div>
      </div>
    </section>
  );
}

export default RecentPosts;
