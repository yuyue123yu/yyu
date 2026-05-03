"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// 服务详情数据（多语言）
const serviceDetailsData: Record<string, any> = {
  'debt': {
    titleKey: 'services.debt',
    descKey: 'services.debtDesc',
    services: [
      { nameKey: 'debtCollection', price: "RM 1,500-5,000", duration: "2-6" },
      { nameKey: 'bankruptcy', price: "RM 3,000-8,000", duration: "3-9" },
      { nameKey: 'debtRestructuring', price: "RM 2,500-7,000", duration: "3-12" },
      { nameKey: 'creditorProtection', price: "RM 1,800-4,500", duration: "2-8" },
      { nameKey: 'repaymentAgreement', price: "RM 800-2,500", duration: "1-3" },
      { nameKey: 'debtSettlement', price: "RM 2,000-6,000", duration: "3-10" },
    ],
    processKeys: ['debtAssessment', 'legalConsultation', 'negotiation', 'legalProcedure', 'followUp']
  },
  'family': {
    titleKey: 'services.family',
    descKey: 'services.familyDesc',
    services: [
      { nameKey: 'divorce', price: "RM 2,000-5,000", duration: "3-6" },
      { nameKey: 'custody', price: "RM 1,500-4,000", duration: "2-4" },
      { nameKey: 'propertyDivision', price: "RM 2,500-6,000", duration: "3-8" },
      { nameKey: 'prenuptial', price: "RM 800-2,000", duration: "0.5-1" },
      { nameKey: 'domesticViolence', price: "RM 1,000-2,500", duration: "0.5-1.5" },
    ],
    processKeys: ['initialConsultation', 'legalAnalysis', 'documentPreparation', 'courtProcedure', 'judgmentExecution']
  },
  'business': {
    titleKey: 'services.business',
    descKey: 'services.businessDesc',
    services: [
      { nameKey: 'companyRegistration', price: "RM 1,500-3,000", duration: "1-2" },
      { nameKey: 'contractDrafting', price: "RM 500-2,000", duration: "0.5-1" },
      { nameKey: 'businessNegotiation', price: "RM 2,000-5,000", duration: "0" },
      { nameKey: 'equityTransfer', price: "RM 3,000-8,000", duration: "1-3" },
      { nameKey: 'trademarkRegistration', price: "RM 1,000-2,500", duration: "6-12" },
    ],
    processKeys: ['businessConsultation', 'solutionDesign', 'documentPreparation', 'implementation', 'ongoingSupport']
  },
  'property': {
    titleKey: 'services.property',
    descKey: 'services.propertyDesc',
    services: [
      { nameKey: 'propertyTransaction', price: "RM 1,000-3,000", duration: "1-2" },
      { nameKey: 'leaseAgreement', price: "RM 300-800", duration: "0.5" },
      { nameKey: 'titleTransfer', price: "RM 1,500-4,000", duration: "2-3" },
      { nameKey: 'landDispute', price: "RM 2,000-6,000", duration: "3-12" },
      { nameKey: 'propertyDevelopment', price: "RM 5,000-15,000", duration: "6-18" },
    ],
    processKeys: ['titleInvestigation', 'contractReview', 'transactionAssistance', 'titleRegistration', 'afterSalesService']
  },
  'criminal': {
    titleKey: 'services.criminal',
    descKey: 'services.criminalDesc',
    services: [
      { nameKey: 'criminalDefense', price: "RM 5,000-20,000", duration: "3-12" },
      { nameKey: 'bailApplication', price: "RM 2,000-5,000", duration: "0.5-1" },
      { nameKey: 'appealService', price: "RM 8,000-25,000", duration: "6-18" },
      { nameKey: 'witnessProtection', price: "RM 3,000-8,000", duration: "0" },
      { nameKey: 'legalConsultation', price: "RM 300-1,000", duration: "0" },
    ],
    processKeys: ['caseAnalysis', 'evidenceCollection', 'courtDefense', 'judgmentFollowUp', 'executionSupervision']
  },
  'employment': {
    titleKey: 'services.employment',
    descKey: 'services.employmentDesc',
    services: [
      { nameKey: 'laborDispute', price: "RM 1,500-4,000", duration: "2-6" },
      { nameKey: 'wrongfulDismissal', price: "RM 2,000-5,000", duration: "3-8" },
      { nameKey: 'workInjury', price: "RM 1,800-4,500", duration: "3-9" },
      { nameKey: 'employmentContract', price: "RM 500-1,500", duration: "0.5-1" },
      { nameKey: 'salaryDispute', price: "RM 1,000-3,000", duration: "1-4" },
    ],
    processKeys: ['disputeAssessment', 'mediationAttempt', 'arbitrationPreparation', 'legalProcedure', 'compensationFollowUp']
  },
  'ip': {
    titleKey: 'services.ip',
    descKey: 'services.ipDesc',
    services: [
      { nameKey: 'patentApplication', price: "RM 3,000-8,000", duration: "12-24" },
      { nameKey: 'trademarkRegistration', price: "RM 1,000-2,500", duration: "6-12" },
      { nameKey: 'copyrightProtection', price: "RM 800-2,000", duration: "1-3" },
      { nameKey: 'infringementLitigation', price: "RM 5,000-15,000", duration: "6-18" },
      { nameKey: 'licensingAgreement', price: "RM 1,500-4,000", duration: "1-2" },
    ],
    processKeys: ['rightsAssessment', 'applicationPreparation', 'examinationFollowUp', 'rightsGranted', 'protectionService']
  },
};

