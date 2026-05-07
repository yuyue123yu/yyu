// Malaysia Legal Knowledge API
export interface LegalArticle {
  id: string;
  title: string;
  titleMs?: string;
  titleCn?: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: number;
  views: number;
  tags: string[];
  relatedLaws: string[];
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  nameMs: string;
  nameCn: string;
  articleCount: number;
  icon: string;
}

// Malaysia Legal Knowledge Categories
export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'employment', name: 'Employment Law', nameMs: 'Undang-undang Pekerjaan', nameCn: 'Employment Law', articleCount: 156, icon: '👔' },
  { id: 'property', name: 'Property Law', nameMs: 'Undang-undang Hartanah', nameCn: 'Property Law', articleCount: 142, icon: '🏠' },
  { id: 'family', name: 'Family Law', nameMs: 'Undang-undang Keluarga', nameCn: 'Family Law', articleCount: 98, icon: '👨‍👩‍👧' },
  { id: 'business', name: 'Business Law', nameMs: 'Undang-undang Perniagaan', nameCn: 'Business Law', articleCount: 203, icon: '💼' },
  { id: 'criminal', name: 'Criminal Law', nameMs: 'Undang-undang Jenayah', nameCn: 'Criminal Law', articleCount: 87, icon: '⚖️' },
  { id: 'consumer', name: 'Consumer Rights', nameMs: 'Hak Pengguna', nameCn: 'Consumer Rights', articleCount: 76, icon: '🛒' },
  { id: 'immigration', name: 'Immigration Law', nameMs: 'Undang-undang Imigresen', nameCn: 'Immigration Law', articleCount: 54, icon: '✈️' },
  { id: 'tax', name: 'Tax Law', nameMs: 'Undang-undang Cukai', nameCn: 'Tax Law', articleCount: 92, icon: '💰' },
];

// Mock Malaysia Legal Knowledge Articles
const mockArticles: LegalArticle[] = [
  {
    id: 'art-001',
    title: 'Understanding the Employment Act 1955 in Malaysia',
    titleMs: 'Memahami Akta Kerja 1955 di Malaysia',
    titleCn: 'Understanding Employment Act 1955',
    category: 'employment',
    summary: 'A comprehensive guide to employee rights and employer obligations under Malaysian law',
    content: 'The Employment Act 1955 is the main legislation governing employment in Malaysia...',
    author: 'Ahmad Abdullah',
    publishedDate: '2024-01-15',
    readTime: 8,
    views: 12450,
    tags: ['Employment', 'Rights', 'Obligations'],
    relatedLaws: ['Employment Act 1955', 'Industrial Relations Act 1967'],
  },
  {
    id: 'art-002',
    title: 'Property Ownership Rights in Malaysia',
    titleMs: 'Hak Pemilikan Hartanah di Malaysia',
    titleCn: 'Property Ownership Rights',
    category: 'property',
    summary: 'Learn about property ownership, transfer procedures, and legal requirements',
    content: 'Property ownership in Malaysia is governed by the National Land Code 1965...',
    author: 'Tan Mei Ling',
    publishedDate: '2024-01-12',
    readTime: 10,
    views: 15670,
    tags: ['Property', 'Ownership', 'Land Law'],
    relatedLaws: ['National Land Code 1965', 'Strata Titles Act 1985'],
  },
  {
    id: 'art-003',
    title: 'Divorce Procedures in Malaysia',
    titleMs: 'Prosedur Perceraian di Malaysia',
    titleCn: 'Divorce Procedures',
    category: 'family',
    summary: 'Understanding divorce laws, procedures, and child custody arrangements',
    content: 'Divorce in Malaysia is governed by different laws depending on religion...',
    author: 'Sarah Wong',
    publishedDate: '2024-01-10',
    readTime: 12,
    views: 9870,
    tags: ['Divorce', 'Family Law', 'Custody'],
    relatedLaws: ['Law Reform (Marriage and Divorce) Act 1976', 'Islamic Family Law'],
  },
  {
    id: 'art-004',
    title: 'Starting a Business in Malaysia: Legal Requirements',
    titleMs: 'Memulakan Perniagaan di Malaysia: Keperluan Undang-undang',
    titleCn: 'Starting a Business',
    category: 'business',
    summary: 'Complete guide to business registration, licenses, and compliance',
    content: 'Starting a business in Malaysia requires understanding various legal requirements...',
    author: 'Kumar Rajesh',
    publishedDate: '2024-01-08',
    readTime: 15,
    views: 18920,
    tags: ['Business', 'Registration', 'Compliance'],
    relatedLaws: ['Companies Act 2016', 'Business Registration Act 1956'],
  },
  {
    id: 'art-005',
    title: 'Consumer Protection Rights in Malaysia',
    titleMs: 'Hak Perlindungan Pengguna di Malaysia',
    titleCn: 'Consumer Protection Rights',
    category: 'consumer',
    summary: 'Know your rights as a consumer and how to file complaints',
    content: 'The Consumer Protection Act 1999 provides comprehensive protection...',
    author: 'Lee Ming',
    publishedDate: '2024-01-05',
    readTime: 7,
    views: 8450,
    tags: ['Consumer Rights', 'Protection', 'Complaints'],
    relatedLaws: ['Consumer Protection Act 1999', 'Sale of Goods Act 1957'],
  },
  {
    id: 'art-006',
    title: 'Work Permit and Employment Pass Requirements',
    titleMs: 'Keperluan Permit Kerja dan Pas Pekerjaan',
    titleCn: 'Work Permit Requirements',
    category: 'immigration',
    summary: 'Guide for foreign workers and employers on work permits in Malaysia',
    content: 'Foreign nationals working in Malaysia must obtain proper work authorization...',
    author: 'Raj Kumar',
    publishedDate: '2024-01-03',
    readTime: 9,
    views: 11230,
    tags: ['Immigration', 'Work Permit', 'Foreign Workers'],
    relatedLaws: ['Immigration Act 1959/63', 'Employment (Restriction) Act 1968'],
  },
];

// Fetch all articles
export async function fetchLegalArticles(category?: string, limit?: number): Promise<LegalArticle[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = mockArticles;
  
  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }
  
  if (limit) {
    filtered = filtered.slice(0, limit);
  }
  
  return filtered;
}

// Fetch single article
export async function fetchArticleById(id: string): Promise<LegalArticle | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockArticles.find(a => a.id === id) || null;
}

// Search articles
export async function searchArticles(query: string): Promise<LegalArticle[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowerQuery = query.toLowerCase();
  return mockArticles.filter(a => 
    a.title.toLowerCase().includes(lowerQuery) ||
    a.summary.toLowerCase().includes(lowerQuery) ||
    a.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Fetch popular articles
export async function fetchPopularArticles(limit: number = 5): Promise<LegalArticle[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Export all article IDs for static generation
export function getAllArticleIds(): string[] {
  return mockArticles.map(a => a.id);
}
