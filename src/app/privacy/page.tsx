import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策 | LegalMY',
  description: 'LegalMY 隐私政策 - 了解我们如何收集、使用和保护您的个人信息',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">隐私政策</h1>
          <p className="text-gray-600 mb-8">最后更新：2025年1月</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 信息收集</h2>
              <p className="text-gray-700 mb-4">
                我们收集以下类型的信息：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>个人信息：姓名、电子邮件、电话号码</li>
                <li>咨询信息：法律咨询内容、案件详情</li>
                <li>技术信息：IP 地址、浏览器类型、访问时间</li>
                <li>Cookie 和类似技术</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 信息使用</h2>
              <p className="text-gray-700 mb-4">
                我们使用收集的信息用于：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>提供法律咨询服务</li>
                <li>改善用户体验</li>
                <li>发送服务通知和更新</li>
                <li>遵守法律义务</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 信息保护</h2>
              <p className="text-gray-700 mb-4">
                我们采取以下措施保护您的信息：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>SSL/TLS 加密传输</li>
                <li>数据库加密存储</li>
                <li>访问控制和权限管理</li>
                <li>定期安全审计</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 信息共享</h2>
              <p className="text-gray-700 mb-4">
                我们不会出售您的个人信息。我们可能在以下情况下共享信息：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>与您选择的律师共享咨询信息</li>
                <li>遵守法律要求</li>
                <li>保护我们的权利和安全</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 您的权利</h2>
              <p className="text-gray-700 mb-4">
                根据马来西亚个人数据保护法（PDPA），您有权：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>访问您的个人信息</li>
                <li>更正不准确的信息</li>
                <li>删除您的个人信息</li>
                <li>撤回同意</li>
                <li>投诉数据处理</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookie 政策</h2>
              <p className="text-gray-700 mb-4">
                我们使用 Cookie 来改善用户体验。您可以通过浏览器设置管理 Cookie。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 联系我们</h2>
              <p className="text-gray-700 mb-4">
                如果您对本隐私政策有任何疑问，请联系我们：
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>邮箱：privacy@legalmy.com</li>
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