// 服务名称翻译
const serviceNames: Record<string, { zh: string; en: string; ms: string }> = {
  debtCollection: { zh: "债务追讨", en: "Debt Collection", ms: "Kutipan Hutang" },
  bankruptcy: { zh: "破产申请", en: "Bankruptcy Application", ms: "Permohonan Kebankrapan" },
  debtRestructuring: { zh: "债务重组", en: "Debt Restructuring", ms: "Penstrukturan Semula Hutang" },
  creditorProtection: { zh: "债权人保护", en: "Creditor Protection", ms: "Perlindungan Pemiutang" },
  repaymentAgreement: { zh: "还款协议", en: "Repayment Agreement", ms: "Perjanjian Pembayaran Balik" },
  debtSettlement: { zh: "债务清偿", en: "Debt Settlement", ms: "Penyelesaian Hutang" },
  divorce: { zh: "离婚诉讼", en: "Divorce Litigation", ms: "Litigasi Perceraian" },
  custody: { zh: "子女监护权", en: "Child Custody", ms: "Hak Penjagaan Anak" },
  propertyDivision: { zh: "财产分配", en: "Property Division", ms: "Pembahagian Harta" },
  prenuptial: { zh: "婚前协议", en: "Prenuptial Agreement", ms: "Perjanjian Pranikah" },
  domesticViolence: { zh: "家庭暴力保护令", en: "Domestic Violence Protection Order", ms: "Perintah Perlindungan Keganasan Rumah Tangga" },
  companyRegistration: { zh: "公司注册", en: "Company Registration", ms: "Pendaftaran Syarikat" },
  contractDrafting: { zh: "合同起草", en: "Contract Drafting", ms: "Draf Kontrak" },
  businessNegotiation: { zh: "商业谈判", en: "Business Negotiation", ms: "Rundingan Perniagaan" },
  equityTransfer: { zh: "股权转让", en: "Equity Transfer", ms: "Pemindahan Ekuiti" },
  trademarkRegistration: { zh: "商标注册", en: "Trademark Registration", ms: "Pendaftaran Cap Dagangan" },
  propertyTransaction: { zh: "房产买卖", en: "Property Transaction", ms: "Transaksi Hartanah" },
  leaseAgreement: { zh: "租赁协议", en: "Lease Agreement", ms: "Perjanjian Sewa" },
  titleTransfer: { zh: "产权转让", en: "Title Transfer", ms: "Pemindahan Hak Milik" },
  landDispute: { zh: "土地纠纷", en: "Land Dispute", ms: "Pertikaian Tanah" },
  propertyDevelopment: { zh: "房产开发", en: "Property Development", ms: "Pembangunan Hartanah" },
  criminalDefense: { zh: "刑事辩护", en: "Criminal Defense", ms: "Pembelaan Jenayah" },
  bailApplication: { zh: "保释申请", en: "Bail Application", ms: "Permohonan Jaminan" },
  appealService: { zh: "上诉服务", en: "Appeal Service", ms: "Perkhidmatan Rayuan" },
  witnessProtection: { zh: "证人保护", en: "Witness Protection", ms: "Perlindungan Saksi" },
  legalConsultation: { zh: "法律咨询", en: "Legal Consultation", ms: "Perundingan Undang-undang" },
  laborDispute: { zh: "劳动纠纷", en: "Labor Dispute", ms: "Pertikaian Buruh" },
  wrongfulDismissal: { zh: "不当解雇", en: "Wrongful Dismissal", ms: "Pemecatan Salah" },
  workInjury: { zh: "工伤赔偿", en: "Work Injury Compensation", ms: "Pampasan Kecederaan Kerja" },
  employmentContract: { zh: "劳动合同", en: "Employment Contract", ms: "Kontrak Pekerjaan" },
  salaryDispute: { zh: "薪资纠纷", en: "Salary Dispute", ms: "Pertikaian Gaji" },
  patentApplication: { zh: "专利申请", en: "Patent Application", ms: "Permohonan Paten" },
  copyrightProtection: { zh: "版权保护", en: "Copyright Protection", ms: "Perlindungan Hak Cipta" },
  infringementLitigation: { zh: "侵权诉讼", en: "Infringement Litigation", ms: "Litigasi Pelanggaran" },
  licensingAgreement: { zh: "许可协议", en: "Licensing Agreement", ms: "Perjanjian Pelesenan" },
};

