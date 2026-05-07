// Malaysia Government Open Data API
// Based on https://developer.data.gov.my/

export interface LegalStatistics {
  totalLawyers: number;
  totalCases: number;
  totalTemplates: number;
  totalServices: number;
  satisfactionRate: number;
}

// Mock statistics data
const mockStatistics: LegalStatistics = {
  totalLawyers: 15234,
  totalCases: 45678,
  totalTemplates: 892,
  totalServices: 12500,
  satisfactionRate: 96.5,
};

// Fetch legal statistics
export async function fetchLegalStatistics(): Promise<LegalStatistics> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStatistics;
}
