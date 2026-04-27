// 马来西亚律师API
export interface Lawyer {
  id: string;
  name: string;
  specialty: string[];
  rating: number;
  reviews: number;
  location: string;
  state: string;
  experience: number;
  responseTime: string;
  available: boolean;
  priceRange: string;
  soldCount: number;
  languages: string[];
  education: string[];
  certifications: string[];
  bio: string;
  avatar?: string;
}

export interface LawyerSpecialty {
  id: string;
  name: string;
  nameMs: string;
  nameCn: string;
  lawyerCount: number;
  icon: string;
}

// 马来西亚律师专业领域
export const lawyerSpecialties: LawyerSpecialty[] = [
  { id: 'family', name: 'Family Law', nameMs: 'Undang-undang Keluarga', nameCn: '家庭法', lawyerCount: 234, icon: '👨‍👩‍👧' },
  { id: 'business', name: 'Business Law', nameMs: 'Undang-undang Perniagaan', nameCn: '商业法', lawyerCount: 312, icon: '💼' },
  { id: 'property', name: 'Property Law', nameMs: 'Undang-undang Hartanah', nameCn: '房产法', lawyerCount: 198, icon: '🏠' },
  { id: 'criminal', name: 'Criminal Law', nameMs: 'Undang-undang Jenayah', nameCn: '刑法', lawyerCount: 156, icon: '⚖️' },
  { id: 'employment', name: 'Employment Law', nameMs: 'Undang-undang Pekerjaan', nameCn: '劳动法', lawyerCount: 187, icon: '👔' },
  { id: 'ip', name: 'Intellectual Property', nameMs: 'Harta Intelek', nameCn: '知识产权', lawyerCount: 89, icon: '💡' },
];

// 马来西亚州属
export const malaysianStates = [
  'Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak', 'Kedah', 
  'Kelantan', 'Terengganu', 'Pahang', 'Negeri Sembilan', 'Melaka', 
  'Sabah', 'Sarawak', 'Perlis', 'Putrajaya', 'Labuan'
];

