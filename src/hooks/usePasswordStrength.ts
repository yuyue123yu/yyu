import { useMemo } from 'react';

export interface PasswordStrength {
  score: number; // 0-5
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  feedback: string[];
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
    if (score === 5) {
      strength = 'very-strong';
    } else if (score >= 4) {
      strength = 'strong';
    } else if (score >= 3) {
      strength = 'medium';
    }

    const feedback: string[] = [];
    if (!checks.length) feedback.push('至少需要 8 个字符');
    if (!checks.uppercase) feedback.push('需要包含大写字母');
    if (!checks.lowercase) feedback.push('需要包含小写字母');
    if (!checks.number) feedback.push('需要包含数字');
    if (!checks.special) feedback.push('建议包含特殊字符');

    return {
      score,
      strength,
      checks,
      feedback,
    };
  }, [password]);
}
