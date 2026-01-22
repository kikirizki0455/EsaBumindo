/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["id", "en"],
    defaultLocale: "id",
    localeDetection: true, // Auto-detect browser language
  },
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
    // Tambahkan timeout untuk mencegah infinite optimization loop
    minimumCacheTTL: 60,
    // Disable image optimization jika mengalami error
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
