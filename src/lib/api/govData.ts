// 马来西亚政府开放数据API
// 基于 https://developer.data.gov.my/

const API_BASE_URL = 'https://api.data.gov.my';

export interface LegalAidService {
  date: string;
  state: string;
  main_category: string;
  sub_category: string;
  total: number;
}

export interface LegalStatistics {
  totalServices: number;
  byState: { state: string; count: number }[];
  byCategory: { category: string; count: number }[];
  trend: { month: string; count: number }[];
}

// 获取法律援助服务数据
export async function fetchLegalAidServices(): Promise<LegalAidService[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/data-catalogue?id=legal_advisory_services&limit=100`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch legal aid data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching legal aid services:', error);
    // 返回模拟数据作为后备
    return getMockLegalAidData();
  }
}

// 获取法律服务统计
export async function fetchLegalStatistics(): Promise<LegalStatistics> {
  try {
    const services = await fetchLegalAidServices();
    
    // 按州统计
    const byState = services.reduce((acc, service) => {
      const existing = acc.find(item => item.state === service.state);
      if (existing) {
        existing.count += service.total;
      } else {
        acc.push({ state: service.state, count: service.total });
      }
      return acc;
    }, [] as { state: string; count: number }[]);
    
    // 按类别统计
    const byCategory = services.reduce((acc, service) => {
      const existing = acc.find(item => item.category === service.main_category);
      if (existing) {
        existing.count += service.total;
      } else {
        acc.push({ category: service.main_category, count: service.total });
      }
      return acc;
    }, [] as { category: string; count: number }[]);
    
    // 按月份趋势
    const trend = services.reduce((acc, service) => {
      const month = service.date.substring(0, 7); // YYYY-MM
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.count += service.total;
      } else {
        acc.push({ month, count: service.total });
      }
      return acc;
    }, [] as { month: string; count: number }[]);
    
    return {
      totalServices: services.reduce((sum, s) => sum + s.total, 0),
      byState: byState.sort((a, b) => b.count - a.count).slice(0, 10),
      byCategory: byCategory.sort((a, b) => b.count - a.count),
      trend: trend.sort((a, b) => a.month.localeCompare(b.month)).slice(-12),
    };
  } catch (error) {
    console.error('Error fetching legal statistics:', error);
    return getMockStatistics();
  }
}

// 模拟数据（当API不可用时使用）
function getMockLegalAidData(): LegalAidService[] {
  return [
    { date: '2024-01', state: 'Kuala Lumpur', main_category: 'Family Law', sub_category: 'Divorce', total: 234 },
    { date: '2024-01', state: 'Selangor', main_category: 'Property Law', sub_category: 'Tenancy', total: 189 },
    { date: '2024-01', state: 'Penang', main_category: 'Employment Law', sub_category: 'Wrongful Dismissal', total: 156 },
    { date: '2024-01', state: 'Johor', main_category: 'Business Law', sub_category: 'Contract Dispute', total: 142 },
    { date: '2024-01', state: 'Perak', main_category: 'Criminal Law', sub_category: 'Defense', total: 98 },
  ];
}

function getMockStatistics(): LegalStatistics {
  return {
    totalServices: 12450,
    byState: [
      { state: 'Kuala Lumpur', count: 3240 },
      { state: 'Selangor', count: 2890 },
      { state: 'Penang', count: 1670 },
      { state: 'Johor', count: 1450 },
      { state: 'Perak', count: 980 },
    ],
    byCategory: [
      { category: 'Family Law', count: 4560 },
      { category: 'Property Law', count: 3120 },
      { category: 'Employment Law', count: 2340 },
      { category: 'Business Law', count: 1890 },
      { category: 'Criminal Law', count: 540 },
    ],
    trend: [
      { month: '2023-02', count: 890 },
      { month: '2023-03', count: 920 },
      { month: '2023-04', count: 1050 },
      { month: '2023-05', count: 1120 },
      { month: '2023-06', count: 1080 },
      { month: '2023-07', count: 1150 },
      { month: '2023-08', count: 1200 },
      { month: '2023-09', count: 1180 },
      { month: '2023-10', count: 1250 },
      { month: '2023-11', count: 1300 },
      { month: '2023-12', count: 1280 },
      { month: '2024-01', count: 1340 },
    ],
  };
}
