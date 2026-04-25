import { FaShieldAlt, FaClock, FaVideo, FaMoneyBillWave, FaStar, FaGlobe } from "react-icons/fa";

const features = [
  {
    icon: FaShieldAlt,
    title: "持牌认证",
    description: "所有律师均通过Bar Council认证，持有有效执业执照",
  },
  {
    icon: FaClock,
    title: "即时咨询",
    description: "工作日30分钟内响应，24/7全天服务",
  },
  {
    icon: FaVideo,
    title: "多种方式",
    description: "视频、语音、文字、邮件等多种咨询方式",
  },
  {
    icon: FaMoneyBillWave,
    title: "透明收费",
    description: "明码标价，无隐藏费用，支持本地支付",
  },
  {
    icon: FaStar,
    title: "真实评价",
    description: "来自真实咨询记录的客户评价",
  },
  {
    icon: FaGlobe,
    title: "多语言",
    description: "支持中文、英文、马来文、淡米尔文",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            为什么选择 MyLegal
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            简洁、透明、专业的法律咨询服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                <feature.icon className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
