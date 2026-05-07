/**
 * 输入验证和清理工具
 * 防止 XSS 和注入攻击
 */

/**
 * 清理 HTML 特殊字符，防止 XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * 验证电话号码（国际格式）
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  
  // 支持 +60 3-1234 5678 或 +60312345678 格式
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * 验证密码强度
 * 至少8位，包含大小写字母和数字
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    return { valid: false, errors: ['密码不能为空'] };
  }

  if (password.length < 8) {
    errors.push('密码至少需要8个字符');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码需要包含小写字母');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码需要包含大写字母');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密码需要包含数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码需要包含特殊字符');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证 URL
 */
export function validateURL(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 清理文件名，防止路径遍历攻击
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 只保留安全字符
    .replace(/\.{2,}/g, '.') // 防止 ../ 攻击
    .substring(0, 255); // 限制长度
}

/**
 * 验证数字范围
 */
export function validateNumber(
  value: number,
  min?: number,
  max?: number
): boolean {
  if (typeof value !== 'number' || isNaN(value)) return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

/**
 * 验证字符串长度
 */
export function validateLength(
  str: string,
  min?: number,
  max?: number
): boolean {
  if (!str) return false;
  const length = str.length;
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  return true;
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 */
export function validateDate(dateStr: string): boolean {
  if (!dateStr) return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 验证马来西亚身份证号 (NRIC)
 */
export function validateNRIC(nric: string): boolean {
  if (!nric) return false;
  
  // 格式: YYMMDD-PB-###G
  const nricRegex = /^\d{6}-\d{2}-\d{4}$/;
  return nricRegex.test(nric);
}

/**
 * 清理 SQL 特殊字符（额外保护）
 * 注意：Supabase 已经有防护，这是额外的一层
 */
export function sanitizeSQL(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/['";\\]/g, '') // 移除 SQL 特殊字符
    .trim();
}

/**
 * 验证对象的所有字段
 */
export function validateObject<T extends Record<string, any>>(
  obj: T,
  rules: Partial<Record<keyof T, (value: any) => boolean>>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [key, validator] of Object.entries(rules)) {
    if (validator && !validator(obj[key])) {
      errors[key] = `${key} 验证失败`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
