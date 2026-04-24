/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate static pages at build time for best SEO
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;