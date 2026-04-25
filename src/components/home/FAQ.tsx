"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "如何开始使用 LegalMY 的服务？",
    answer: "非常简单！只需在首页搜索框描述您的法律问题，我们的 AI 系统会为您匹配最合适的律师。您可以先进行免费咨询，满意后再决定是否继续深度服务。"
  },
  {
    question: "费用是如何计算的？",
    answer: "我们采用透明定价模式。首次咨询完全免费（30分钟内）。后续服务根据案件复杂度和律师经验定价，从 RM 2,000 起。所有费用在服务前明确告知，无隐藏收费。"
  },
  {
    question: "律师的资质如何保证？",
    answer: "所有入驻律师必须通过严格审核：1) 马来西亚律师协会认证 2) 至少 5 年执业经验 3) 无不良记录 4) 通过我们的专业测试。我们会持续监控律师服务质量。"
  },
  {
    question: "如果对服务不满意怎么办？",
    answer: "我们提供 100% 满意保障。如果您对律师服务不满意，可以在 7 天内申请全额退款。我们也会重新为您匹配其他律师，确保您的问题得到妥善解决。"
  },
  {
    question: "在线咨询和线下见面有什么区别？",
    answer: "在线咨询更便捷、快速，适合初步咨询和简单案件。复杂案件或需要出庭的情况，律师会建议线下见面。两种方式都同样专业，您可以根据需求选择。"
  },
  {
    question: "我的信息会保密吗？",
    answer: "绝对保密！我们采用银行级加密技术保护您的数据。所有律师都签署了严格的保密协议。您的个人信息和案件细节不会被泄露给任何第三方。"
  },
  {
    question: "多久能得到律师的回复？",
    answer: "平均 2 小时内会收到律师回复。紧急情况可以标注加急，我们会在 30 分钟内安排律师联系您。工作日响应更快，周末和节假日可能稍有延迟。"
  },
  {
    question: "可以更换律师吗？",
    answer: "当然可以！如果您觉得当前律师不合适，随时可以申请更换。我们会根据您的反馈，重新为您匹配更合适的律师，不收取额外费用。"
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            常见问题
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            快速了解我们的服务
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">还有其他问题？</p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all"
          >
            联系客服
          </a>
        </div>
      </div>
    </section>
  );
}
