import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-6">
        {/* 404 大标题 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <div className="relative -mt-16">
            <h2 className="text-4xl font-bold text-gray-900">页面未找到</h2>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。
          <br />
          请检查 URL 是否正确，或返回首页继续浏览。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上一页
          </button>
        </div>

        {/* 常用链接 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">您可能在寻找：</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/services" className="text-primary-600 hover:text-primary-700 hover:underline">
              法律服务
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/lawyers" className="text-primary-600 hover:text-primary-700 hover:underline">
              律师团队
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/about" className="text-primary-600 hover:text-primary-700 hover:underline">
              关于我们
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 hover:underline">
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
