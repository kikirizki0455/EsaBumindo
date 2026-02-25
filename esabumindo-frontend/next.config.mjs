/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // ✅ Enable gzip compression
  poweredByHeader: false, // ✅ Remove X-Powered-By header untuk security
  productionBrowserSourceMaps: false, // ✅ Disable source maps di production

  // ✅ Turbopack configuration (replace webpack)
  turbopack: {
    // ✅ Empty config tells Next.js to use Turbopack defaults
    // This is the recommended approach for most apps
  },

  // ✅ Experimental features - Turbopack compatible
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/*",
      "html-react-parser",
    ],
  },

  // ✅ Compiler options untuk smaller bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.esabumindo.com",
      },
    ],
    minimumCacheTTL: 31536000, // ✅ 1 tahun cache untuk static images
    formats: ["image/avif", "image/webp"],
    // ✅ Disable static imports optimization untuk flexibility
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // ✅ Device sizes untuk responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // ✅ Allowed quality values
    qualities: [75, 80],
  },

  // ✅ i18n configuration untuk SEO multilingual
  i18n: {
    locales: ["id", "en"],
    defaultLocale: "id",
    localeDetection: false, // ✅ Disable auto-detection untuk consistency
  },

  // ✅ Headers untuk SEO dan performa
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      // ✅ Assets static cache
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ Static assets - long cache
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ Images cache
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/asset/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ API cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },

  // ✅ Redirects untuk SEO
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/product",
        permanent: true, // 301 redirect untuk SEO
      },
      {
        source: "/tentang-kami",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/hubungi-kami",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/artikel",
        destination: "/article",
        permanent: true,
      },
    ];
  },

  // ✅ Rewrites untuk clean URLs
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/api/sitemap",
        },
        {
          source: "/robots.txt",
          destination: "/api/robots",
        },
      ],
    };
  },
};

export default nextConfig;
