"use client";

import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            马来西亚在线法律咨询平台
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-100">
            连接持牌律师 • 即时咨询 • 透明收费
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 max-w-2xl">
            <input
              type="text"
              placeholder="搜索律师或法律领域..."
              className="flex-1 px-4 py-3 text-gray-900 outline-none rounded-lg"
            />
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
              <FaSearch />
              <span>搜索</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
            <div>
              <div className="text-3xl font-bold text-gold-400">800+</div>
              <div className="text-primary-200 text-sm mt-1">持牌律师</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">25K+</div>
              <div className="text-primary-200 text-sm mt-1">成功咨询</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">4.9/5</div>
              <div className="text-primary-200 text-sm mt-1">客户评分</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
