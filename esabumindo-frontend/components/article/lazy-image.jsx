// components/article/lazy-image.jsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export function LazyImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  priority = false,
  sizes,
  objectFit = "cover",
  onLoad,
}) {
  const [isLoading, setIsLoading] = useState(priority ? false : true);
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (priority) {
      // Priority images load immediately
      setImageSrc(src);
      return;
    }

    // Lazy loading setup dengan Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !imageSrc) {
            setImageSrc(src);
            setIsLoading(true);
            // Unobserve setelah trigger
            if (observerRef.current) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observer.disconnect();
      }
    };
  }, [priority, src, imageSrc]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setError(true);
    setIsLoading(false);
  };

  // Validasi src dengan sanitasi lebih ketat
  if (!src) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-gray-200 ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-xs sm:text-sm">No image</span>
        </div>
      </div>
    );
  }

  // Fallback placeholder untuk error
  if (error) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}
        style={{ minHeight: fill ? "auto" : "200px" }}
      >
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-400 text-xs">Image failed to load</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
        )}
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={alt || "Image"}
            fill
            sizes={sizes}
            priority={priority}
            className={`${
              objectFit === "cover" ? "object-cover" : "object-contain"
            } ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
            onLoad={handleLoadingComplete}
            onError={handleError}
            unoptimized
          />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
      )}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={alt || "Image"}
          width={width}
          height={height}
          priority={priority}
          className={`${
            objectFit === "cover" ? "object-cover" : "object-contain"
          } ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          onLoad={handleLoadingComplete}
          onError={handleError}
          unoptimized
        />
      )}
    </div>
  );
}
