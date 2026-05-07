'use client';

import { usePasswordStrength } from '@/hooks/usePasswordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

export default function PasswordStrengthIndicator({ 
  password, 
  showFeedback = true 
}: PasswordStrengthIndicatorProps) {
  const { score, strength, checks, feedback } = usePasswordStrength(password);

  if (!password) return null;

  const getStrengthColor = () => {
    switch (strength) {
      case 'very-strong':
        return 'bg-green-500';
      case 'strong':
        return 'bg-blue-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'very-strong':
        return '非常强';
      case 'strong':
        return '强';
      case 'medium':
        return '中等';
      case 'weak':
        return '弱';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      {/* 强度条 */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-[60px]">
          {getStrengthText()}
        </span>
      </div>

      {/* 检查项 */}
      {showFeedback && (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <span className={checks.length ? 'text-green-600' : 'text-gray-400'}>
              {checks.length ? '✓' : '○'} 至少 8 个字符
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className={checks.uppercase ? 'text-green-600' : 'text-gray-400'}>
              {checks.uppercase ? '✓' : '○'} 包含大写字母
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className={checks.lowercase ? 'text-green-600' : 'text-gray-400'}>
              {checks.lowercase ? '✓' : '○'} 包含小写字母
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className={checks.number ? 'text-green-600' : 'text-gray-400'}>
              {checks.number ? '✓' : '○'} 包含数字
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className={checks.special ? 'text-green-600' : 'text-gray-400'}>
              {checks.special ? '✓' : '○'} 包含特殊字符（推荐）
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