// 流程步骤翻译
const processSteps: Record<string, { zh: string; en: string; ms: string }> = {
  debtAssessment: { zh: "债务评估 - 分析债务状况", en: "Debt Assessment - Analyze debt situation", ms: "Penilaian Hutang - Analisis situasi hutang" },
  legalConsultation: { zh: "法律咨询 - 制定解决方案", en: "Legal Consultation - Develop solutions", ms: "Perundingan Undang-undang - Bangunkan penyelesaian" },
  negotiation: { zh: "协商谈判 - 与债权人沟通", en: "Negotiation - Communicate with creditors", ms: "Rundingan - Berkomunikasi dengan pemiutang" },
  legalProcedure: { zh: "法律程序 - 提起诉讼或申请", en: "Legal Procedure - File lawsuit or application", ms: "Prosedur Undang-undang - Failkan tuntutan atau permohonan" },
  followUp: { zh: "执行跟进 - 确保权益落实", en: "Follow-up - Ensure rights implementation", ms: "Susulan - Pastikan pelaksanaan hak" },
  initialConsultation: { zh: "初步咨询 - 了解案情", en: "Initial Consultation - Understand the case", ms: "Perundingan Awal - Fahami kes" },
  legalAnalysis: { zh: "法律分析 - 评估方案", en: "Legal Analysis - Evaluate options", ms: "Analisis Undang-undang - Nilai pilihan" },
  documentPreparation: { zh: "准备文件 - 收集证据", en: "Document Preparation - Collect evidence", ms: "Penyediaan Dokumen - Kumpul bukti" },
  courtProcedure: { zh: "法庭程序 - 代理诉讼", en: "Court Procedure - Legal representation", ms: "Prosedur Mahkamah - Perwakilan undang-undang" },
  judgmentExecution: { zh: "执行判决 - 后续跟进", en: "Judgment Execution - Follow-up", ms: "Pelaksanaan Penghakiman - Susulan" },
  businessConsultation: { zh: "业务咨询 - 了解需求", en: "Business Consultation - Understand needs", ms: "Perundingan Perniagaan - Fahami keperluan" },
  solutionDesign: { zh: "方案设计 - 法律规划", en: "Solution Design - Legal planning", ms: "Reka Bentuk Penyelesaian - Perancangan undang-undang" },
  implementation: { zh: "执行实施 - 全程跟进", en: "Implementation - Full follow-up", ms: "Pelaksanaan - Susulan penuh" },
  ongoingSupport: { zh: "后续服务 - 持续支持", en: "Ongoing Support - Continuous support", ms: "Sokongan Berterusan - Sokongan berterusan" },
  titleInvestigation: { zh: "产权调查 - 核实信息", en: "Title Investigation - Verify information", ms: "Penyiasatan Hak Milik - Sahkan maklumat" },
  contractReview: { zh: "合同审查 - 风险评估", en: "Contract Review - Risk assessment", ms: "Semakan Kontrak - Penilaian risiko" },
  transactionAssistance: { zh: "交易协助 - 文件办理", en: "Transaction Assistance - Document processing", ms: "Bantuan Transaksi - Pemprosesan dokumen" },
  titleRegistration: { zh: "产权登记 - 完成过户", en: "Title Registration - Complete transfer", ms: "Pendaftaran Hak Milik - Lengkapkan pemindahan" },
  afterSalesService: { zh: "售后服务 - 问题解决", en: "After-sales Service - Problem solving", ms: "Perkhidmatan Selepas Jualan - Penyelesaian masalah" },
  caseAnalysis: { zh: "案情分析 - 紧急应对", en: "Case Analysis - Emergency response", ms: "Analisis Kes - Tindak balas kecemasan" },
  evidenceCollection: { zh: "证据收集 - 辩护准备", en: "Evidence Collection - Defense preparation", ms: "Pengumpulan Bukti - Persediaan pembelaan" },
  courtDefense: { zh: "法庭辩护 - 专业代理", en: "Court Defense - Professional representation", ms: "Pembelaan Mahkamah - Perwakilan profesional" },
  judgmentFollowUp: { zh: "判决跟进 - 上诉准备", en: "Judgment Follow-up - Appeal preparation", ms: "Susulan Penghakiman - Persediaan rayuan" },
  executionSupervision: { zh: "执行监督 - 权益保护", en: "Execution Supervision - Rights protection", ms: "Penyeliaan Pelaksanaan - Perlindungan hak" },
  disputeAssessment: { zh: "纠纷评估 - 权益分析", en: "Dispute Assessment - Rights analysis", ms: "Penilaian Pertikaian - Analisis hak" },
  mediationAttempt: { zh: "协商调解 - 和解尝试", en: "Mediation Attempt - Settlement attempt", ms: "Percubaan Pengantaraan - Percubaan penyelesaian" },
  arbitrationPreparation: { zh: "仲裁准备 - 证据整理", en: "Arbitration Preparation - Evidence organization", ms: "Persediaan Timbang Tara - Organisasi bukti" },
  compensationFollowUp: { zh: "赔偿落实 - 执行跟进", en: "Compensation Follow-up - Execution follow-up", ms: "Susulan Pampasan - Susulan pelaksanaan" },
  rightsAssessment: { zh: "权利评估 - 可行性分析", en: "Rights Assessment - Feasibility analysis", ms: "Penilaian Hak - Analisis kebolehlaksanaan" },
  applicationPreparation: { zh: "申请准备 - 文件提交", en: "Application Preparation - Document submission", ms: "Persediaan Permohonan - Penyerahan dokumen" },
  examinationFollowUp: { zh: "审查跟进 - 答复意见", en: "Examination Follow-up - Response to opinions", ms: "Susulan Pemeriksaan - Respons kepada pendapat" },
  rightsGranted: { zh: "权利获得 - 证书颁发", en: "Rights Granted - Certificate issuance", ms: "Hak Diberikan - Pengeluaran sijil" },
  protectionService: { zh: "维权服务 - 持续保护", en: "Protection Service - Continuous protection", ms: "Perkhidmatan Perlindungan - Perlindungan berterusan" },
};

