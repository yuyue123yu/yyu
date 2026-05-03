"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HelpPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqCategories = [
    {
      category: "账户与注册",
      questions: [
        {
          q: "如何注册 LegalMY 账户？",
          a: "点击页面右上角的「注册」按钮，填写您的姓名、邮箱、手机号和密码即可完成注册。注册后您可以浏览律师、预约咨询、下载法律文档等。"
        },
        {
          q: "忘记密码怎么办？",
          a: "在登录页面点击「忘记密码」，输入您的注册邮箱，我们会发送重置密码的链接到您的邮箱。"
        },
        {
          q: "如何修改个人信息？",
          a: "登录后点击右上角的用户头像，进入「个人中心」即可修改您的个人信息、联系方式等。"
        }
      ]
    },
    {
      category: "律师咨询",
      questions: [
        {
          q: "如何预约律师咨询？",
          a: "浏览律师列表，选择合适的律师，点击「预约咨询」按钮，填写咨询信息和时间，提交后律师会在24小时内与您联系确认。"
        },
        {
          q: "咨询费用如何计算？",
          a: "每位律师的咨询费用不同，通常在 RM 200-500/小时之间。具体费用在律师详情页面会明确标注，预约前请仔细查看。"
        },
        {
          q: "可以取消或改期预约吗？",
          a: "可以。在预约时间前24小时可免费取消或改期。24小时内取消将收取30%的手续费。请在「我的预约」中操作。"
        },
        {
          q: "咨询方式有哪些？",
          a: "我们提供线上视频咨询、电话咨询和线下面谈三种方式。您可以根据自己的需求选择最合适的咨询方式。"
        }
      ]
    },
    {
      category: "法律文档",
      questions: [
        {
          q: "如何下载法律文档模板？",
          a: "进入「法律文档」页面，选择您需要的文档类别和语言，点击「下载」按钮即可获得 PDF 格式的文档模板。"
        },
        {
          q: "文档模板是免费的吗？",
          a: "是的，所有文档模板都可以免费下载使用。我们提供 690+ 份涵盖各个领域的法律文档模板。"
        },
        {
          q: "文档支持哪些语言？",
          a: "我们的文档模板支持三种语言：英语、马来语和中文。您可以根据需要选择合适的语言版本。"
        },
        {
          q: "下载的文档可以直接使用吗？",
          a: "文档模板提供了标准格式和条款，但建议您根据实际情况修改，或咨询律师后使用，以确保符合您的具体需求。"
        }
      ]
    },
    {
      category: "支付与退款",
      questions: [
        {
          q: "支持哪些支付方式？",
          a: "我们支持信用卡/借记卡、在线银行转账、电子钱包（Touch n Go、GrabPay）等多种支付方式。"
        },
        {
          q: "支付安全吗？",
          a: "是的，我们使用银行级别的加密技术保护您的支付信息，所有交易都经过安全认证。"
        },
        {
          q: "如何申请退款？",
          a: "如果服务未开始，您可以在「我的订单」中申请全额退款。服务已开始的情况下，退款政策根据具体服务类型而定。"
        },
        {
          q: "退款多久到账？",
          a: "退款申请审核通过后，款项会在 5-7 个工作日内退回您的原支付账户。"
        }
      ]
    },
    {
      category: "法律知识",
      questions: [
        {
          q: "法律资讯文章可靠吗？",
          a: "所有法律资讯文章都由我们的专业律师团队撰写和审核，确保内容准确可靠，符合马来西亚最新法律法规。"
        },
        {
          q: "如何搜索相关法律知识？",
          a: "在「法律资讯」页面使用搜索功能，输入关键词即可找到相关文章。您也可以按类别浏览。"
        },
        {
          q: "可以咨询文章中的法律问题吗？",
          a: "可以。如果您对文章内容有疑问，可以直接预约相关领域的律师进行详细咨询。"
        }
      ]
    },
    {
      category: "其他问题",
      questions: [
        {
          q: "LegalMY 的服务覆盖哪些地区？",
          a: "我们的服务覆盖马来西亚全国，包括吉隆坡、槟城、新山、马六甲等所有主要城市。"
        },
        {
          q: "如何成为平台律师？",
          a: "如果您是持有马来西亚律师执业资格的律师，欢迎访问「加入我们」页面提交申请，我们会尽快与您联系。"
        },
        {
          q: "客服工作时间是？",
          a: "我们的客服团队工作时间为周一至周五 9:00-18:00，周六 9:00-13:00。您也可以随时通过邮件联系我们。"
        },
        {
          q: "如何提供反馈或建议？",
          a: "我们非常重视用户的反馈。您可以通过「联系我们」页面提交您的意见和建议，或发送邮件至 feedback@legalmy.com。"
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 text-center">{t('help.title')}</h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto mb-8">
            {t('help.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('help.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('help.faqTitle')}</h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t('help.noResults')}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = catIndex * 100 + faqIndex;
                      const isOpen = openFAQ === globalIndex;
                      
                      return (
                        <div
                          key={faqIndex}
                          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                        >
                          <button
                            onClick={() => setOpenFAQ(isOpen ? null : globalIndex)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900">{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('help.stillHaveQuestions')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('help.onlineSupport')}</h3>
              <p className="text-gray-600 mb-4">{t('help.workingHours')}</p>
              <Link
                href="/contact"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('help.contactSupport')}
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('help.emailSupport')}</h3>
              <p className="text-gray-600 mb-4">{t('help.replyWithin24h')}</p>
              <a
                href="mailto:support@legalmy.com"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('help.sendEmail')}
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Phone className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('help.phoneSupport')}</h3>
              <p className="text-gray-600 mb-4">+60 3-1234 5678</p>
              <a
                href="tel:+60312345678"
                className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {t('help.callNow')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
