// 马来西亚法律文书模板API
export interface LegalTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  language: 'en' | 'ms' | 'zh';
  price: number;
  downloads: number;
  rating: number;
  lastUpdated: string;
  previewUrl?: string;
  downloadUrl?: string;
  fileSize?: string;
  pages?: number;
}

export interface TemplateCategory {
  id: string;
  name: string;
  nameMs: string;
  nameCn: string;
  count: number;
  icon: string;
}

// 生成模板数据的辅助函数
function generateTemplates(): LegalTemplate[] {
  const templates: LegalTemplate[] = [];
  
  // 雇佣合同 (45个)
  const employmentTemplates = [
    { title: 'Employment Contract (Malaysia)', titleMs: 'Kontrak Pekerjaan', titleCn: '雇佣合同', desc: 'Standard employment contract compliant with Malaysian Employment Act 1955' },
    { title: 'Part-Time Employment Agreement', titleMs: 'Perjanjian Kerja Sambilan', titleCn: '兼职雇佣协议', desc: 'Part-time work agreement with flexible hours' },
    { title: 'Fixed-Term Contract', titleMs: 'Kontrak Tempoh Tetap', titleCn: '固定期限合同', desc: 'Fixed-term employment contract template' },
    { title: 'Probation Period Agreement', titleMs: 'Perjanjian Tempoh Percubaan', titleCn: '试用期协议', desc: 'Probationary employment terms and conditions' },
    { title: 'Executive Employment Contract', titleMs: 'Kontrak Pekerjaan Eksekutif', titleCn: '高管雇佣合同', desc: 'Senior executive employment agreement' },
    { title: 'Internship Agreement', titleMs: 'Perjanjian Latihan Industri', titleCn: '实习协议', desc: 'Internship terms and conditions' },
    { title: 'Remote Work Agreement', titleMs: 'Perjanjian Kerja Jarak Jauh', titleCn: '远程工作协议', desc: 'Work from home employment contract' },
    { title: 'Freelance Contract', titleMs: 'Kontrak Pekerja Bebas', titleCn: '自由职业合同', desc: 'Independent contractor agreement' },
    { title: 'Commission-Based Agreement', titleMs: 'Perjanjian Berasaskan Komisen', titleCn: '佣金制协议', desc: 'Sales commission employment contract' },
    { title: 'Confidentiality Agreement (Employee)', titleMs: 'Perjanjian Kerahsiaan Pekerja', titleCn: '员工保密协议', desc: 'Employee confidentiality and non-disclosure' },
    { title: 'Non-Compete Agreement', titleMs: 'Perjanjian Tidak Bersaing', titleCn: '竞业禁止协议', desc: 'Post-employment non-compete clause' },
    { title: 'Termination Letter Template', titleMs: 'Templat Surat Penamatan', titleCn: '解雇信模板', desc: 'Employment termination notice' },
    { title: 'Resignation Letter', titleMs: 'Surat Peletakan Jawatan', titleCn: '辞职信', desc: 'Employee resignation template' },
    { title: 'Offer Letter Template', titleMs: 'Templat Surat Tawaran', titleCn: '录用通知书', desc: 'Job offer letter format' },
    { title: 'Salary Increment Letter', titleMs: 'Surat Kenaikan Gaji', titleCn: '加薪通知书', desc: 'Salary increase notification' },
  ];
  
  employmentTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `emp-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'employment',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 3000) + 500,
        rating: 4.5 + Math.random() * 0.5,
        lastUpdated: '2024-01-15',
        fileSize: '2-5 MB',
        pages: Math.floor(Math.random() * 10) + 3,
      });
    });
  });
  
  // 房产协议 (38个)
  const propertyTemplates = [
    { title: 'Sale and Purchase Agreement (SPA)', titleMs: 'Perjanjian Jual Beli', titleCn: '买卖协议', desc: 'Property sale agreement for residential and commercial properties' },
    { title: 'Property Transfer Agreement', titleMs: 'Perjanjian Pemindahan Harta', titleCn: '房产转让协议', desc: 'Property ownership transfer document' },
    { title: 'Land Purchase Agreement', titleMs: 'Perjanjian Pembelian Tanah', titleCn: '土地购买协议', desc: 'Land acquisition contract' },
    { title: 'Joint Ownership Agreement', titleMs: 'Perjanjian Pemilikan Bersama', titleCn: '共同所有权协议', desc: 'Co-ownership property agreement' },
    { title: 'Property Development Agreement', titleMs: 'Perjanjian Pembangunan Hartanah', titleCn: '房地产开发协议', desc: 'Development project contract' },
    { title: 'Option to Purchase', titleMs: 'Opsyen Untuk Membeli', titleCn: '购买选择权', desc: 'Property purchase option agreement' },
    { title: 'Booking Form', titleMs: 'Borang Tempahan', titleCn: '预订表格', desc: 'Property booking reservation form' },
    { title: 'Mortgage Agreement', titleMs: 'Perjanjian Gadai Janji', titleCn: '抵押协议', desc: 'Property mortgage contract' },
    { title: 'Property Valuation Report', titleMs: 'Laporan Penilaian Hartanah', titleCn: '房产估值报告', desc: 'Property valuation template' },
    { title: 'Strata Title Transfer', titleMs: 'Pemindahan Hakmilik Strata', titleCn: '分层地契转让', desc: 'Strata property transfer document' },
    { title: 'Easement Agreement', titleMs: 'Perjanjian Easement', titleCn: '地役权协议', desc: 'Property easement rights' },
    { title: 'Boundary Agreement', titleMs: 'Perjanjian Sempadan', titleCn: '边界协议', desc: 'Property boundary definition' },
    { title: 'Right of Way Agreement', titleMs: 'Perjanjian Hak Laluan', titleCn: '通行权协议', desc: 'Access rights agreement' },
  ];
  
  propertyTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `prop-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'property',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 4000) + 1000,
        rating: 4.6 + Math.random() * 0.4,
        lastUpdated: '2024-01-10',
        fileSize: '3-8 MB',
        pages: Math.floor(Math.random() * 15) + 5,
      });
    });
  });
  
  // 商业合同 (52个)
  const businessTemplates = [
    { title: 'Service Agreement', titleMs: 'Perjanjian Perkhidmatan', titleCn: '服务协议', desc: 'Professional service contract' },
    { title: 'Supplier Agreement', titleMs: 'Perjanjian Pembekal', titleCn: '供应商协议', desc: 'Supplier terms and conditions' },
    { title: 'Distribution Agreement', titleMs: 'Perjanjian Pengedaran', titleCn: '分销协议', desc: 'Product distribution contract' },
    { title: 'Franchise Agreement', titleMs: 'Perjanjian Francais', titleCn: '特许经营协议', desc: 'Franchise business contract' },
    { title: 'Joint Venture Agreement', titleMs: 'Perjanjian Usaha Sama', titleCn: '合资协议', desc: 'Joint business venture contract' },
    { title: 'Shareholders Agreement', titleMs: 'Perjanjian Pemegang Saham', titleCn: '股东协议', desc: 'Company shareholders agreement' },
    { title: 'Memorandum of Understanding (MOU)', titleMs: 'Memorandum Persefahaman', titleCn: '谅解备忘录', desc: 'Business MOU template' },
    { title: 'Purchase Order', titleMs: 'Pesanan Pembelian', titleCn: '采购订单', desc: 'Business purchase order form' },
    { title: 'Quotation Template', titleMs: 'Templat Sebut Harga', titleCn: '报价单模板', desc: 'Business quotation format' },
    { title: 'Invoice Template', titleMs: 'Templat Invois', titleCn: '发票模板', desc: 'Business invoice format' },
    { title: 'Consulting Agreement', titleMs: 'Perjanjian Perundingan', titleCn: '咨询协议', desc: 'Consulting services contract' },
    { title: 'Agency Agreement', titleMs: 'Perjanjian Agensi', titleCn: '代理协议', desc: 'Business agency contract' },
    { title: 'Marketing Agreement', titleMs: 'Perjanjian Pemasaran', titleCn: '营销协议', desc: 'Marketing services contract' },
    { title: 'Licensing Agreement', titleMs: 'Perjanjian Pelesenan', titleCn: '许可协议', desc: 'Business licensing contract' },
    { title: 'Vendor Agreement', titleMs: 'Perjanjian Vendor', titleCn: '供应商协议', desc: 'Vendor services contract' },
    { title: 'Subcontractor Agreement', titleMs: 'Perjanjian Subkontraktor', titleCn: '分包协议', desc: 'Subcontracting terms' },
    { title: 'Sales Agreement', titleMs: 'Perjanjian Jualan', titleCn: '销售协议', desc: 'Sales contract template' },
    { title: 'Commission Agreement', titleMs: 'Perjanjian Komisen', titleCn: '佣金协议', desc: 'Commission-based contract' },
  ];
  
  businessTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `bus-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'business',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 2500) + 800,
        rating: 4.5 + Math.random() * 0.5,
        lastUpdated: '2024-01-12',
        fileSize: '1-4 MB',
        pages: Math.floor(Math.random() * 12) + 4,
      });
    });
  });
  
  // 租赁协议 (28个)
  const tenancyTemplates = [
    { title: 'Tenancy Agreement (Residential)', titleMs: 'Perjanjian Sewa Kediaman', titleCn: '住宅租赁协议', desc: 'Residential tenancy contract' },
    { title: 'Commercial Lease Agreement', titleMs: 'Perjanjian Pajakan Komersial', titleCn: '商业租赁协议', desc: 'Commercial property lease' },
    { title: 'Room Rental Agreement', titleMs: 'Perjanjian Sewa Bilik', titleCn: '房间租赁协议', desc: 'Single room rental contract' },
    { title: 'Sublease Agreement', titleMs: 'Perjanjian Subpajakan', titleCn: '转租协议', desc: 'Property sublease contract' },
    { title: 'Lease Renewal Agreement', titleMs: 'Perjanjian Pembaharuan Pajakan', titleCn: '租约续签协议', desc: 'Tenancy renewal terms' },
    { title: 'Lease Termination Notice', titleMs: 'Notis Penamatan Pajakan', titleCn: '租约终止通知', desc: 'Tenancy termination letter' },
    { title: 'Rental Deposit Receipt', titleMs: 'Resit Deposit Sewa', titleCn: '租金押金收据', desc: 'Security deposit receipt' },
    { title: 'Rent Increase Notice', titleMs: 'Notis Kenaikan Sewa', titleCn: '租金上涨通知', desc: 'Rent increase notification' },
    { title: 'Property Inspection Report', titleMs: 'Laporan Pemeriksaan Hartanah', titleCn: '房产检查报告', desc: 'Tenancy inspection checklist' },
    { title: 'Parking Space Rental', titleMs: 'Sewa Tempat Letak Kereta', titleCn: '停车位租赁', desc: 'Parking lot rental agreement' },
  ];
  
  tenancyTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `ten-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'tenancy',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 5000) + 2000,
        rating: 4.7 + Math.random() * 0.3,
        lastUpdated: '2024-01-20',
        fileSize: '1-3 MB',
        pages: Math.floor(Math.random() * 8) + 3,
      });
    });
  });
  
  // 贷款协议 (22个)
  const loanTemplates = [
    { title: 'Personal Loan Agreement', titleMs: 'Perjanjian Pinjaman Peribadi', titleCn: '个人贷款协议', desc: 'Personal loan contract' },
    { title: 'Business Loan Agreement', titleMs: 'Perjanjian Pinjaman Perniagaan', titleCn: '商业贷款协议', desc: 'Business financing contract' },
    { title: 'Promissory Note', titleMs: 'Nota Janji Hutang', titleCn: '本票', desc: 'Loan promissory note' },
    { title: 'Loan Repayment Schedule', titleMs: 'Jadual Bayaran Balik Pinjaman', titleCn: '贷款还款计划', desc: 'Loan repayment plan' },
    { title: 'Debt Settlement Agreement', titleMs: 'Perjanjian Penyelesaian Hutang', titleCn: '债务和解协议', desc: 'Debt settlement terms' },
    { title: 'Loan Extension Agreement', titleMs: 'Perjanjian Lanjutan Pinjaman', titleCn: '贷款延期协议', desc: 'Loan term extension' },
    { title: 'Guarantor Agreement', titleMs: 'Perjanjian Penjamin', titleCn: '担保人协议', desc: 'Loan guarantor contract' },
    { title: 'Collateral Agreement', titleMs: 'Perjanjian Cagaran', titleCn: '抵押品协议', desc: 'Loan collateral terms' },
  ];
  
  loanTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `loan-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'loan',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 1500) + 500,
        rating: 4.4 + Math.random() * 0.6,
        lastUpdated: '2024-01-08',
        fileSize: '1-2 MB',
        pages: Math.floor(Math.random() * 6) + 2,
      });
    });
  });
  
  // 合伙协议 (18个)
  const partnershipTemplates = [
    { title: 'Partnership Agreement', titleMs: 'Perjanjian Perkongsian', titleCn: '合伙协议', desc: 'Business partnership contract' },
    { title: 'Partnership Dissolution', titleMs: 'Pembubaran Perkongsian', titleCn: '合伙解散协议', desc: 'Partnership termination agreement' },
    { title: 'Profit Sharing Agreement', titleMs: 'Perjanjian Perkongsian Keuntungan', titleCn: '利润分配协议', desc: 'Profit distribution terms' },
    { title: 'Partnership Amendment', titleMs: 'Pindaan Perjanjian Perkongsian', titleCn: '合伙修正协议', desc: 'Partnership agreement amendment' },
    { title: 'Silent Partner Agreement', titleMs: 'Perjanjian Rakan Kongsi Senyap', titleCn: '隐名合伙协议', desc: 'Silent partnership terms' },
    { title: 'Partnership Buy-Sell Agreement', titleMs: 'Perjanjian Jual Beli Perkongsian', titleCn: '合伙买卖协议', desc: 'Partner buyout agreement' },
  ];
  
  partnershipTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `part-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'partnership',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 1200) + 400,
        rating: 4.5 + Math.random() * 0.5,
        lastUpdated: '2024-01-18',
        fileSize: '2-4 MB',
        pages: Math.floor(Math.random() * 10) + 4,
      });
    });
  });
  
  // 保密协议 (15个)
  const ndaTemplates = [
    { title: 'Non-Disclosure Agreement (NDA)', titleMs: 'Perjanjian Tidak Mendedahkan', titleCn: '保密协议', desc: 'Confidentiality agreement' },
    { title: 'Mutual NDA', titleMs: 'NDA Bersama', titleCn: '双向保密协议', desc: 'Mutual confidentiality agreement' },
    { title: 'Employee NDA', titleMs: 'NDA Pekerja', titleCn: '员工保密协议', desc: 'Employee confidentiality terms' },
    { title: 'Vendor NDA', titleMs: 'NDA Vendor', titleCn: '供应商保密协议', desc: 'Vendor confidentiality agreement' },
    { title: 'Investor NDA', titleMs: 'NDA Pelabur', titleCn: '投资者保密协议', desc: 'Investor confidentiality terms' },
  ];
  
  ndaTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `nda-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'nda',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 2000) + 800,
        rating: 4.6 + Math.random() * 0.4,
        lastUpdated: '2024-01-22',
        fileSize: '1-2 MB',
        pages: Math.floor(Math.random() * 5) + 2,
      });
    });
  });
  
  // 遗嘱与遗产 (12个)
  const willTemplates = [
    { title: 'Last Will and Testament', titleMs: 'Wasiat Terakhir', titleCn: '遗嘱', desc: 'Last will and testament template' },
    { title: 'Living Will', titleMs: 'Wasiat Hidup', titleCn: '生前遗嘱', desc: 'Living will document' },
    { title: 'Power of Attorney', titleMs: 'Surat Kuasa Wakil', titleCn: '授权委托书', desc: 'Power of attorney document' },
    { title: 'Estate Planning Document', titleMs: 'Dokumen Perancangan Harta Pusaka', titleCn: '遗产规划文件', desc: 'Estate planning template' },
  ];
  
  willTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `will-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: lang === 'en' ? t.title : lang === 'ms' ? t.titleMs : t.titleCn,
        category: 'will',
        description: t.desc,
        language: lang as 'en' | 'ms' | 'zh',
        price: 0,
        downloads: Math.floor(Math.random() * 1000) + 300,
        rating: 4.7 + Math.random() * 0.3,
        lastUpdated: '2024-01-25',
        fileSize: '2-5 MB',
        pages: Math.floor(Math.random() * 8) + 3,
      });
    });
  });
  
  return templates;
}

