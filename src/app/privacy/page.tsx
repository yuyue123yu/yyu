"use client";

import Link from "next/link";
import { Shield, Lock, Eye, Database, UserCheck, FileText, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </Link>
          <h1 className="text-5xl font-bold mb-6">{t('privacy.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {t('privacy.subtitle')}
          </p>
          <p className="text-sm text-blue-200 mt-4">{t('privacy.lastUpdated')}：2026年4月</p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a href="#collection" className="text-blue-600 hover:text-blue-800">{t('privacy.infoCollection')}</a>
            <span className="text-gray-300">|</span>
            <a href="#usage" className="text-blue-600 hover:text-blue-800">{t('privacy.infoUsage')}</a>
            <span className="text-gray-300">|</span>
            <a href="#protection" className="text-blue-600 hover:text-blue-800">{t('privacy.infoProtection')}</a>
            <span className="text-gray-300">|</span>
            <a href="#sharing" className="text-blue-600 hover:text-blue-800">{t('privacy.infoSharing')}</a>
            <span className="text-gray-300">|</span>
            <a href="#rights" className="text-blue-600 hover:text-blue-800">{t('privacy.userRights')}</a>
            <span className="text-gray-300">|</span>
            <a href="#cookies" className="text-blue-600 hover:text-blue-800">{t('privacy.cookies')}</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Information Collection */}
          <div id="collection" className="mb-16">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">1. {t('privacy.infoCollection')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">我们收集的信息类型：</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">个人信息</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>姓名、邮箱地址、手机号码</li>
                    <li>身份证号码（仅在需要时）</li>
                    <li>地址信息</li>
                    <li>支付信息（通过加密的第三方支付处理）</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">使用信息</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>浏览记录、搜索历史</li>
                    <li>设备信息（IP地址、浏览器类型、操作系统）</li>
                    <li>访问时间和频率</li>
                    <li>点击和交互数据</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">咨询信息</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>法律咨询内容和案件描述</li>
                    <li>与律师的通信记录</li>
                    <li>上传的文档和材料</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Information Usage */}
          <div id="usage" className="mb-16">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">2. {t('privacy.infoUsage')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">我们使用您的信息用于：</h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>提供和改进法律服务，包括律师匹配和咨询安排</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>处理支付和交易</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>发送服务通知、更新和营销信息（您可以随时取消订阅）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>分析平台使用情况，优化用户体验</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>防止欺诈和确保平台安全</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>遵守法律法规要求</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Information Protection */}
          <div id="protection" className="mb-16">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">3. {t('privacy.infoProtection')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">我们采取的安全措施：</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Lock className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">数据加密</h4>
                    <p className="text-gray-600 text-sm">使用 SSL/TLS 加密传输，数据库加密存储</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">访问控制</h4>
                    <p className="text-gray-600 text-sm">严格的权限管理，仅授权人员可访问</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Eye className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">安全监控</h4>
                    <p className="text-gray-600 text-sm">24/7 系统监控，及时发现和处理安全威胁</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Database className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">定期备份</h4>
                    <p className="text-gray-600 text-sm">数据定期备份，防止数据丢失</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>注意：</strong>虽然我们采取了严格的安全措施，但互联网传输无法保证100%安全。
                  请妥善保管您的账户密码，不要与他人共享。
                </p>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div id="sharing" className="mb-16">
            <div className="flex items-center mb-6">
              <UserCheck className="w-8 h-8 text-yellow-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">4. {t('privacy.infoSharing')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-yellow-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">我们可能与以下方共享信息：</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">律师服务提供者</h4>
                  <p className="text-gray-600">为了提供法律服务，我们会与您选择的律师共享必要的咨询信息</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">支付处理商</h4>
                  <p className="text-gray-600">处理支付时，我们使用第三方支付服务（如 Stripe、PayPal），他们有自己的隐私政策</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">技术服务提供商</h4>
                  <p className="text-gray-600">云存储、数据分析等技术服务商，他们仅能访问执行服务所需的信息</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">法律要求</h4>
                  <p className="text-gray-600">在法律要求或政府机关合法请求的情况下，我们可能需要披露您的信息</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>承诺：</strong>我们不会出售、出租或以其他方式向第三方提供您的个人信息用于营销目的。
                </p>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div id="rights" className="mb-16">
            <div className="flex items-center mb-6">
              <UserCheck className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">5. {t('privacy.userRights')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">根据马来西亚个人数据保护法（PDPA），您有权：</h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>访问权：</strong>查看我们持有的您的个人信息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>更正权：</strong>要求更正不准确或不完整的信息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>删除权：</strong>要求删除您的个人信息（在某些情况下）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>限制处理权：</strong>要求限制对您信息的处理</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>数据可携权：</strong>以结构化、常用格式接收您的数据</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>反对权：</strong>反对我们处理您的个人信息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">•</span>
                  <span><strong>撤回同意权：</strong>随时撤回您之前给予的同意</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  如需行使这些权利，请通过 <a href="mailto:privacy@legalmy.com" className="text-purple-600 hover:underline">privacy@legalmy.com</a> 联系我们，
                  或访问<Link href="/contact" className="text-purple-600 hover:underline">联系我们</Link>页面。
                </p>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div id="cookies" className="mb-16">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">6. {t('privacy.cookies')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">我们使用 Cookie 来：</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">必要 Cookie</h4>
                  <p className="text-gray-600">确保网站正常运行，如登录状态、购物车功能</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">功能 Cookie</h4>
                  <p className="text-gray-600">记住您的偏好设置，如语言选择、字体大小</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">分析 Cookie</h4>
                  <p className="text-gray-600">了解用户如何使用网站，帮助我们改进服务（使用 Google Analytics）</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">营销 Cookie</h4>
                  <p className="text-gray-600">展示相关的广告和推荐内容</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  您可以通过浏览器设置管理或禁用 Cookie，但这可能影响网站的某些功能。
                </p>
              </div>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. 儿童隐私</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <p className="text-gray-600 leading-relaxed">
                我们的服务面向18岁及以上的成年人。我们不会故意收集18岁以下儿童的个人信息。
                如果您发现我们无意中收集了儿童的信息，请立即联系我们，我们会尽快删除。
              </p>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. 政策更新</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <p className="text-gray-600 leading-relaxed mb-4">
                我们可能会不时更新本隐私政策。重大变更时，我们会通过邮件或网站通知您。
                建议您定期查看本页面以了解最新的隐私保护措施。
              </p>
              <p className="text-gray-600">
                继续使用我们的服务即表示您接受更新后的隐私政策。
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">联系我们</h2>
            <p className="mb-4">如对本隐私政策有任何疑问或需要行使您的权利，请联系：</p>
            <div className="space-y-2 text-blue-100">
              <p><strong>邮箱：</strong> privacy@legalmy.com</p>
              <p><strong>电话：</strong> +60 3-1234 5678</p>
              <p><strong>地址：</strong> Level 10, Menara LegalMY, Jalan Ampang, 50450 Kuala Lumpur, Malaysia</p>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                联系我们
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
