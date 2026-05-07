// Malaysia Legal Templates API
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

// Generate mock templates
function generateTemplates(): LegalTemplate[] {
  const templates: LegalTemplate[] = [];
  
  // Employment templates
  const employmentTemplates = [
    { title: 'Employment Contract (Malaysia)', desc: 'Standard employment contract compliant with Malaysian Employment Act 1955' },
    { title: 'Part-Time Employment Agreement', desc: 'Part-time work agreement with flexible hours' },
    { title: 'Fixed-Term Contract', desc: 'Fixed-term employment contract template' },
  ];
  
  employmentTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `emp-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: t.title,
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
  
  // Property templates
  const propertyTemplates = [
    { title: 'Sale and Purchase Agreement (SPA)', desc: 'Property sale agreement for residential and commercial properties' },
    { title: 'Property Transfer Agreement', desc: 'Property ownership transfer document' },
    { title: 'Land Purchase Agreement', desc: 'Land acquisition contract' },
  ];
  
  propertyTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `prop-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: t.title,
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
  
  // Business templates
  const businessTemplates = [
    { title: 'Service Agreement', desc: 'Professional service contract' },
    { title: 'Supplier Agreement', desc: 'Supplier terms and conditions' },
    { title: 'Distribution Agreement', desc: 'Product distribution contract' },
  ];
  
  businessTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `bus-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: t.title,
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
  
  // Tenancy templates
  const tenancyTemplates = [
    { title: 'Tenancy Agreement (Residential)', desc: 'Residential tenancy contract' },
    { title: 'Commercial Lease Agreement', desc: 'Commercial property lease' },
  ];
  
  tenancyTemplates.forEach((t, i) => {
    ['en', 'ms', 'zh'].forEach((lang, j) => {
      templates.push({
        id: `ten-${String(i * 3 + j + 1).padStart(3, '0')}`,
        title: t.title,
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
  
  return templates;
}

// Generate all templates
const mockTemplates = generateTemplates();

// Malaysia Legal Template Categories
export const templateCategories: TemplateCategory[] = [
  { id: 'employment', name: 'Employment Contracts', nameMs: 'Kontrak Pekerjaan', nameCn: 'Employment', count: mockTemplates.filter(t => t.category === 'employment').length, icon: '👔' },
  { id: 'property', name: 'Property Agreements', nameMs: 'Perjanjian Hartanah', nameCn: 'Property', count: mockTemplates.filter(t => t.category === 'property').length, icon: '🏠' },
  { id: 'business', name: 'Business Contracts', nameMs: 'Kontrak Perniagaan', nameCn: 'Business', count: mockTemplates.filter(t => t.category === 'business').length, icon: '💼' },
  { id: 'tenancy', name: 'Tenancy Agreements', nameMs: 'Perjanjian Sewa', nameCn: 'Tenancy', count: mockTemplates.filter(t => t.category === 'tenancy').length, icon: '🔑' },
];

// Fetch all templates
export async function fetchLegalTemplates(category?: string, language?: string): Promise<LegalTemplate[]> {
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

// Fetch single template details
export async function fetchTemplateById(id: string): Promise<LegalTemplate | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTemplates.find(t => t.id === id) || null;
}

// Search templates
export async function searchTemplates(query: string): Promise<LegalTemplate[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowerQuery = query.toLowerCase();
  return mockTemplates.filter(t => 
    t.title.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery)
  );
}

// Download template (mock download)
export async function downloadTemplate(id: string): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const template = mockTemplates.find(t => t.id === id);
  
  if (!template) {
    return {
      success: false,
      message: 'Template not found'
    };
  }
  
  // Mock download URL
  const downloadUrl = `https://example.com/templates/${id}.pdf`;
  
  return {
    success: true,
    message: 'Download successful',
    downloadUrl
  };
}
