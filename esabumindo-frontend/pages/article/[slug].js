import { useRouter } from "next/router";
import Image from "next/image";

// nanti tinggal pindah ke database/API
const articles = [
  {
    slug: "keunggulan-adhesive-berkualitas",
    title: "Keunggulan Adhesive Berkualitas untuk Aplikasi Industri",
    date: "2025-12-08",
    category: "Produk & Layanan",
    imageUrl: "https://img-link.com",
    content: `
      Artikel lengkap masuk di sini...
      Kamu bisa buat beberapa paragraph atau HTML formatting.
    `,
  },
];

export default function ArticleDetail() {
  const { query } = useRouter();
  const { slug } = query;

  const article = articles.find((a) => a.slug === slug);

  if (!article)
    return <h1 className="text-center mt-20">Artikel tidak ditemukan</h1>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <Image
        src={article.imageUrl}
        alt={article.title}
        width={1200}
        height={600}
        className="rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-3">{article.title}</h1>

      <p className="text-gray-600 mb-6">
        {article.date} — {article.category}
      </p>

      <article className="text-lg leading-relaxed whitespace-pre-line">
        {article.content}
      </article>
    </main>
  );
}
