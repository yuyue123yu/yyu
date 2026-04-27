import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">服务</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/family" className="hover:text-gray-900">家庭法</Link></li>
              <li><Link href="/services/business" className="hover:text-gray-900">商业法</Link></li>
              <li><Link href="/services/property" className="hover:text-gray-900">房产法</Link></li>
              <li><Link href="/services/criminal" className="hover:text-gray-900">刑事法</Link></li>
            </ul>
          </div>

          {/* Lawyers */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">律师</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/lawyers" className="hover:text-gray-900">浏览律师</Link></li>
              <li><Link href="/consultation" className="hover:text-gray-900">预约咨询</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900">加入我们</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">关于</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-gray-900">关于我们</Link></li>
              <li><Link href="/knowledge" className="hover:text-gray-900">法律资讯</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900">联系我们</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">支持</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="hover:text-gray-900">帮助中心</Link></li>
              <li><Link href="/help" className="hover:text-gray-900">常见问题</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900">联系客服</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">法律</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-gray-900">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900">服务条款</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 LegalMY. All rights reserved.</p>
          <p className="mt-4 md:mt-0">马来西亚 | Kuala Lumpur</p>
        </div>
      </div>
    </footer>
  );
}
