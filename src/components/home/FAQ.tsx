"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const faqsData = [
  {
    questionZh: "如何开始使用 LegalMY 的服务？",
    answerZh: "非常简单！只需在首页搜索框描述您的法律问题，我们的 AI 系统会为您匹配最合适的律师。您可以先进行免费咨询，满意后再决定是否继续深度服务。",
    questionEn: "How do I start using LegalMY services?",
    answerEn: "It's simple! Just describe your legal issue in the search box on the homepage, and our AI system will match you with the most suitable lawyer. You can start with a free consultation and decide whether to continue with in-depth services.",
    questionMs: "Bagaimana saya boleh mula menggunakan perkhidmatan LegalMY?",
    answerMs: "Sangat mudah! Hanya huraikan isu undang-undang anda dalam kotak carian di laman utama, dan sistem AI kami akan memadankan anda dengan peguam yang paling sesuai. Anda boleh bermula dengan perundingan percuma dan memutuskan sama ada untuk meneruskan dengan perkhidmatan mendalam."
  },
  {
    questionZh: "费用是如何计算的？",
    answerZh: "我们采用透明定价模式。首次咨询完全免费（30分钟内）。后续服务根据案件复杂度和律师经验定价，从 RM 2,000 起。所有费用在服务前明确告知，无隐藏收费。",
    questionEn: "How are fees calculated?",
    answerEn: "We use transparent pricing. First consultation is completely free (within 30 minutes). Subsequent services are priced based on case complexity and lawyer experience, starting from RM 2,000. All fees are clearly communicated before service, with no hidden charges.",
    questionMs: "Bagaimana yuran dikira?",
    answerMs: "Kami menggunakan harga telus. Perundingan pertama adalah percuma sepenuhnya (dalam masa 30 minit). Perkhidmatan seterusnya dihargakan berdasarkan kerumitan kes dan pengalaman peguam, bermula dari RM 2,000. Semua yuran dimaklumkan dengan jelas sebelum perkhidmatan, tanpa caj tersembunyi."
  },
  {
    questionZh: "律师的资质如何保证？",
    answerZh: "所有入驻律师必须通过严格审核：1) 马来西亚律师协会认证 2) 至少 5 年执业经验 3) 无不良记录 4) 通过我们的专业测试。我们会持续监控律师服务质量。",
    questionEn: "How are lawyer qualifications guaranteed?",
    answerEn: "All registered lawyers must pass strict verification: 1) Malaysian Bar Council certification 2) At least 5 years of practice experience 3) Clean record 4) Pass our professional assessment. We continuously monitor lawyer service quality.",
    questionMs: "Bagaimana kelayakan peguam dijamin?",
    answerMs: "Semua peguam berdaftar mesti lulus pengesahan ketat: 1) Pensijilan Majlis Peguam Malaysia 2) Sekurang-kurangnya 5 tahun pengalaman amalan 3) Rekod bersih 4) Lulus penilaian profesional kami. Kami sentiasa memantau kualiti perkhidmatan peguam."
  },
  {
    questionZh: "如果对服务不满意怎么办？",
    answerZh: "我们提供 100% 满意保障。如果您对律师服务不满意，可以在 7 天内申请全额退款。我们也会重新为您匹配其他律师，确保您的问题得到妥善解决。",
    questionEn: "What if I'm not satisfied with the service?",
    answerEn: "We offer 100% satisfaction guarantee. If you're not satisfied with the lawyer's service, you can request a full refund within 7 days. We'll also rematch you with another lawyer to ensure your issue is properly resolved.",
    questionMs: "Bagaimana jika saya tidak berpuas hati dengan perkhidmatan?",
    answerMs: "Kami menawarkan jaminan kepuasan 100%. Jika anda tidak berpuas hati dengan perkhidmatan peguam, anda boleh meminta bayaran balik penuh dalam masa 7 hari. Kami juga akan memadankan anda dengan peguam lain untuk memastikan isu anda diselesaikan dengan baik."
  },
  {
    questionZh: "在线咨询和线下见面有什么区别？",
    answerZh: "在线咨询更便捷、快速，适合初步咨询和简单案件。复杂案件或需要出庭的情况，律师会建议线下见面。两种方式都同样专业，您可以根据需求选择。",
    questionEn: "What's the difference between online consultation and in-person meeting?",
    answerEn: "Online consultation is more convenient and faster, suitable for initial consultations and simple cases. For complex cases or court appearances, lawyers will recommend in-person meetings. Both methods are equally professional, and you can choose based on your needs.",
    questionMs: "Apakah perbezaan antara perundingan dalam talian dan pertemuan secara peribadi?",
    answerMs: "Perundingan dalam talian lebih mudah dan pantas, sesuai untuk perundingan awal dan kes mudah. Untuk kes kompleks atau kehadiran mahkamah, peguam akan mengesyorkan pertemuan secara peribadi. Kedua-dua kaedah sama profesional, dan anda boleh memilih berdasarkan keperluan anda."
  },
  {
    questionZh: "我的信息会保密吗？",
    answerZh: "绝对保密！我们采用银行级加密技术保护您的数据。所有律师都签署了严格的保密协议。您的个人信息和案件细节不会被泄露给任何第三方。",
    questionEn: "Will my information be kept confidential?",
    answerEn: "Absolutely confidential! We use bank-level encryption to protect your data. All lawyers have signed strict confidentiality agreements. Your personal information and case details will not be disclosed to any third party.",
    questionMs: "Adakah maklumat saya akan dirahsiakan?",
    answerMs: "Benar-benar sulit! Kami menggunakan penyulitan tahap bank untuk melindungi data anda. Semua peguam telah menandatangani perjanjian kerahsiaan yang ketat. Maklumat peribadi dan butiran kes anda tidak akan didedahkan kepada mana-mana pihak ketiga."
  },
  {
    questionZh: "多久能得到律师的回复？",
    answerZh: "平均 2 小时内会收到律师回复。紧急情况可以标注加急，我们会在 30 分钟内安排律师联系您。工作日响应更快，周末和节假日可能稍有延迟。",
    questionEn: "How long until I get a lawyer's response?",
    answerEn: "You'll receive a lawyer's response within an average of 2 hours. For urgent cases, you can mark it as urgent, and we'll arrange for a lawyer to contact you within 30 minutes. Weekday responses are faster, weekends and holidays may have slight delays.",
    questionMs: "Berapa lama sehingga saya mendapat respons peguam?",
    answerMs: "Anda akan menerima respons peguam dalam purata 2 jam. Untuk kes kecemasan, anda boleh menandakannya sebagai mendesak, dan kami akan mengatur peguam untuk menghubungi anda dalam masa 30 minit. Respons hari bekerja lebih pantas, hujung minggu dan cuti mungkin ada sedikit kelewatan."
  },
  {
    questionZh: "可以更换律师吗？",
    answerZh: "当然可以！如果您觉得当前律师不合适，随时可以申请更换。我们会根据您的反馈，重新为您匹配更合适的律师，不收取额外费用。",
    questionEn: "Can I change lawyers?",
    answerEn: "Of course! If you feel the current lawyer is not suitable, you can request a change at any time. Based on your feedback, we'll rematch you with a more suitable lawyer at no additional cost.",
    questionMs: "Bolehkah saya menukar peguam?",
    answerMs: "Sudah tentu! Jika anda rasa peguam semasa tidak sesuai, anda boleh meminta pertukaran pada bila-bila masa. Berdasarkan maklum balas anda, kami akan memadankan anda dengan peguam yang lebih sesuai tanpa kos tambahan."
  },
];

export default function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const getFAQText = (faq: any, field: 'question' | 'answer') => {
    if (language === 'zh') return field === 'question' ? faq.questionZh : faq.answerZh;
    if (language === 'en') return field === 'question' ? faq.questionEn : faq.answerEn;
    return field === 'question' ? faq.questionMs : faq.answerMs;
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            {t('home.faqTitle')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t('home.faqSubtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqsData.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {getFAQText(faq, 'question')}
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
                  {getFAQText(faq, 'answer')}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">{t('home.moreQuestions')}</p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all"
          >
            {t('home.contactSupport')}
          </a>
        </div>
      </div>
    </section>
  );
}
