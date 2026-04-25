import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "李明",
    role: "企业主",
    content: "通过MyLegal找到了专业的商业律师，帮助我完成了公司注册和合同审查。整个过程非常顺畅，律师的建议为我节省了不少成本。强烈推荐！",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    role: "离婚案当事人",
    content: "在处理离婚和子女抚养权案件时，平台上的律师给了我很大的帮助和支持。她非常耐心地解释了整个法律程序，让我感到安心。收费透明，服务贴心。",
    rating: 5,
  },
  {
    id: 3,
    name: "David Tan",
    role: "房地产投资者",
    content: "房产交易的法律问题很复杂，但律师解释得非常清楚。在线咨询很方便，节省了我很多时间。已经推荐给多个朋友使用，他们都很满意。",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            客户评价
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            来自真实用户的反馈
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card p-6">
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-gold-500 mr-1" size={16} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="border-t pt-3">
                <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
