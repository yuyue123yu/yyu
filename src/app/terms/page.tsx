import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服务条款 | LegalMY',
  description: 'LegalMY 服务条款 - 了解使用我们服务的条款和条件',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">服务条款</h1>
          <p className="text-gray-600 mb-8">最后更新：2025年1月</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 服务说明</h2>
              <p className="text-gray-700 mb-4">
                LegalMY 是一个法律咨询平台，连接用户与专业律师。我们提供：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>在线法律咨询服务</li>
                <li>律师匹配服务</li>
                <li>法律文档审核</li>
                <li>案件管理工具</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 用户责任</h2>
              <p className="text-gray-700 mb-4">
                使用我们的服务时，您同意：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>提供真实、准确的信息</li>
                <li>遵守所有适用的法律法规</li>
                <li>不滥用或干扰服务</li>
                <li>保护您的账户安全</li>
                <li>尊重知识产权</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 律师服务</h2>
              <p className="text-gray-700 mb-4">
                重要声明：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>平台上的律师是独立执业的专业人士</li>
                <li>LegalMY 不对律师的服务质量负责</li>
                <li>律师-客户关系直接建立在您和律师之间</li>
                <li>我们不提供法律建议，仅提供平台服务</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 费用和支付</h2>
              <p className="text-gray-700 mb-4">
                关于费用：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>咨询费用由律师设定</li>
                <li>平台可能收取服务费</li>
                <li>所有费用在服务前明确告知</li>
                <li>支付通过安全的第三方处理</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 退款政策</h2>
              <p className="text-gray-700 mb-4">
                退款条件：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>服务开始前可以取消并全额退款</li>
                <li>服务开始后的退款由律师决定</li>
                <li>技术问题导致的服务中断可申请退款</li>
                <li>退款处理时间为 7-14 个工作日</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 知识产权</h2>
              <p className="text-gray-700 mb-4">
                平台上的所有内容（包括但不限于文本、图片、Logo、设计）均受知识产权法保护。
                未经许可，不得复制、修改或分发。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 免责声明</h2>
              <p className="text-gray-700 mb-4">
                LegalMY 按"现状"提供服务，不提供任何明示或暗示的保证。
                我们不对以下情况负责：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>律师服务的质量或结果</li>
                <li>第三方服务的中断</li>
                <li>数据丢失或损坏</li>
                <li>间接或后果性损失</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 服务变更和终止</h2>
              <p className="text-gray-700 mb-4">
                我们保留随时修改、暂停或终止服务的权利。
                我们会提前通知重大变更。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 争议解决</h2>
              <p className="text-gray-700 mb-4">
                本条款受马来西亚法律管辖。
                任何争议应首先通过友好协商解决，
                协商不成的，提交马来西亚法院管辖。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 联系我们</h2>
              <p className="text-gray-700 mb-4">
                如果您对本服务条款有任何疑问，请联系我们：
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>邮箱：support@legalmy.com</li>
                <li>电话：+60 3-1234 5678</li>
                <li>地址：马来西亚吉隆坡</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
