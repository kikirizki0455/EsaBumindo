import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-24" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div>
            <Skeleton className="aspect-square rounded-lg mb-4" />
            <Skeleton className="h-6 w-40" />
          </div>

          {/* Info */}
          <div>
            <Skeleton className="h-8 w-20 rounded-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-6" />

            {/* Features */}
            <div className="mb-8 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <Skeleton className="h-14 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8 flex gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
