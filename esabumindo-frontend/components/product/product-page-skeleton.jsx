"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Skeleton className="w-20 h-16" />
            <div className="hidden md:flex gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 w-20" />
              ))}
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="pt-20">
        {/* Product Tag Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>

        {/* Best Seller Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* New Product Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Client Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mx-auto mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-[#060771] py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-32 bg-white/20" />
                <Skeleton className="h-20 w-full bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
