import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "李明",
    role: "企业主",
    company: "科技公司 CEO",
    content: "通过 LegalMY 找到了专业的商业律师，帮我们完成了公司重组。整个过程非常顺利，律师专业且响应迅速。强烈推荐！",
    rating: 5,
    avatar: "👨‍💼",
    case: "商业法"
  },
  {
    name: "Sarah Ahmad",
    role: "个人客户",
    company: "家庭主妇",
    content: "在离婚财产分配的问题上，律师给了我很大帮助。不仅专业，而且非常有耐心，让我在困难时期感到被支持。",
    rating: 5,
    avatar: "👩",
    case: "家庭法"
  },
  {
    name: "Kumar Rajesh",
    role: "房产投资者",
    company: "投资公司",
    content: "处理房产纠纷时，律师的专业知识和谈判技巧让我印象深刻。最终以最优方案解决了问题，节省了大量时间和金钱。",
    rating: 5,
    avatar: "👨‍💼",
    case: "房产法"
  },
  {
    name: "陈美玲",
    role: "创业者",
    company: "电商平台",
    content: "从公司注册到合同审查，律师团队一直在帮助我们。价格透明，服务专业，是创业者的好帮手。",
    rating: 5,
    avatar: "👩‍💼",
    case: "商业法"
  },
  {
    name: "David Tan",
    role: "企业经理",
    company: "制造业",
    content: "劳动纠纷处理得非常专业，律师不仅懂法律，还理解商业运作。给出的建议既合法又实用。",
    rating: 5,
    avatar: "👨",
    case: "劳动法"
  },
  {
    name: "Fatimah Ibrahim",
    role: "个人客户",
    company: "教师",
    content: "第一次使用在线法律咨询，没想到这么方便。律师很专业，解答了我所有的疑问，而且价格合理。",
    rating: 5,
    avatar: "👩‍🏫",
    case: "民事法"
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            客户真实评价
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            超过 50,000 名客户选择信赖我们
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <Quote className="h-8 w-8 text-blue-600 mb-4 opacity-50" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
                <div className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  {testimonial.case}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full">
            <Star className="h-5 w-5 fill-green-500 text-green-500" />
            <span className="font-semibold">4.9/5 平均评分</span>
            <span className="text-green-600">· 基于 12,450+ 条评价</span>
          </div>
        </div>
      </div>
    </section>
  );
}
