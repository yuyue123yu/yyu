/**
 * 品牌配置文件
 * 在这里统一管理网站的品牌信息
 */

export const BRAND_CONFIG = {
  // 品牌名称
  name: 'LegalMY',
  
  // 公司全称
  companyName: 'LegalMY Sdn Bhd',
  
  // 公司注册号
  registrationNumber: '202401234567',
  
  // 联系信息
  contact: {
    email: {
      info: 'info@legalmy.com',
      support: 'support@legalmy.com',
      legal: 'legal@legalmy.com',
      privacy: 'privacy@legalmy.com',
      careers: 'careers@legalmy.com',
      feedback: 'feedback@legalmy.com',
      noreply: 'noreply@legalmy.com',
    },
    phone: '+60 3-1234 5678',
    address: 'Level 10, Menara LegalMY, Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
  },
  
  // 网站描述
  description: {
    zh: '专业法律咨询平台',
    en: 'Professional Legal Services Platform',
    ms: 'Platform Perkhidmatan Undang-undang Profesional',
  },
  
  // 标语
  tagline: {
    zh: '您身边的法律专家',
    en: 'Your Legal Expert',
    ms: 'Pakar Undang-undang Anda',
  },
};

// 导出便捷访问函数
export const getBrandName = () => BRAND_CONFIG.name;
export const getCompanyName = () => BRAND_CONFIG.companyName;
export const getContactEmail = (type: keyof typeof BRAND_CONFIG.contact.email = 'info') => 
  BRAND_CONFIG.contact.email[type];
export const getContactPhone = () => BRAND_CONFIG.contact.phone;
export const getContactAddress = () => BRAND_CONFIG.contact.address;
export const getBrandDescription = (lang: 'zh' | 'en' | 'ms' = 'zh') => 
  BRAND_CONFIG.description[lang];
