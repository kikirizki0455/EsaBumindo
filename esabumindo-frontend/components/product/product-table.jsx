"use client";

import { memo, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProductTable = memo(function ProductTable({
  title,
  products,
  onDetail,
  onRequest,
}) {
  const { t } = useTranslation();
  const [imageErrors, setImageErrors] = useState(new Set());

  // Memoize products untuk menghindari re-render yang tidak perlu
  const memoizedProducts = useMemo(() => products, [products]);

  // Handle image error with state management
  const handleImageError = useCallback((productId) => {
    setImageErrors((prev) => new Set([...prev, productId]));
  }, []);

  // Card view untuk mobile
  const CardView = ({ product }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] bg-[#f5f0f0] flex items-center justify-center">
        {!imageErrors.has(product.id) ? (
          <Image
            src={product.image}
            alt={`${product.title} - ${product.application}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
            loading="lazy"
            quality={85}
            onError={() => handleImageError(product.id)}
            unoptimized={false}
          />
        ) : (
          <svg
            className="w-16 h-16 text-gray-300"
            fill="currentColor"
            viewBox="0 0 200 200"
          >
            <rect width="200" height="200" fill="#f5f0f0" />
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
      <CardContent className="p-6">
        <h3 className="mb-2 font-semibold text-gray-900">{product.title}</h3>
        <p className="text-gray-600 mb-3 text-sm">{product.application}</p>

        <ul className="space-y-1 mb-4">
          {product.features?.map((feature, index) => (
            <li
              key={index}
              className="text-gray-600 text-sm flex items-center gap-2"
            >
              <span className="size-1 rounded-full bg-gray-400" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <Button
            onClick={() => onDetail && onDetail(product.id)}
            className="flex-1 bg-[#ca161e] hover:bg-[#a01318] text-white rounded-sm"
          >
            {t("products.productCard.viewDetails")}
          </Button>
          <Button
            onClick={() => onRequest && onRequest(product.id)}
            className="flex-1 bg-[#1f4faa] hover:bg-[#173d85] text-white rounded-sm"
          >
            {t("products.productCard.addToCart")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#0c439a] to-[#ca161e]" />
        </div>

        {memoizedProducts && memoizedProducts.length > 0 ? (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/4">
                      {t("products.productCard.specifications")}
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/4">
                      {t("products.productDetail.applicationInfo")}
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/3">
                      {t("products.productCard.features")}
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 w-1/6">
                      {t("products.productCard.viewDetails")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Name & Image */}
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 flex-shrink-0 bg-[#f5f0f0] rounded flex items-center justify-center">
                            {!imageErrors.has(product.id) ? (
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                                priority={false}
                                loading="lazy"
                                quality={85}
                                onError={() => handleImageError(product.id)}
                                unoptimized={false}
                              />
                            ) : (
                              <svg
                                className="w-8 h-8 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 200 200"
                              >
                                <path
                                  d="M60 80 L140 80 L140 160 L60 160 Z"
                                  fill="none"
                                  stroke="#d1d5db"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="100"
                                  cy="110"
                                  r="8"
                                  fill="#d1d5db"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Application */}
                      <td className="py-6 px-4">
                        <p className="text-gray-600 text-sm">
                          {product.application}
                        </p>
                      </td>

                      {/* Features */}
                      <td className="py-6 px-4">
                        <ul className="space-y-1">
                          {product.features?.slice(0, 3).map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-gray-600 text-sm flex items-center gap-2"
                            >
                              <span className="size-1 rounded-full bg-gray-400" />
                              {feature}
                            </li>
                          ))}
                          {product.features?.length > 3 && (
                            <li className="text-gray-500 text-sm italic">
                              +{product.features.length - 3}{" "}
                              {t("products.productGrid.noResults")}
                            </li>
                          )}
                        </ul>
                      </td>

                      {/* Actions */}
                      <td className="py-6 px-4">
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => onDetail && onDetail(product.id)}
                            className="bg-[#ca161e] hover:bg-[#a01318] text-white rounded-sm text-sm px-4"
                          >
                            {t("products.productCard.viewDetails")}
                          </Button>
                          <Button
                            onClick={() => onRequest && onRequest(product.id)}
                            className="bg-[#1f4faa] hover:bg-[#173d85] text-white rounded-sm text-sm px-4"
                          >
                            {t("products.productCard.addToCart")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible only on mobile and tablet */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
              {memoizedProducts.map((product) => (
                <CardView key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t("products.productGrid.noResults")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
});

ProductTable.displayName = "ProductTable";

export default ProductTable;