// 生成所有模板
const mockTemplates = generateTemplates();

// 马来西亚法律文书分类（更新实际数量）
export const templateCategories: TemplateCategory[] = [
  { id: 'employment', name: 'Employment Contracts', nameMs: 'Kontrak Pekerjaan', nameCn: '雇佣合同', count: mockTemplates.filter(t => t.category === 'employment').length, icon: '👔' },
  { id: 'property', name: 'Property Agreements', nameMs: 'Perjanjian Hartanah', nameCn: '房产协议', count: mockTemplates.filter(t => t.category === 'property').length, icon: '🏠' },
  { id: 'business', name: 'Business Contracts', nameMs: 'Kontrak Perniagaan', nameCn: '商业合同', count: mockTemplates.filter(t => t.category === 'business').length, icon: '💼' },
  { id: 'tenancy', name: 'Tenancy Agreements', nameMs: 'Perjanjian Sewa', nameCn: '租赁协议', count: mockTemplates.filter(t => t.category === 'tenancy').length, icon: '🔑' },
  { id: 'loan', name: 'Loan Agreements', nameMs: 'Perjanjian Pinjaman', nameCn: '贷款协议', count: mockTemplates.filter(t => t.category === 'loan').length, icon: '💰' },
  { id: 'partnership', name: 'Partnership Deeds', nameMs: 'Surat Perkongsian', nameCn: '合伙协议', count: mockTemplates.filter(t => t.category === 'partnership').length, icon: '🤝' },
  { id: 'nda', name: 'Non-Disclosure Agreements', nameMs: 'Perjanjian Kerahsiaan', nameCn: '保密协议', count: mockTemplates.filter(t => t.category === 'nda').length, icon: '🔒' },
  { id: 'will', name: 'Wills & Estate', nameMs: 'Wasiat & Harta Pusaka', nameCn: '遗嘱与遗产', count: mockTemplates.filter(t => t.category === 'will').length, icon: '📜' },
];

// 获取所有模板
export async function fetchLegalTemplates(category?: string, language?: string): Promise<LegalTemplate[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = mockTemplates;
  
  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }
  
  if (language) {
    filtered = filtered.filter(t => t.language === language);
  }
  
  return filtered;
}

// 获取单个模板详情
export async function fetchTemplateById(id: string): Promise<LegalTemplate | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTemplates.find(t => t.id === id) || null;
}

// 搜索模板
export async function searchTemplates(query: string): Promise<LegalTemplate[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowerQuery = query.toLowerCase();
  return mockTemplates.filter(t => 
    t.title.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery)
  );
}

// 下载模板（模拟下载）
export async function downloadTemplate(id: string): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const template = mockTemplates.find(t => t.id === id);
  
  if (!template) {
    return {
      success: false,
      message: '模板不存在'
    };
  }
  
  // 模拟下载URL（实际应用中应该是真实的文件URL）
  const downloadUrl = `https://example.com/templates/${id}.pdf`;
  
  return {
    success: true,
    message: '下载成功！',
    downloadUrl
  };
}
