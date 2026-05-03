import { use } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Tag, BookOpen } from "lucide-react";
import { fetchArticleById, getAllArticleIds } from "@/lib/api/legalKnowledge";
import DownloadPDFButton from "@/components/knowledge/DownloadPDFButton";

// 生成静态路径
export async function generateStaticParams() {
  const ids = getAllArticleIds();
  return ids.map((id) => ({
    id: id,
  }));
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await fetchArticleById(id);

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">文章未找到</h1>
              <Link href="/knowledge" className="text-primary-600 hover:text-primary-700">
                返回知识库
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <Link href="/knowledge" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4" />
              返回知识库
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                  {article.category === 'employment' ? '劳动法' :
                   article.category === 'property' ? '房产法' :
                   article.category === 'family' ? '家庭法' :
                   article.category === 'business' ? '商业法' :
                   article.category === 'consumer' ? '消费者权益' :
                   article.category === 'immigration' ? '移民法' :
                   article.category === 'tax' ? '税法' :
                   article.category === 'criminal' ? '刑法' : '法律知识'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {article.titleCn || article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{article.readTime} 分钟阅读</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span>{article.views.toLocaleString()} 浏览</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>作者: {article.author}</span>
                </div>
                <div>
                  <span>{article.publishedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    {/* Summary */}
                    <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded-r-lg">
                      <h2 className="text-xl font-bold text-neutral-900 mb-3">摘要</h2>
                      <p className="text-neutral-700 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                      <h2 className="text-2xl font-bold text-neutral-900 mb-4">详细内容</h2>
                      
                      {/* 根据文章类别生成详细内容 */}
                      {article.category === 'employment' && (
                        <>
                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. 雇佣法概述</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            马来西亚的《1955年雇佣法》（Employment Act 1955）是规范雇主与雇员关系的主要法律。该法律适用于月薪不超过RM 2,000的员工，以及从事体力劳动的员工（无论薪资多少）。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. 员工权利</h3>
                          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                            <li>工作时间：每周不超过48小时</li>
                            <li>加班费：正常工资的1.5倍</li>
                            <li>年假：工作满1年后享有带薪年假</li>
                            <li>病假：根据工作年限享有带薪病假</li>
                            <li>产假：女性员工享有60天产假</li>
                          </ul>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. 雇主义务</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            雇主必须遵守法定最低工资标准，提供安全的工作环境，按时支付工资，并为员工缴纳EPF（公积金）和SOCSO（社会保险）。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. 解雇程序</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            解雇员工必须有正当理由，并遵循正当程序。不当解雇可能导致雇主需要支付赔偿金。员工可以向劳工法庭提出申诉。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">5. 常见问题</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            如果您遇到劳动纠纷，建议先尝试与雇主协商。如果协商失败，可以向劳工部门投诉或寻求法律援助。保留所有相关文件和证据非常重要。
                          </p>
                        </>
                      )}

                      {article.category === 'property' && (
                        <>
                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. 房产所有权类型</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            马来西亚的房产所有权主要分为两种：永久地契（Freehold）和租赁地契（Leasehold）。永久地契意味着您永久拥有该土地，而租赁地契通常为30-99年。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. 购房流程</h3>
                          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                            <li>签署预订表格并支付订金</li>
                            <li>签署买卖协议（SPA）</li>
                            <li>申请房屋贷款</li>
                            <li>支付首付款</li>
                            <li>完成产权转让</li>
                          </ul>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. 相关费用</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            购房时需要支付印花税、律师费、估价费等。首次购房者可能享有印花税减免。建议预留房价的3-5%作为杂费。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. 外国人购房限制</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            外国人可以在马来西亚购买房产，但有最低价格限制（通常为RM 1,000,000）。不同州属的规定可能有所不同。
                          </p>
                        </>
                      )}

                      {article.category === 'family' && (
                        <>
                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. 离婚法律</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            马来西亚的离婚法律因宗教而异。非穆斯林适用《1976年婚姻与离婚法改革法》，穆斯林则适用伊斯兰家庭法。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. 离婚理由</h3>
                          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                            <li>通奸</li>
                            <li>不合理行为</li>
                            <li>遗弃（至少2年）</li>
                            <li>分居（至少2年且双方同意，或至少5年）</li>
                          </ul>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. 子女监护权</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            法院在决定监护权时，会以子女的最佳利益为首要考虑。通常7岁以下的孩子会判给母亲，但这不是绝对的。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. 财产分配</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            婚姻期间共同积累的财产将被视为共同财产，法院会根据双方的贡献进行公平分配。这包括经济和非经济贡献（如照顾家庭）。
                          </p>
                        </>
                      )}

                      {article.category === 'business' && (
                        <>
                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. 公司类型</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            马来西亚主要的公司类型包括：私人有限公司（Sdn Bhd）、有限责任合伙（LLP）、独资企业和合伙企业。最常见的是Sdn Bhd。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. 注册流程</h3>
                          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                            <li>选择公司名称并获得批准</li>
                            <li>准备公司章程</li>
                            <li>向SSM（公司委员会）提交注册文件</li>
                            <li>获得注册证书</li>
                            <li>开设公司银行账户</li>
                          </ul>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. 法律要求</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            公司必须至少有1名董事和1名股东（可以是同一人）。必须有注册地址和公司秘书。每年需要提交年度申报表。
                          </p>

                          <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. 税务义务</h3>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            公司需要注册企业所得税，税率为24%。还需要注册GST/SST（如适用）。按时提交税务申报非常重要。
                          </p>
                        </>
                      )}

                      {/* 默认内容 */}
                      {!['employment', 'property', 'family', 'business'].includes(article.category) && (
                        <>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            {article.content}
                          </p>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            本文详细介绍了{article.titleCn || article.title}的相关法律知识，帮助您更好地了解马来西亚的法律规定。
                          </p>
                          <p className="text-neutral-700 leading-relaxed mb-6">
                            如果您需要更详细的法律咨询，建议联系专业律师获取个性化的法律建议。
                          </p>
                        </>
                      )}

                      {/* Related Laws */}
                      {article.relatedLaws && article.relatedLaws.length > 0 && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mt-8 rounded-r-lg">
                          <h3 className="text-xl font-bold text-neutral-900 mb-4">相关法律条文</h3>
                          <ul className="space-y-2">
                            {article.relatedLaws.map((law: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">•</span>
                                <span className="text-neutral-700">{law}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Download Section */}
                      <DownloadPDFButton 
                        articleTitle={article.titleCn || article.title}
                        articleContent={article.content}
                      />
                    </div>

                    {/* Tags */}
                    <div className="mt-8 pt-8 border-t border-neutral-200">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    {/* Author Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="font-bold text-neutral-900 mb-4">作者信息</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                          👨‍⚖️
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{article.author}</p>
                          <p className="text-sm text-neutral-600">专业律师</p>
                        </div>
                      </div>
                      <Link
                        href="/consultation"
                        className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-all"
                      >
                        咨询作者
                      </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-primary-50 rounded-xl p-6">
                      <h3 className="font-bold text-neutral-900 mb-4">相关服务</h3>
                      <div className="space-y-3">
                        <Link href="/templates" className="block text-sm text-primary-700 hover:text-primary-800 font-medium">
                          📄 法律文书模板
                        </Link>
                        <Link href="/lawyers" className="block text-sm text-primary-700 hover:text-primary-800 font-medium">
                          👨‍⚖️ 咨询律师
                        </Link>
                        <Link href="/consultation" className="block text-sm text-primary-700 hover:text-primary-800 font-medium">
                          💬 在线咨询
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
