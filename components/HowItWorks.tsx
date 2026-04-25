import { FaSearch, FaCalendarAlt, FaComments, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    icon: FaSearch,
    title: "搜索律师",
    description: "按领域、地区、语言筛选",
  },
  {
    icon: FaCalendarAlt,
    title: "预约咨询",
    description: "选择时间预约",
  },
  {
    icon: FaComments,
    title: "在线咨询",
    description: "与律师沟通",
  },
  {
    icon: FaCheckCircle,
    title: "获得建议",
    description: "获得法律方案",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            简单四步
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            快速获得专业法律帮助
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-4 relative">
                <step.icon className="text-2xl" />
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
