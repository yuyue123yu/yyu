// 用户评价API
export interface UserReview {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerSpecialty: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  date: string;
  images?: string[];
}

// 模拟用户评价数据
const mockReviews: UserReview[] = [
  {
    id: 'rev-001',
    lawyerId: 'law-001',
    lawyerName: 'Ahmad Abdullah',
    lawyerSpecialty: '商业法',
    userId: 'user-001',
    userName: '张先生',
    rating: 5,
    title: '非常专业的律师，帮我解决了公司合同问题',
    content: '响应速度快，专业知识过硬，给出的建议非常实用。价格也很合理，强烈推荐！整个咨询过程非常顺畅，律师耐心解答了我所有的疑问。',
    helpful: 234,
    verified: true,
    date: '2024-01-15',
  },
  {
    id: 'rev-002',
    lawyerId: 'law-002',
    lawyerName: 'Sarah Wong',
    lawyerSpecialty: '家庭法',
    userId: 'user-002',
    userName: '李女士',
    rating: 5,
    title: '在困难时期得到了专业的法律支持',
    content: '律师非常有耐心，详细解释了每一个法律程序。让我在离婚过程中感到被理解和支持。非常感谢她的帮助。',
    helpful: 189,
    verified: true,
    date: '2024-01-14',
  },
  {
    id: 'rev-003',
    lawyerId: 'law-003',
    lawyerName: 'Kumar Rajesh',
    lawyerSpecialty: '房产法',
    userId: 'user-003',
    userName: 'Ahmad',
    rating: 4,
    title: '房产纠纷得到妥善解决',
    content: '律师的谈判技巧很强，最终以满意的价格完成了房产交易。整个过程透明高效，值得信赖。',
    helpful: 156,
    verified: true,
    date: '2024-01-13',
  },
  {
    id: 'rev-004',
    lawyerId: 'law-002',
    lawyerName: 'Tan Mei Ling',
    lawyerSpecialty: '家庭法',
    userId: 'user-004',
    userName: '王女士',
    rating: 5,
    title: '完全超出预期的服务质量',
    content: '不仅解决了法律问题，还给了我很多生活建议。这样的律师真的很难找到。非常感谢！',
    helpful: 267,
    verified: true,
    date: '2024-01-12',
  },
  {
    id: 'rev-005',
    lawyerId: 'law-004',
    lawyerName: '李明',
    lawyerSpecialty: '商业法',
    userId: 'user-005',
    userName: 'David Tan',
    rating: 5,
    title: '创业者的最佳法律顾问',
    content: '从公司注册到合同审查，全程指导。价格透明，没有隐藏费用，非常信任。推荐给所有创业者。',
    helpful: 198,
    verified: true,
    date: '2024-01-11',
  },
  {
    id: 'rev-006',
    lawyerId: 'law-008',
    lawyerName: 'David Tan',
    lawyerSpecialty: '劳动法',
    userId: 'user-006',
    userName: 'Kumar',
    rating: 4,
    title: '劳动纠纷处理得很专业',
    content: '律师既懂法律又理解商业运作，给出的建议既合法又实用。推荐给其他企业主。',
    helpful: 142,
    verified: true,
    date: '2024-01-10',
  },
  {
    id: 'rev-007',
    lawyerId: 'law-005',
    lawyerName: 'Sarah Wong',
    lawyerSpecialty: '家庭法',
    userId: 'user-007',
    userName: '陈先生',
    rating: 5,
    title: '专业且富有同理心的律师',
    content: '在处理家庭纠纷时，律师展现了极高的专业素养和同理心。帮助我们达成了双方都满意的协议。',
    helpful: 223,
    verified: true,
    date: '2024-01-09',
  },
  {
    id: 'rev-008',
    lawyerId: 'law-006',
    lawyerName: 'Raj Kumar',
    lawyerSpecialty: '房产法',
    userId: 'user-008',
    userName: 'Siti',
    rating: 5,
    title: '房产交易顺利完成',
    content: '律师对房产法非常熟悉，帮我避免了很多潜在的法律风险。整个交易过程非常顺利。',
    helpful: 178,
    verified: true,
    date: '2024-01-08',
  },
];

// 获取所有评价
export async function fetchReviews(lawyerId?: string, limit?: number): Promise<UserReview[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = mockReviews;
  
  if (lawyerId) {
    filtered = filtered.filter(r => r.lawyerId === lawyerId);
  }
  
  if (limit) {
    filtered = filtered.slice(0, limit);
  }
  
  return filtered;
}

// 获取单个评价
export async function fetchReviewById(id: string): Promise<UserReview | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockReviews.find(r => r.id === id) || null;
}

// 获取热门评价
export async function fetchTopReviews(limit: number = 6): Promise<UserReview[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockReviews]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit);
}

// 获取评价统计
export async function fetchReviewStats() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const verifiedCount = mockReviews.filter(r => r.verified).length;
  
  const ratingDistribution = {
    5: mockReviews.filter(r => r.rating === 5).length,
    4: mockReviews.filter(r => r.rating === 4).length,
    3: mockReviews.filter(r => r.rating === 3).length,
    2: mockReviews.filter(r => r.rating === 2).length,
    1: mockReviews.filter(r => r.rating === 1).length,
  };
  
  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    verifiedCount,
    ratingDistribution,
  };
}
