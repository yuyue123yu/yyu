"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  fetchLawyers, 
  lawyerSpecialties,
  malaysianStates,
  type Lawyer 
} from "@/lib/api/lawyers";
import { Star, MapPin, Clock, CheckCircle, Heart, ShoppingCart, Search, Filter } from "lucide-react";

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    minRating: 0,
    available: undefined as boolean | undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadLawyers();
  }, [filters]);

  const loadLawyers = async () => {
    setLoading(true);
    const data = await fetchLawyers(filters);
    setLawyers(data);
    setLoading(false);
  };

  const filteredLawyers = lawyers.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.specialty.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              专业律师团队
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              500+ 认证律师，为您提供专业法律服务
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索律师姓名或专业领域..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-neutral-900 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-bold text-neutral-900">筛选条件</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  专业领域
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">全部领域</option>
                  {lawyerSpecialties.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.nameCn} ({spec.lawyerCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  地区
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">全部地区</option>
                  {malaysianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  最低评分
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="0">全部评分</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.7">4.7+ ⭐</option>
                  <option value="4.8">4.8+ ⭐</option>
                  <option value="4.9">4.9+ ⭐</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  在线状态
                </label>
                <select
                  value={filters.available === undefined ? "" : filters.available.toString()}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    available: e.target.value === "" ? undefined : e.target.value === "true" 
                  })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">全部状态</option>
                  <option value="true">在线</option>
                  <option value="false">离线</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.specialty || filters.location || filters.minRating > 0 || filters.available !== undefined) && (
              <button
                onClick={() => setFilters({ specialty: "", location: "", minRating: 0, available: undefined })}
                className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                清除所有筛选
              </button>
            )}
          </div>
        </section>

        {/* Lawyers Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                <p className="mt-4 text-neutral-600">加载中...</p>
              </div>
            ) : filteredLawyers.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-600 text-lg">未找到符合条件的律师</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-neutral-600">
                    找到 <span className="font-bold text-primary-600">{filteredLawyers.length}</span> 位律师
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLawyers.map((lawyer) => (
                    <div
                      key={lawyer.id}
                      className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* Avatar Section */}
                      <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-32 flex items-center justify-center text-5xl relative">
                        👨‍⚖️
                        {lawyer.available && (
                          <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">
                          {lawyer.name}
                        </h3>
                        
                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {lawyer.specialty.slice(0, 2).map((spec, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-neutral-900">{lawyer.rating}</span>
                          </div>
                          <span className="text-sm text-neutral-600">
                            ({lawyer.reviews} 评价)
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-sm text-neutral-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{lawyer.location}</span>
                        </div>

                        {/* Response Time */}
                        <div className="flex items-center gap-1 text-sm text-neutral-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>响应时间: {lawyer.responseTime}</span>
                        </div>

                        {/* Experience */}
                        <div className="flex items-center gap-1 text-sm text-neutral-600 mb-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{lawyer.experience} 年经验</span>
                        </div>

                        {/* Clients Served */}
                        <div className="text-sm text-neutral-600 mb-3">
                          已服务 <span className="font-bold text-primary-600">{lawyer.soldCount}</span> 位客户
                        </div>

                        {/* Price */}
                        <div className="text-lg font-bold text-primary-600 mb-4">
                          {lawyer.priceRange}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            咨询
                          </button>
                          <button className="px-3 py-2 border border-neutral-300 hover:border-primary-300 rounded-lg transition-all">
                            <Heart className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
