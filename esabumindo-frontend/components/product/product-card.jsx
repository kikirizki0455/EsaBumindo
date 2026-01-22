"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCard({ product, onDetail, onPreOrder }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-[#f5f0f0] flex items-center justify-center">
        {!imageError ? (
          <Image
            src={product.image}
            alt={`${product.title} - ${product.application}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
            loading="lazy"
            quality={85}
            onError={handleImageError}
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

      {/* Product Info */}
      <CardContent className="p-6">
        <h3 className="mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-3">{product.application}</p>

        {/* Features List */}
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onDetail && onDetail(product.id)}
            className="flex-1 bg-[#ca161e] hover:bg-[#a01318] text-white rounded-sm"
          >
            Detail
          </Button>
          <Button
            onClick={() => onPreOrder && onPreOrder(product.id)}
            className="flex-1 bg-[#1f4faa] hover:bg-[#173d85] text-white rounded-sm"
          >
            Pre Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
