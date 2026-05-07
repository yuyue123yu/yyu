'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface TProps {
  zh: string;
  en: string;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'button';
}

/**
 * 简单的翻译组件
 * 使用方式：<T zh="中文文本" en="English Text" />
 */
export default function T({ zh, en, className, as = 'span' }: TProps) {
  const { language } = useLanguage();
  const text = language === 'zh' ? zh : en;
  
  const Component = as;
  
  return <Component className={className}>{text}</Component>;
}
