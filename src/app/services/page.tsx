"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Briefcase, Home, Users, Shield, TrendingUp, Scale, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const services = [
  {
    id: 'debt',
    icon: Scale,
    titleKey: "services.debt",
    descKey: "services.debtDesc",
    cases: "2,850+",
    avgPrice: "RM 1,200-4,500",
    color: "from-amber-400 to-amber-500",
    features: ["debtCollection", "bankruptcy", "debtRestructuring", "creditorProtection", "repaymentAgreement"]
  },
  {
    id: 'family',
    icon: Users,
    titleKey: "services.family",
    descKey: "services.familyDesc",
    cases: "2,340+",
    avgPrice: "RM 800-3,000",
    color: "from-blue-400 to-blue-500",
    features: ["divorce", "custody", "propertyDivision", "prenuptial", "domesticViolence"]
  },
  {
    id: 'business',
    icon: Briefcase,
    titleKey: "services.business",
    descKey: "services.businessDesc",
    cases: "1,890+",
    avgPrice: "RM 1,000-5,000",
    color: "from-purple-400 to-purple-500",
    features: ["companyRegistration", "contractDrafting", "businessNegotiation", "equityTransfer", "trademarkRegistration"]
  },
  {
    id: 'property',
    icon: Home,
    titleKey: "services.property",
    descKey: "services.propertyDesc",
    cases: "3,120+",
    avgPrice: "RM 600-2,500",
    color: "from-green-400 to-green-500",
    features: ["propertyTransaction", "leaseAgreement", "titleTransfer", "landDispute", "propertyDevelopment"]
  },
  {
    id: 'criminal',
    icon: Shield,
    titleKey: "services.criminal",
    descKey: "services.criminalDesc",
    cases: "980+",
    avgPrice: "RM 2,000-10,000",
    color: "from-red-400 to-red-500",
    features: ["criminalDefense", "bailApplication", "appealService", "witnessProtection", "legalConsultation"]
  },
  {
    id: 'employment',
    icon: TrendingUp,
    titleKey: "services.employment",
    descKey: "services.employmentDesc",
    cases: "1,560+",
    avgPrice: "RM 700-3,500",
    color: "from-orange-400 to-orange-500",
    features: ["laborDispute", "wrongfulDismissal", "workInjury", "employmentContract", "salaryDispute"]
  },
  {
    id: 'ip',
    icon: Scale,
    titleKey: "services.ip",
    descKey: "services.ipDesc",
    cases: "890+",
    avgPrice: "RM 1,500-6,000",
    color: "from-indigo-400 to-indigo-500",
    features: ["patentApplication", "trademarkRegistration", "copyrightProtection", "infringementLitigation", "licensingAgreement"]
  },
];

