"use client";

import Link from "next/link";
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">{t('terms.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {t('terms.subtitle')}
          </p>
          <p className="text-sm text-blue-200 mt-4">{t('terms.lastUpdated')}：2026年4月 | {t('terms.effectiveDate')}：2026年1月1日</p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a href="#acceptance" className="text-blue-600 hover:text-blue-800">{t('terms.acceptance')}</a>
            <span className="text-gray-300">|</span>
            <a href="#services" className="text-blue-600 hover:text-blue-800">{t('terms.services')}</a>
            <span className="text-gray-300">|</span>
            <a href="#account" className="text-blue-600 hover:text-blue-800">{t('terms.account')}</a>
            <span className="text-gray-300">|</span>
            <a href="#payment" className="text-blue-600 hover:text-blue-800">{t('terms.payment')}</a>
            <span className="text-gray-300">|</span>
            <a href="#prohibited" className="text-blue-600 hover:text-blue-800">{t('terms.prohibited')}</a>
            <span className="text-gray-300">|</span>
            <a href="#liability" className="text-blue-600 hover:text-blue-800">{t('terms.liability')}</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Acceptance */}
          <div id="acceptance" className="mb-16">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">1. {t('terms.acceptance')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-600">
              <p className="text-gray-600 leading-relaxed mb-4">
                通过访问或使用 LegalMY 平台（包括网站、移动应用和相关服务），您同意受本服务条款的约束。
                如果您不同意这些条款，请不要使用我们的服务。
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                本条款构成您与 LegalMY Sdn Bhd（公司注册号：202401234567）之间具有法律约束力的协议。
              </p>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>重要提示：</strong>使用我们的服务即表示您已年满18岁，具有完全民事行为能力，
                  并有权签订本协议。
                </p>
              </div>
            </div>
          </div>

          {/* Services Description */}
          <div id="services" className="mb-16">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">2. {t('terms.services')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">LegalMY 提供以下服务：</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">律师匹配与咨询服务</h4>
                  <p className="text-gray-600">连接用户与认证律师，提供在线和线下法律咨询服务</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">法律文档模板</h4>
                  <p className="text-gray-600">提供各类法律文档模板供用户下载和使用</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">法律知识资讯</h4>
                  <p className="text-gray-600">发布法律相关的文章、指南和资讯</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">文档审查服务</h4>
                  <p className="text-gray-600">律师审查用户提交的法律文档</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>免责声明：</strong>LegalMY 是一个平台服务提供商，连接用户与独立执业的律师。
                  我们不提供法律建议，所有法律服务由平台上的律师直接提供。
                </p>
              </div>
            </div>
          </div>

          {/* Account Responsibilities */}
          <div id="account" className="mb-16">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">3. {t('terms.account')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-yellow-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">注册和账户安全</h3>
              
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>您必须提供准确、完整和最新的注册信息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>您有责任维护账户密码的保密性</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>您对账户下发生的所有活动负责</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>如发现账户被未经授权使用，请立即通知我们</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>每个用户只能注册一个账户</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>不得将账户转让或出售给他人</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">账户终止</h3>
              <p className="text-gray-600 mb-4">
                我们保留在以下情况下暂停或终止您账户的权利：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>违反本服务条款</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>提供虚假信息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>从事欺诈或非法活动</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>长期不活跃（超过2年）</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Terms */}
          <div id="payment" className="mb-16">
            <div className="flex items-center mb-6">
              <Scale className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">4. {t('terms.payment')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">费用和支付</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">服务费用</h4>
                  <p className="text-gray-600">
                    律师咨询费用由各律师自行设定，通常在 RM 200-500/小时之间。
                    平台会收取10%的服务费。所有费用在预约前会明确显示。
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">支付方式</h4>
                  <p className="text-gray-600">
                    我们接受信用卡、借记卡、在线银行转账和电子钱包支付。
                    所有支付通过安全的第三方支付处理商处理。
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">税费</h4>
                  <p className="text-gray-600">
                    所有价格均以马来西亚林吉特（RM）计价，并包含适用的销售税（SST）。
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">退款政策</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>咨询服务：</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>预约时间前24小时取消：全额退款</li>
                  <li>预约时间前24小时内取消：收取30%手续费</li>
                  <li>预约时间后取消或未出席：不予退款</li>
                </ul>
                
                <p className="mt-4"><strong>文档审查服务：</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>服务开始前：全额退款</li>
                  <li>服务进行中：不予退款</li>
                  <li>服务完成后：不予退款</li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  退款将在审核通过后5-7个工作日内退回原支付账户。
                </p>
              </div>
            </div>
          </div>

          {/* Prohibited Conduct */}
          <div id="prohibited" className="mb-16">
            <div className="flex items-center mb-6">
              <XCircle className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">5. {t('terms.prohibited')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-red-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">使用我们的服务时，您不得：</h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>违反任何适用的法律法规</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>侵犯他人的知识产权或其他权利</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>上传或传播病毒、恶意软件或有害代码</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>试图未经授权访问我们的系统或其他用户的账户</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>使用自动化工具（如机器人、爬虫）访问平台</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>发布虚假、误导性或诽谤性内容</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>骚扰、威胁或冒充他人</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>绕过平台直接与律师交易以逃避服务费</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>复制、修改或分发平台内容用于商业目的</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span>干扰或破坏平台的正常运行</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>违规后果：</strong>违反这些规定可能导致账户暂停或终止，
                  并可能承担法律责任。我们保留向执法机关报告违法行为的权利。
                </p>
              </div>
            </div>
          </div>

          {/* Liability Limitation */}
          <div id="liability" className="mb-16">
            <div className="flex items-center mb-6">
              <Scale className="w-8 h-8 text-gray-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">6. {t('terms.liability')}</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">平台责任</h3>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>服务"按原样"提供：</strong>
                  LegalMY 平台按"原样"和"可用"基础提供，不提供任何明示或暗示的保证，
                  包括但不限于适销性、特定用途适用性或不侵权的保证。
                </p>
                
                <p>
                  <strong>律师服务：</strong>
                  平台上的律师是独立执业的专业人士，不是 LegalMY 的员工或代理人。
                  我们不对律师提供的法律建议、服务质量或结果负责。
                </p>
                
                <p>
                  <strong>内容准确性：</strong>
                  虽然我们努力确保平台上信息的准确性，但我们不保证所有内容都是最新、完整或无错误的。
                  法律信息仅供参考，不构成法律建议。
                </p>
                
                <p>
                  <strong>第三方链接：</strong>
                  平台可能包含指向第三方网站的链接。我们不对这些网站的内容或隐私做法负责。
                </p>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">赔偿限制</h3>
              <p className="text-gray-600 mb-4">
                在法律允许的最大范围内，LegalMY 及其董事、员工、合作伙伴和代理人不对以下情况承担责任：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>任何间接、偶然、特殊、后果性或惩罚性损害</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>利润损失、数据丢失或业务中断</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>使用或无法使用服务造成的损害</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>第三方（包括律师）的行为或不作为</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>最高赔偿额：</strong>在任何情况下，我们的总赔偿责任不超过您在事件发生前12个月内
                  向 LegalMY 支付的费用，或 RM 1,000，以较高者为准。
                </p>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. 知识产权</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <p className="text-gray-600 leading-relaxed mb-4">
                LegalMY 平台及其所有内容（包括但不限于文本、图形、标志、图标、图像、音频剪辑、
                数字下载、数据编辑和软件）均为 LegalMY Sdn Bhd 或其内容供应商的财产，
                受马来西亚和国际版权法保护。
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                未经我们明确书面许可，您不得复制、修改、分发、展示或以其他方式使用平台内容用于商业目的。
              </p>
              <p className="text-gray-600 leading-relaxed">
                您上传到平台的内容（如评论、评价）仍归您所有，但您授予我们非独占、全球性、
                免版税的许可，以使用、复制、修改和展示该内容用于运营和推广服务。
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. 争议解决</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">适用法律</h3>
              <p className="text-gray-600 mb-4">
                本条款受马来西亚法律管辖并按其解释，不考虑法律冲突原则。
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">争议解决程序</h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span><strong>协商：</strong>首先尝试通过友好协商解决争议</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span><strong>调解：</strong>如协商失败，双方同意尝试调解</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span><strong>仲裁：</strong>如调解失败，争议应提交马来西亚仲裁中心（AIAC）
                  根据其仲裁规则进行仲裁</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span><strong>诉讼：</strong>仅在仲裁不适用的情况下，
                  双方同意吉隆坡法院具有专属管辖权</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. 条款变更</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <p className="text-gray-600 leading-relaxed mb-4">
                我们保留随时修改本服务条款的权利。重大变更时，我们会通过邮件或平台通知您，
                并在页面顶部更新"最后更新"日期。
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                变更生效后继续使用服务即表示您接受修改后的条款。如果您不同意变更，
                请停止使用服务并关闭您的账户。
              </p>
              <p className="text-gray-600 leading-relaxed">
                建议您定期查看本页面以了解最新的服务条款。
              </p>
            </div>
          </div>

          {/* Miscellaneous */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. 其他条款</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">完整协议</h4>
                  <p>本条款与我们的隐私政策共同构成您与 LegalMY 之间的完整协议。</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">可分割性</h4>
                  <p>如本条款的任何条款被认定为无效或不可执行，其余条款仍然有效。</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">不弃权</h4>
                  <p>我们未行使或延迟行使任何权利不构成对该权利的放弃。</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">转让</h4>
                  <p>未经我们事先书面同意，您不得转让本协议下的权利或义务。
                  我们可以自由转让我们的权利和义务。</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">语言</h4>
                  <p>本条款以中文、英文和马来文提供。如有冲突，以英文版本为准。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">联系我们</h2>
            <p className="mb-4">如对本服务条款有任何疑问，请联系：</p>
            <div className="space-y-2 text-blue-100">
              <p><strong>公司名称：</strong> LegalMY Sdn Bhd</p>
              <p><strong>注册号：</strong> 202401234567</p>
              <p><strong>邮箱：</strong> legal@legalmy.com</p>
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
