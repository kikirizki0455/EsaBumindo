import Image from "next/image";
import Link from "next/link";

export function ArticleCard({
  title,
  excerpt,
  date,
  category,
  imageUrl,
  slug,
}) {
  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
      <Link href={`/article/${slug}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-3 text-sm text-gray-600">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>•</span>
            <span className="text-[#060771]">{category}</span>
          </div>
          <h3 className="mb-3 line-clamp-2 transition-colors group-hover:text-[#060771]">
            {title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-gray-700 leading-relaxed">
            {excerpt}
          </p>
          <span className="inline-flex items-center text-sm text-[#060771] transition-colors group-hover:underline">
            Baca Selengkapnya
            <svg
              className="ml-2 size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
