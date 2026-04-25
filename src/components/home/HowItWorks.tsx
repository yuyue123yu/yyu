import { Search, MessageSquare, FileCheck, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "描述问题",
    description: "简单描述您的法律需求",
    time: "1 分钟"
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "匹配律师",
    description: "AI 智能推荐最合适的律师",
    time: "2 分钟"
  },
  {
    icon: FileCheck,
    number: "03",
    title: "免费咨询",
    description: "与律师在线沟通，获得建议",
    time: "30 分钟"
  },
  {
    icon: ThumbsUp,
    number: "04",
    title: "解决问题",
    description: "满意后再付费，透明定价",
    time: "按需"
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            如何开始？
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            4 步轻松获得专业法律服务
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -z-10"></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 text-center">
                    {/* Number badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-4 shadow-lg">
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <div className="text-sm font-bold text-blue-600 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      ⏱️ {step.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            💡 平均只需 <span className="font-bold text-blue-600">33 分钟</span> 就能找到合适的律师
          </p>
        </div>
      </div>
    </section>
  );
}