// 功能名称的翻译映射
const featureTranslations: Record<string, { zh: string; en: string; ms: string }> = {
  // Debt
  debtCollection: { zh: "债务追讨", en: "Debt Collection", ms: "Kutipan Hutang" },
  bankruptcy: { zh: "破产申请", en: "Bankruptcy", ms: "Kebankrapan" },
  debtRestructuring: { zh: "债务重组", en: "Debt Restructuring", ms: "Penstrukturan Semula Hutang" },
  creditorProtection: { zh: "债权人保护", en: "Creditor Protection", ms: "Perlindungan Pemiutang" },
  repaymentAgreement: { zh: "还款协议", en: "Repayment Agreement", ms: "Perjanjian Pembayaran Balik" },
  // Family
  divorce: { zh: "离婚诉讼", en: "Divorce", ms: "Perceraian" },
  custody: { zh: "子女监护权", en: "Child Custody", ms: "Hak Penjagaan Anak" },
  propertyDivision: { zh: "财产分配", en: "Property Division", ms: "Pembahagian Harta" },
  prenuptial: { zh: "婚前协议", en: "Prenuptial Agreement", ms: "Perjanjian Pranikah" },
  domesticViolence: { zh: "家庭暴力保护令", en: "Domestic Violence Protection", ms: "Perlindungan Keganasan Rumah Tangga" },
  // Business
  companyRegistration: { zh: "公司注册", en: "Company Registration", ms: "Pendaftaran Syarikat" },
  contractDrafting: { zh: "合同起草", en: "Contract Drafting", ms: "Draf Kontrak" },
  businessNegotiation: { zh: "商业谈判", en: "Business Negotiation", ms: "Rundingan Perniagaan" },
  equityTransfer: { zh: "股权转让", en: "Equity Transfer", ms: "Pemindahan Ekuiti" },
  trademarkRegistration: { zh: "商标注册", en: "Trademark Registration", ms: "Pendaftaran Cap Dagangan" },
  // Property
  propertyTransaction: { zh: "房产买卖", en: "Property Transaction", ms: "Transaksi Hartanah" },
  leaseAgreement: { zh: "租赁协议", en: "Lease Agreement", ms: "Perjanjian Sewa" },
  titleTransfer: { zh: "产权转让", en: "Title Transfer", ms: "Pemindahan Hak Milik" },
  landDispute: { zh: "土地纠纷", en: "Land Dispute", ms: "Pertikaian Tanah" },
  propertyDevelopment: { zh: "房产开发", en: "Property Development", ms: "Pembangunan Hartanah" },
  // Criminal
  criminalDefense: { zh: "刑事辩护", en: "Criminal Defense", ms: "Pembelaan Jenayah" },
  bailApplication: { zh: "保释申请", en: "Bail Application", ms: "Permohonan Jaminan" },
  appealService: { zh: "上诉服务", en: "Appeal Service", ms: "Perkhidmatan Rayuan" },
  witnessProtection: { zh: "证人保护", en: "Witness Protection", ms: "Perlindungan Saksi" },
  legalConsultation: { zh: "法律咨询", en: "Legal Consultation", ms: "Perundingan Undang-undang" },
  // Employment
  laborDispute: { zh: "劳动纠纷", en: "Labor Dispute", ms: "Pertikaian Buruh" },
  wrongfulDismissal: { zh: "不当解雇", en: "Wrongful Dismissal", ms: "Pemecatan Salah" },
  workInjury: { zh: "工伤赔偿", en: "Work Injury Compensation", ms: "Pampasan Kecederaan Kerja" },
  employmentContract: { zh: "劳动合同", en: "Employment Contract", ms: "Kontrak Pekerjaan" },
  salaryDispute: { zh: "薪资纠纷", en: "Salary Dispute", ms: "Pertikaian Gaji" },
  // IP
  patentApplication: { zh: "专利申请", en: "Patent Application", ms: "Permohonan Paten" },
  copyrightProtection: { zh: "版权保护", en: "Copyright Protection", ms: "Perlindungan Hak Cipta" },
  infringementLitigation: { zh: "侵权诉讼", en: "Infringement Litigation", ms: "Litigasi Pelanggaran" },
  licensingAgreement: { zh: "许可协议", en: "Licensing Agreement", ms: "Perjanjian Pelesenan" },
};

export default function ServicesPage() {
  const { t, language } = useLanguage();

  const getFeatureName = (featureKey: string) => {
    const translation = featureTranslations[featureKey];
    if (!translation) return featureKey;
    return translation[language] || translation.zh;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('pages.servicesTitle')}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {t('pages.servicesSubtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 border border-neutral-200 hover:border-primary-300"
                  >
                    {/* Icon */}
                    <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {t(service.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-700 mb-6">
                      {t(service.descKey)}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-neutral-900 mb-3">{t('pages.serviceContent')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full"
                          >
                            {getFeatureName(feature)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                      <div>
                        <p className="text-sm text-neutral-600">{service.cases} {t('common.cases')}</p>
                        <p className="text-lg font-bold text-primary-600">{service.avgPrice}</p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('home.ctaSubtitle')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/consultation"
                className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-bold text-lg transition-all"
              >
                {t('home.ctaButton')}
              </Link>
              <Link
                href="/lawyers"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-lg transition-all border-2 border-white/30"
              >
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
