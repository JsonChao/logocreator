/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
    ],
    unoptimized: true, // 禁用服务器端图像优化
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Edge运行时Stream模块兼容性处理
    if (nextRuntime === 'edge') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve('stream-browserify'),
      };
    }
    return config;
  },
};

export default nextConfig;
