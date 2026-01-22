import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BEST_SELLER_PRODUCTS, NEW_PRODUCTS } from "@/data/products";

export default function RelatedProducts({ currentProductId }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Get all products except current one
  const allProducts = useMemo(
    () => [...BEST_SELLER_PRODUCTS, ...NEW_PRODUCTS],
    []
  );

  const relatedProducts = useMemo(
    () => allProducts.filter((p) => p.id !== currentProductId).slice(0, 3),
    [allProducts, currentProductId]
  );

  // Handle image error with state management
  const handleImageError = useCallback((productId) => {
    setImageErrors((prev) => new Set([...prev, productId]));
  }, []);

  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Produk Terkait</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div
              className="relative overflow-hidden rounded-lg mb-4 cursor-pointer"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Product Image */}
              <div className="bg-gray-100 aspect-square relative overflow-hidden rounded-lg flex items-center justify-center">
                {!imageErrors.has(product.id) ? (
                  <Image
                    src={`/images/products/${product.id}.png`}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={() => handleImageError(product.id)}
                    unoptimized={false}
                  />
                ) : (
                  <svg
                    className="w-24 h-24 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 200 200"
                  >
                    <rect width="200" height="200" fill="#f3f4f6" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className="text-gray-400"
                      fontSize="12"
                    >
                      {product.name}
                    </text>
                    <path
                      d="M60 80 L140 80 L140 160 L60 160 Z"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="110" r="8" fill="#d1d5db" />
                  </svg>
                )}
              </div>

              {/* Overlay Badge */}
              <div className="absolute top-3 right-3">
                <span className="inline-block px-3 py-1 bg-[#0c439a] text-white text-xs font-bold rounded-full">
                  {product.type}
                </span>
              </div>

              {/* Hover Arrow */}
              {hoveredId === product.id && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                  <ArrowRight size={32} className="text-white" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0c439a] transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{product.category}</p>
              <p className="text-sm text-gray-700 font-semibold mt-2 text-[#ca161e]">
                {product.performance}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-12 text-center">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0c439a] text-[#0c439a] font-bold rounded-lg hover:bg-[#0c439a] hover:text-white transition-colors"
        >
          Lihat Semua Produk
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
