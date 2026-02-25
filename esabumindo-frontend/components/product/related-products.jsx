import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocalizedProducts } from "@/hooks/use-localized-products";
import { useTranslation } from "@/hooks/use-translation";

export default function RelatedProducts({ currentProductId }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const { t } = useTranslation();

  // Use localized products hook for multi-language support
  const { products } = useLocalizedProducts();

  // Get related products - same type or random if not enough
  const relatedProducts = useMemo(() => {
    const currentProduct = products.find((p) => p.id === currentProductId);

    // Get products with same type first
    let related = products.filter(
      (p) => p.id !== currentProductId && p.type === currentProduct?.type
    );

    // If not enough, add other products
    if (related.length < 3) {
      const others = products.filter(
        (p) => p.id !== currentProductId && p.type !== currentProduct?.type
      );
      related = [...related, ...others];
    }

    return related.slice(0, 3);
  }, [currentProductId, products]);

  // Handle image error with state management
  const handleImageError = useCallback((productId) => {
    setImageErrors((prev) => new Set([...prev, productId]));
  }, []);

  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("products.productDetail.relatedProducts")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div
              className="relative overflow-hidden rounded-lg mb-3 cursor-pointer"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Product Image */}
              <div className="bg-gray-100 aspect-square relative overflow-hidden rounded-lg flex items-center justify-center">
                {!imageErrors.has(product.id) ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium text-center px-4">
                      {product.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Overlay Badge */}
              <div className="absolute top-2 right-2">
                <span className="inline-block px-2 py-1 bg-[#0c439a] text-white text-xs font-medium rounded">
                  {product.type}
                </span>
              </div>

              {/* Hover Arrow */}
              {hoveredId === product.id && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                  <ArrowRight size={28} className="text-white" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#0c439a] transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product.application}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-8 text-center">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#0c439a] text-[#0c439a] font-medium rounded-lg hover:bg-[#0c439a] hover:text-white transition-colors text-sm"
        >
          {t("products.productDetail.backToProducts")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
