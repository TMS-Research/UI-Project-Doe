/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  generateBuildId: () => {
    return Date.now().toString();
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