export default function ServiceDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const category = params?.category as string;
    if (category) {
      const decodedCategory = decodeURIComponent(category);
      setService(serviceDetailsData[decodedCategory] || serviceDetailsData['family']);
    }
  }, [params]);

  const getServiceName = (nameKey: string) => {
    const translation = serviceNames[nameKey];
    if (!translation) return nameKey;
    return translation[language] || translation.zh;
  };

  const getProcessStep = (stepKey: string) => {
    const translation = processSteps[stepKey];
    if (!translation) return stepKey;
    return translation[language] || translation.zh;
  };

  if (!service) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">{t('pages.loading')}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const monthText = language === 'zh' ? '个月' : language === 'en' ? 'months' : 'bulan';
  const weekText = language === 'zh' ? '周' : language === 'en' ? 'weeks' : 'minggu';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <Link href="/services" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4" />
              {t('pages.backToServices')}
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">{t(service.titleKey)}</h1>
            <p className="text-xl text-blue-100">{t(service.descKey)}</p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">{t('pages.serviceItems')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {service.services.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg shadow-lg p-6 border border-neutral-200">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">{getServiceName(item.nameKey)}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">{t('services.priceRange')}:</span>
                        <span className="font-bold text-primary-600">{item.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">{t('pages.estimatedTime')}:</span>
                        <span className="font-medium text-neutral-900">
                          {item.duration} {item.duration.includes('-') ? monthText : item.duration < 1 ? weekText : monthText}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/consultation"
                      className="mt-4 block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-all"
                    >
                      {t('home.consultNow')}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Process */}
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">{t('pages.serviceProcess')}</h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="space-y-6">
                  {service.processKeys.map((stepKey: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-lg font-medium text-neutral-900">{getProcessStep(stepKey)}</p>
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
            <h2 className="text-3xl font-bold mb-4">{t('pages.readyToStart')}</h2>
            <p className="text-xl text-blue-100 mb-8">{t('pages.contactTeam')}</p>
            <Link
              href="/consultation"
              className="inline-block px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-bold text-lg transition-all"
            >
              {t('home.consultNow')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
