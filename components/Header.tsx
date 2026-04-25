"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGavel, FaBars, FaTimes, FaUser } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FaGavel className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold text-gray-900">MyLegal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link href="/lawyers" className="text-gray-700 hover:text-primary-600 transition-colors">
              找律师
            </Link>
            <Link href="/practice-areas" className="text-gray-700 hover:text-primary-600 transition-colors">
              专业领域
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              关于我们
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors text-sm">
              登录
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">
              注册
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-xl text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2 text-sm">
            <Link href="/lawyers" className="block text-gray-700 hover:text-primary-600 py-2">
              找律师
            </Link>
            <Link href="/practice-areas" className="block text-gray-700 hover:text-primary-600 py-2">
              专业领域
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-primary-600 py-2">
              关于我们
            </Link>
            <div className="pt-2 space-y-2">
              <Link href="/login" className="block text-center py-2 text-primary-600">
                登录
              </Link>
              <Link href="/register" className="block text-center btn-primary py-2">
                注册
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
