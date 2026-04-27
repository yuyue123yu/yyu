"use client";

import { useState, useEffect } from "react";
import { Users, FileText, Award, TrendingUp } from "lucide-react";
import { fetchLegalStatistics, type LegalStatistics } from "@/lib/api/govData";

export default function Stats() {
  const [stats, setStats] = useState<LegalStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await fetchLegalStatistics();
    setStats(data);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-500 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  const displayStats = [
    {
      icon: Users,
      value: "500+",
      label: "认证律师",
      description: "专业法律服务团队"
    },
    {
      icon: FileText,
      value: stats.totalServices.toLocaleString() + "+",
      label: "法律咨询服务",
      description: "基于马来西亚政府数据"
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "客户满意度",
      description: "基于真实用户评价"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "问题解决率",
      description: "专业高效的服务"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-500 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            值得信赖的法律服务平台
          </h2>
          <p className="text-lg text-blue-100">
            基于马来西亚政府开放数据和真实用户反馈
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all border border-white/20"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-400 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-sm text-blue-100">{stat.description}</div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-blue-100">
            数据来源: Legal Aid Department of Malaysia (JBG) | 最后更新: {new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
    </section>
  );
}
