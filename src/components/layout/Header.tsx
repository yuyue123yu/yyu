"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scale, Phone } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="bg-primary-700 text-white py-2">
        <div className="container mx-auto px-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              24/7 热线：+60 3-1234 5678
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="hover:text-accent-400 transition-colors">
              登录
            </Link>
            <span className="text-neutral-400">|</span>
            <Link href="/register" className="hover:text-accent-400 transition-colors">
              注册
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-primary-700 tracking-tight">
                LegalMY
              </span>
              <p className="text-xs text-neutral-500">专业法律咨询平台</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              法律服务
            </Link>
            <Link href="/lawyers" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              律师团队
            </Link>
            <Link href="/contact" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              关于我们
            </Link>
            <Link href="/knowledge" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              法律资讯
            </Link>
            <Link 
              href="/consultation" 
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              免费咨询
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-4 space-y-4 border-t border-neutral-200 pt-4">
            <Link href="/services" className="block text-neutral-700 hover:text-primary-600 py-2 font-medium">
              法律服务
            </Link>
            <Link href="/lawyers" className="block text-neutral-700 hover:text-primary-600 py-2 font-medium">
              律师团队
            </Link>
            <Link href="/contact" className="block text-neutral-700 hover:text-primary-600 py-2 font-medium">
              关于我们
            </Link>
            <Link href="/knowledge" className="block text-neutral-700 hover:text-primary-600 py-2 font-medium">
              法律资讯
            </Link>
            <Link 
              href="/consultation" 
              className="block bg-accent-500 text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-accent-600 transition-all"
            >
              免费咨询
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
