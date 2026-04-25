import Link from "next/link";
import { FaGavel, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FaGavel className="text-primary-400 text-lg" />
              <span className="text-lg font-bold text-white">MyLegal</span>
            </div>
            <p className="text-xs leading-relaxed">
              马来西亚在线法律咨询平台
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-xs">快速链接</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/lawyers" className="hover:text-primary-400 transition-colors">找律师</Link></li>
              <li><Link href="/practice-areas" className="hover:text-primary-400 transition-colors">专业领域</Link></li>
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">关于我们</Link></li>
            </ul>
          </div>

          {/* For Lawyers */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-xs">律师专区</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/lawyer-register" className="hover:text-primary-400 transition-colors">加入我们</Link></li>
              <li><Link href="/lawyer-login" className="hover:text-primary-400 transition-colors">律师登录</Link></li>
              <li><Link href="/support" className="hover:text-primary-400 transition-colors">帮助支持</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-xs">法律信息</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition-colors">服务条款</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">联系我们</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>&copy; 2026 MyLegal. 保留所有权利。</p>
          <p className="mt-2">符合马来西亚个人数据保护法（PDPA）</p>
        </div>
      </div>
    </footer>
  );
}
