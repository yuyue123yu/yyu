/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 部署配置
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 实验性功能
  experimental: {
    // 跳过静态生成错误
    staticPageGenerationTimeout: 180,
  },
  
  // TypeScript 和 ESLint 配置
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 本地开发时注释掉 basePath
  // basePath: '/yyu',
  // assetPrefix: '/yyu/',
  
  // 安全 Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' https: data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
