// components/article/article-skeleton.jsx
"use client";

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 overflow-hidden bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Date/Author Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>

        {/* Read More Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export function FeaturedArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Skeleton */}
        <div className="relative h-64 md:h-full bg-gray-200" />

        {/* Content Skeleton */}
        <div className="p-8 md:p-12 space-y-6">
          {/* Badge Skeleton */}
          <div className="h-6 bg-gray-200 rounded-full w-24" />

          {/* Title Skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Excerpt Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>

          {/* Meta Skeleton */}
          <div className="flex gap-4 pt-4">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>

          {/* Read More Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen space-y-8 animate-pulse">
      {/* Header */}
      <div className="bg-gray-100 pt-8 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="h-6 bg-gray-200 rounded-full w-20" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-full" />
            <div className="h-8 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>

          {/* Meta */}
          <div className="flex gap-4 pt-4">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="aspect-[16/9] bg-gray-200 rounded-xl" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
