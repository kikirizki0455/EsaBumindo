import { Skeleton } from "@/components/ui/skeleton";

export default function PreOrderFormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-24" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-6 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
              {/* Section 1 */}
              <div className="pb-8 border-b border-gray-200 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Section 2 */}
              <div className="pb-8 border-b border-gray-200 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Section 3 */}
              <div className="pb-8 border-b border-gray-200 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>

              {/* Contact Method */}
              <div className="pb-8 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              </div>

              {/* Submit Button */}
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-8 w-40" />
              <div className="space-y-3 py-4 border-t border-b border-gray-200">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-32 rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
