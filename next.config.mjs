/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
