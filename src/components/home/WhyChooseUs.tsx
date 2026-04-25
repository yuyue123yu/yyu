import { Shield, Zap, DollarSign, Users, Award, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% 认证保障",
    description: "所有律师均经过严格的资质审核和背景调查，确保专业可靠"
  },
  {
    icon: Zap,
    title: "快速响应",
    description: "平均 2 小时内获得律师回复，紧急情况可安排即时咨询"
  },
  {
    icon: DollarSign,
    title: "透明定价",
    description: "明码标价，无隐藏费用。首次咨询免费，满意后再付费"
  },
  {
    icon: Users,
    title: "智能匹配",
    description: "AI 算法根据您的需求，精准推荐最合适的专业律师"
  },
  {
    icon: Award,
    title: "服务保障",
    description: "不满意全额退款，让您零风险体验专业法律服务"
  },
  {
    icon: Clock,
    title: "24/7 在线",
    description: "随时随地在线咨询，不受时间和地点限制"
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            为什么选择 LegalMY？
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            我们致力于让法律服务更便捷、更透明、更可靠
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