// 模拟马来西亚律师数据
const mockLawyers: Lawyer[] = [
  {
    id: 'law-001',
    name: 'Ahmad Abdullah',
    specialty: ['Business Law', 'Corporate Law'],
    rating: 4.9,
    reviews: 156,
    location: 'Kuala Lumpur',
    state: 'Kuala Lumpur',
    experience: 15,
    responseTime: '1小时',
    available: true,
    priceRange: 'RM 500-1000',
    soldCount: 156,
    languages: ['English', 'Malay', 'Arabic'],
    education: ['LL.B University of Malaya', 'LL.M Harvard Law School'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Certified Corporate Lawyer'],
    bio: 'Experienced corporate lawyer specializing in business formation and contract law',
  },
  {
    id: 'law-002',
    name: 'Tan Mei Ling',
    specialty: ['Family Law', 'Divorce'],
    rating: 4.8,
    reviews: 203,
    location: 'Penang',
    state: 'Penang',
    experience: 12,
    responseTime: '2小时',
    available: true,
    priceRange: 'RM 400-800',
    soldCount: 203,
    languages: ['English', 'Mandarin', 'Malay', 'Hokkien'],
    education: ['LL.B National University of Singapore', 'Barrister-at-Law (Lincoln\'s Inn)'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Family Law Specialist'],
    bio: 'Compassionate family law attorney with expertise in divorce and child custody',
  },
  {
    id: 'law-003',
    name: 'Kumar Rajesh',
    specialty: ['Property Law', 'Real Estate'],
    rating: 4.9,
    reviews: 178,
    location: 'Johor Bahru',
    state: 'Johor',
    experience: 18,
    responseTime: '30分钟',
    available: false,
    priceRange: 'RM 600-1200',
    soldCount: 178,
    languages: ['English', 'Malay', 'Tamil'],
    education: ['LL.B University of London', 'LL.M University of Cambridge'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Property Law Expert'],
    bio: 'Senior property lawyer with extensive experience in real estate transactions',
  },
  {
    id: 'law-004',
    name: '李明 (Lee Ming)',
    specialty: ['Business Law', 'IP Law'],
    rating: 4.7,
    reviews: 142,
    location: 'Kuala Lumpur',
    state: 'Kuala Lumpur',
    experience: 10,
    responseTime: '1小时',
    available: true,
    priceRange: 'RM 400-900',
    soldCount: 142,
    languages: ['English', 'Mandarin', 'Malay', 'Cantonese'],
    education: ['LL.B Tsinghua University', 'LL.M University of Malaya'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'IP Law Certified'],
    bio: 'Bilingual lawyer specializing in business and intellectual property matters',
  },
  {
    id: 'law-005',
    name: 'Sarah Wong',
    specialty: ['Family Law', 'Mediation'],
    rating: 4.9,
    reviews: 189,
    location: 'Selangor',
    state: 'Selangor',
    experience: 14,
    responseTime: '2小时',
    available: true,
    priceRange: 'RM 500-1000',
    soldCount: 189,
    languages: ['English', 'Mandarin', 'Malay'],
    education: ['LL.B University of Malaya', 'Mediation Certification'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Certified Mediator'],
    bio: 'Family law specialist with focus on amicable dispute resolution',
  },
  {
    id: 'law-006',
    name: 'Raj Kumar',
    specialty: ['Property Law', 'Conveyancing'],
    rating: 4.8,
    reviews: 165,
    location: 'Penang',
    state: 'Penang',
    experience: 16,
    responseTime: '1.5小时',
    available: true,
    priceRange: 'RM 600-1100',
    soldCount: 165,
    languages: ['English', 'Malay', 'Tamil', 'Hindi'],
    education: ['LL.B University of Malaya', 'Conveyancing Specialist Course'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Licensed Conveyancer'],
    bio: 'Expert in property transactions and conveyancing services',
  },
  {
    id: 'law-007',
    name: 'Nurul Huda',
    specialty: ['Criminal Law', 'Litigation'],
    rating: 4.7,
    reviews: 134,
    location: 'Kuala Lumpur',
    state: 'Kuala Lumpur',
    experience: 11,
    responseTime: '3小时',
    available: true,
    priceRange: 'RM 800-1500',
    soldCount: 134,
    languages: ['English', 'Malay'],
    education: ['LL.B International Islamic University', 'Barrister-at-Law (Gray\'s Inn)'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Criminal Law Specialist'],
    bio: 'Experienced criminal defense lawyer with strong litigation skills',
  },
  {
    id: 'law-008',
    name: 'David Tan',
    specialty: ['Employment Law', 'Labor Disputes'],
    rating: 4.6,
    reviews: 121,
    location: 'Selangor',
    state: 'Selangor',
    experience: 9,
    responseTime: '2小时',
    available: true,
    priceRange: 'RM 400-800',
    soldCount: 121,
    languages: ['English', 'Mandarin', 'Malay'],
    education: ['LL.B University of Malaya', 'Labor Law Certification'],
    certifications: ['Advocate & Solicitor (Malaysia)', 'Employment Law Expert'],
    bio: 'Dedicated employment lawyer helping workers and employers resolve disputes',
  },
];

// 获取律师列表
export async function fetchLawyers(filters?: {
  specialty?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  available?: boolean;
}): Promise<Lawyer[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = mockLawyers;
  
  if (filters?.specialty) {
    filtered = filtered.filter(l => l.specialty.includes(filters.specialty!));
  }
  
  if (filters?.location) {
    filtered = filtered.filter(l => l.state === filters.location);
  }
  
  if (filters?.minRating) {
    filtered = filtered.filter(l => l.rating >= filters.minRating!);
  }
  
  if (filters?.available !== undefined) {
    filtered = filtered.filter(l => l.available === filters.available);
  }
  
  return filtered;
}

// 获取单个律师详情
export async function fetchLawyerById(id: string): Promise<Lawyer | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLawyers.find(l => l.id === id) || null;
}

// 搜索律师
export async function searchLawyers(query: string): Promise<Lawyer[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowerQuery = query.toLowerCase();
  return mockLawyers.filter(l => 
    l.name.toLowerCase().includes(lowerQuery) ||
    l.specialty.some(s => s.toLowerCase().includes(lowerQuery)) ||
    l.location.toLowerCase().includes(lowerQuery)
  );
}

// 获取热门律师
export async function fetchTopLawyers(limit: number = 6): Promise<Lawyer[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockLawyers]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, limit);
}
