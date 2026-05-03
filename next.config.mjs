/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // 部署到 GitHub Pages 的配置
  basePath: '/yyu',
  assetPrefix: '/yyu/',
};

export default nextConfig;
