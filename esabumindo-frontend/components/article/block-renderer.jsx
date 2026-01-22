// components/article/BlockRenderer.jsx
"use client";

import { LazyImage } from "./lazy-image";

export default function BlockRenderer({ blocks, getImageUrl }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Konten tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        // Paragraph Block
        if (block.type === "paragraph") {
          return (
            <p
              key={block.id || index}
              className="text-gray-700 leading-relaxed text-[17px] md:text-[18px]"
            >
              {block.content}
            </p>
          );
        }

        // Heading Block
        if (block.type === "heading") {
          const HeadingTag = `h${block.level}`;
          const headingClasses = {
            2: "text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 border-b border-gray-200 pb-3",
            3: "text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4",
            4: "text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-3",
          };

          return (
            <HeadingTag
              key={block.id || index}
              className={headingClasses[block.level] || headingClasses[2]}
            >
              {block.content}
            </HeadingTag>
          );
        }

        // Image Block
        if (block.type === "image") {
          // Single Image Layout (Full Width)
          if (block.layout === "single") {
            return (
              <div key={block.id || index} className="my-8">
                {block.images.map((image, idx) => (
                  <div key={idx} className="space-y-3">
                    <div
                      className="relative w-full overflow-hidden rounded-xl shadow-lg bg-gray-100"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <LazyImage
                        src={getImageUrl(image.url)}
                        alt={image.alt || "Article image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        priority={idx === 0}
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-center text-gray-600 italic">
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // Double Image Layout (Side by Side)
          if (block.layout === "double") {
            return (
              <div
                key={block.id || index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"
              >
                {block.images.map((image, idx) => (
                  <div key={idx} className="space-y-3">
                    <div
                      className="relative w-full overflow-hidden rounded-xl shadow-md bg-gray-100"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <LazyImage
                        src={getImageUrl(image.url)}
                        alt={image.alt || "Article image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={false}
                      />
                    </div>
                    {image.caption && (
                      <p className="text-xs text-center text-gray-600 italic">
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // Grid Layout (3 Columns)
          if (block.layout === "grid") {
            return (
              <div
                key={block.id || index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8"
              >
                {block.images.map((image, idx) => (
                  <div key={idx} className="space-y-2">
                    <div
                      className="relative w-full overflow-hidden rounded-lg shadow-md bg-gray-100"
                      style={{ aspectRatio: "1/1" }}
                    >
                      <LazyImage
                        src={getImageUrl(image.url)}
                        alt={image.alt || "Article image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                    {image.caption && (
                      <p className="text-xs text-center text-gray-600 italic">
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          }
        }

        return null;
      })}
    </div>
  );
}
