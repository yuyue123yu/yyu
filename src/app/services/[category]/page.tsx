import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";

// 生成静态路径
export function generateStaticParams() {
  return [
    { category: 'debt' },
    { category: 'business' },
    { category: 'property' },
    { category: 'criminal' },
    { category: 'employment' },
    { category: 'ip' },
  ];
}

const serviceDetails: Record<string, any> = {
  'debt': {
    title: "债务纠纷法律服务",
    description: "专业处理债务追讨、破产申请、债务重组等债务法律事务",
    services: [
      { name: "债务追讨", price: "RM 1,500-5,000", duration: "2-6个月" },
      { name: "破产申请", price: "RM 3,000-8,000", duration: "3-9个月" },
      { name: "债务重组", price: "RM 2,500-7,000", duration: "3-12个月" },
      { name: "债权人保护", price: "RM 1,800-4,500", duration: "2-8个月" },
      { name: "还款协议", price: "RM 800-2,500", duration: "1-3个月" },
      { name: "债务清偿", price: "RM 2,000-6,000", duration: "3-10个月" },
    ],
    process: [
      "债务评估 - 分析债务状况",
      "法律咨询 - 制定解决方案",
      "协商谈判 - 与债权人沟通",
      "法律程序 - 提起诉讼或申请",
      "执行跟进 - 确保权益落实"
    ]
  },
  '债务纠纷': {
    title: "债务纠纷法律服务",
    description: "专业处理债务追讨、破产申请、债务重组等债务法律事务",
    services: [
      { name: "债务追讨", price: "RM 1,500-5,000", duration: "2-6个月" },
      { name: "破产申请", price: "RM 3,000-8,000", duration: "3-9个月" },
      { name: "债务重组", price: "RM 2,500-7,000", duration: "3-12个月" },
      { name: "债权人保护", price: "RM 1,800-4,500", duration: "2-8个月" },
      { name: "还款协议", price: "RM 800-2,500", duration: "1-3个月" },
      { name: "债务清偿", price: "RM 2,000-6,000", duration: "3-10个月" },
    ],
    process: [
      "债务评估 - 分析债务状况",
      "法律咨询 - 制定解决方案",
      "协商谈判 - 与债权人沟通",
      "法律程序 - 提起诉讼或申请",
      "执行跟进 - 确保权益落实"
    ]
  },
  'business': {
    title: "商业法律服务",
    description: "为企业提供全方位的法律支持和商业咨询",
    services: [
      { name: "公司注册", price: "RM 1,500-3,000", duration: "2-4周" },
      { name: "合同起草", price: "RM 500-2,000", duration: "1-2周" },
      { name: "商业谈判", price: "RM 2,000-5,000", duration: "按需" },
      { name: "股权转让", price: "RM 3,000-8,000", duration: "1-3个月" },
      { name: "商标注册", price: "RM 1,000-2,500", duration: "6-12个月" },
    ],
    process: [
      "业务咨询 - 了解需求",
      "方案设计 - 法律规划",
      "文件准备 - 合规审查",
      "执行实施 - 全程跟进",
      "后续服务 - 持续支持"
    ]
  },
  '商业法': {
    title: "商业法律服务",
    description: "为企业提供全方位的法律支持和商业咨询",
    services: [
      { name: "公司注册", price: "RM 1,500-3,000", duration: "2-4周" },
      { name: "合同起草", price: "RM 500-2,000", duration: "1-2周" },
      { name: "商业谈判", price: "RM 2,000-5,000", duration: "按需" },
      { name: "股权转让", price: "RM 3,000-8,000", duration: "1-3个月" },
      { name: "商标注册", price: "RM 1,000-2,500", duration: "6-12个月" },
    ],
    process: [
      "业务咨询 - 了解需求",
      "方案设计 - 法律规划",
      "文件准备 - 合规审查",
      "执行实施 - 全程跟进",
      "后续服务 - 持续支持"
    ]
  },
  'property': {
    title: "房产法律服务",
    description: "处理房产买卖、租赁、产权等相关法律事务",
    services: [
      { name: "房产买卖", price: "RM 1,000-3,000", duration: "1-2个月" },
      { name: "租赁协议", price: "RM 300-800", duration: "1周" },
      { name: "产权转让", price: "RM 1,500-4,000", duration: "2-3个月" },
      { name: "土地纠纷", price: "RM 2,000-6,000", duration: "3-12个月" },
      { name: "房产开发", price: "RM 5,000-15,000", duration: "6-18个月" },
    ],
    process: [
      "产权调查 - 核实信息",
      "合同审查 - 风险评估",
      "交易协助 - 文件办理",
      "产权登记 - 完成过户",
      "售后服务 - 问题解决"
    ]
  },
  '房产法': {
    title: "房产法律服务",
    description: "处理房产买卖、租赁、产权等相关法律事务",
    services: [
      { name: "房产买卖", price: "RM 1,000-3,000", duration: "1-2个月" },
      { name: "租赁协议", price: "RM 300-800", duration: "1周" },
      { name: "产权转让", price: "RM 1,500-4,000", duration: "2-3个月" },
      { name: "土地纠纷", price: "RM 2,000-6,000", duration: "3-12个月" },
      { name: "房产开发", price: "RM 5,000-15,000", duration: "6-18个月" },
    ],
    process: [
      "产权调查 - 核实信息",
      "合同审查 - 风险评估",
      "交易协助 - 文件办理",
      "产权登记 - 完成过户",
      "售后服务 - 问题解决"
    ]
  },
  'criminal': {
    title: "刑事法律服务",
    description: "提供专业的刑事辩护和法律代理服务",
    services: [
      { name: "刑事辩护", price: "RM 5,000-20,000", duration: "3-12个月" },
      { name: "保释申请", price: "RM 2,000-5,000", duration: "1-2周" },
      { name: "上诉服务", price: "RM 8,000-25,000", duration: "6-18个月" },
      { name: "证人保护", price: "RM 3,000-8,000", duration: "按需" },
      { name: "法律咨询", price: "RM 300-1,000", duration: "1次" },
    ],
    process: [
      "案情分析 - 紧急应对",
      "证据收集 - 辩护准备",
      "法庭辩护 - 专业代理",
      "判决跟进 - 上诉准备",
      "执行监督 - 权益保护"
    ]
  },
  '刑事法': {
    title: "刑事法律服务",
    description: "提供专业的刑事辩护和法律代理服务",
    services: [
      { name: "刑事辩护", price: "RM 5,000-20,000", duration: "3-12个月" },
      { name: "保释申请", price: "RM 2,000-5,000", duration: "1-2周" },
      { name: "上诉服务", price: "RM 8,000-25,000", duration: "6-18个月" },
      { name: "证人保护", price: "RM 3,000-8,000", duration: "按需" },
      { name: "法律咨询", price: "RM 300-1,000", duration: "1次" },
    ],
    process: [
      "案情分析 - 紧急应对",
      "证据收集 - 辩护准备",
      "法庭辩护 - 专业代理",
      "判决跟进 - 上诉准备",
      "执行监督 - 权益保护"
    ]
  },
  'employment': {
    title: "劳动法律服务",
    description: "解决劳动纠纷，保护劳动者和雇主权益",
    services: [
      { name: "劳动纠纷", price: "RM 1,500-4,000", duration: "2-6个月" },
      { name: "不当解雇", price: "RM 2,000-5,000", duration: "3-8个月" },
      { name: "工伤赔偿", price: "RM 1,800-4,500", duration: "3-9个月" },
      { name: "劳动合同", price: "RM 500-1,500", duration: "1-2周" },
      { name: "薪资纠纷", price: "RM 1,000-3,000", duration: "1-4个月" },
    ],
    process: [
      "纠纷评估 - 权益分析",
      "协商调解 - 和解尝试",
      "仲裁准备 - 证据整理",
      "法律程序 - 维权诉讼",
      "执行跟进 - 赔偿落实"
    ]
  },
  '劳动法': {
    title: "劳动法律服务",
    description: "解决劳动纠纷，保护劳动者和雇主权益",
    services: [
      { name: "劳动纠纷", price: "RM 1,500-4,000", duration: "2-6个月" },
      { name: "不当解雇", price: "RM 2,000-5,000", duration: "3-8个月" },
      { name: "工伤赔偿", price: "RM 1,800-4,500", duration: "3-9个月" },
      { name: "劳动合同", price: "RM 500-1,500", duration: "1-2周" },
      { name: "薪资纠纷", price: "RM 1,000-3,000", duration: "1-4个月" },
    ],
    process: [
      "纠纷评估 - 权益分析",
      "协商调解 - 和解尝试",
      "仲裁准备 - 证据整理",
      "法律程序 - 维权诉讼",
      "执行跟进 - 赔偿落实"
    ]
  },
  'ip': {
    title: "知识产权法律服务",
    description: "保护您的创新成果和知识产权",
    services: [
      { name: "专利申请", price: "RM 3,000-8,000", duration: "12-24个月" },
      { name: "商标注册", price: "RM 1,000-2,500", duration: "6-12个月" },
      { name: "版权保护", price: "RM 800-2,000", duration: "1-3个月" },
      { name: "侵权诉讼", price: "RM 5,000-15,000", duration: "6-18个月" },
      { name: "许可协议", price: "RM 1,500-4,000", duration: "2-4周" },
    ],
    process: [
      "权利评估 - 可行性分析",
      "申请准备 - 文件提交",
      "审查跟进 - 答复意见",
      "权利获得 - 证书颁发",
      "维权服务 - 持续保护"
    ]
  },
  '知识产权': {
    title: "知识产权法律服务",
    description: "保护您的创新成果和知识产权",
    services: [
      { name: "专利申请", price: "RM 3,000-8,000", duration: "12-24个月" },
      { name: "商标注册", price: "RM 1,000-2,500", duration: "6-12个月" },
      { name: "版权保护", price: "RM 800-2,000", duration: "1-3个月" },
      { name: "侵权诉讼", price: "RM 5,000-15,000", duration: "6-18个月" },
      { name: "许可协议", price: "RM 1,500-4,000", duration: "2-4周" },
    ],
    process: [
      "权利评估 - 可行性分析",
      "申请准备 - 文件提交",
      "审查跟进 - 答复意见",
      "权利获得 - 证书颁发",
      "维权服务 - 持续保护"
    ]
  },
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const service = serviceDetails[decodedCategory] || serviceDetails['debt'];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <Link href="/services" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4" />
              返回服务列表
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-blue-100">{service.description}</p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">服务项目</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {service.services.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg shadow-lg p-6 border border-neutral-200">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">价格范围:</span>
                        <span className="font-bold text-primary-600">{item.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">预计时间:</span>
                        <span className="font-medium text-neutral-900">{item.duration}</span>
                      </div>
                    </div>
                    <Link
                      href="/consultation"
                      className="mt-4 block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-all"
                    >
                      立即咨询
                    </Link>
                  </div>
                ))}
              </div>

              {/* Process */}
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">服务流程</h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="space-y-6">
                  {service.process.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-lg font-medium text-neutral-900">{step}</p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">准备开始了吗？</h2>
            <p className="text-xl text-blue-100 mb-8">联系我们的专业律师团队</p>
            <Link
              href="/consultation"
              className="inline-block px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-bold text-lg transition-all"
            >
              立即咨询
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
