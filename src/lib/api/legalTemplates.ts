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
}

export interface TemplateCategory {
  id: string;
  name: string;
  nameMs: string;
  nameCn: string;
  count: number;
  icon: string;
}

// 马来西亚法律文书分类
export const templateCategories: TemplateCategory[] = [
  { id: 'employment', name: 'Employment Contracts', nameMs: 'Kontrak Pekerjaan', nameCn: '雇佣合同', count: 45, icon: '👔' },
  { id: 'property', name: 'Property Agreements', nameMs: 'Perjanjian Hartanah', nameCn: '房产协议', count: 38, icon: '🏠' },
  { id: 'business', name: 'Business Contracts', nameMs: 'Kontrak Perniagaan', nameCn: '商业合同', count: 52, icon: '💼' },
  { id: 'tenancy', name: 'Tenancy Agreements', nameMs: 'Perjanjian Sewa', nameCn: '租赁协议', count: 28, icon: '🔑' },
  { id: 'loan', name: 'Loan Agreements', nameMs: 'Perjanjian Pinjaman', nameCn: '贷款协议', count: 22, icon: '💰' },
  { id: 'partnership', name: 'Partnership Deeds', nameMs: 'Surat Perkongsian', nameCn: '合伙协议', count: 18, icon: '🤝' },
  { id: 'nda', name: 'Non-Disclosure Agreements', nameMs: 'Perjanjian Kerahsiaan', nameCn: '保密协议', count: 15, icon: '🔒' },
  { id: 'will', name: 'Wills & Estate', nameMs: 'Wasiat & Harta Pusaka', nameCn: '遗嘱与遗产', count: 12, icon: '📜' },
];

// 模拟马来西亚法律文书模板数据
const mockTemplates: LegalTemplate[] = [
  {
    id: 'emp-001',
    title: 'Employment Contract (Malaysia)',
    category: 'employment',
    description: 'Standard employment contract compliant with Malaysian Employment Act 1955',
    language: 'en',
    price: 0,
    downloads: 2340,
    rating: 4.8,
    lastUpdated: '2024-01-15',
  },
  {
    id: 'emp-002',
    title: 'Kontrak Pekerjaan (Malaysia)',
    category: 'employment',
    description: 'Kontrak pekerjaan standard yang mematuhi Akta Kerja 1955',
    language: 'ms',
    price: 0,
    downloads: 1890,
    rating: 4.7,
    lastUpdated: '2024-01-15',
  },
  {
    id: 'prop-001',
    title: 'Sale and Purchase Agreement (SPA)',
    category: 'property',
    description: 'Property sale agreement for residential and commercial properties in Malaysia',
    language: 'en',
    price: 0,
    downloads: 3120,
    rating: 4.9,
    lastUpdated: '2024-01-10',
  },
  {
    id: 'ten-001',
    title: 'Tenancy Agreement (Residential)',
    category: 'tenancy',
    description: 'Standard residential tenancy agreement for Malaysia',
    language: 'en',
    price: 0,
    downloads: 4560,
    rating: 4.8,
    lastUpdated: '2024-01-20',
  },
  {
    id: 'bus-001',
    title: 'Service Agreement',
    category: 'business',
    description: 'Professional service agreement for Malaysian businesses',
    language: 'en',
    price: 0,
    downloads: 1670,
    rating: 4.6,
    lastUpdated: '2024-01-12',
  },
  {
    id: 'loan-001',
    title: 'Personal Loan Agreement',
    category: 'loan',
    description: 'Personal loan agreement template compliant with Malaysian law',
    language: 'en',
    price: 0,
    downloads: 980,
    rating: 4.5,
    lastUpdated: '2024-01-08',
  },
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
