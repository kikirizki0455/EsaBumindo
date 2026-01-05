"use client";

import { ProductCard } from "./product-card";

export default function ProductGrid({ title, products, onDetail, onPreOrder }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-8">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDetail={onDetail}
              onPreOrder={onPreOrder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
