"use client";

import { Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DownloadPDFButtonProps {
  articleTitle: string;
  articleContent: string;
}

export default function DownloadPDFButton({ articleTitle, articleContent }: DownloadPDFButtonProps) {
  const { t } = useLanguage();

  const handleDownload = () => {
    // 创建一个简单的文本内容
    const content = `
${articleTitle}

${articleContent}

---
Downloaded from LegalMY
Professional Legal Services Platform
    `.trim();

    // 创建 Blob
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${articleTitle.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_')}.txt`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // 显示成功提示
    alert(t('pages.downloadSuccess') || '下载成功！');
  };

  return (
    <div className="bg-primary-50 rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            {t('pages.downloadPDFVersion') || '下载PDF版本'}
          </h3>
          <p className="text-sm text-neutral-600">
            {t('pages.saveForOffline') || '保存此文章以供离线阅读'}
          </p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
        >
          <Download className="h-5 w-5" />
          {t('pages.downloadPDF') || '下载PDF'}
        </button>
      </div>
    </div>
  );
}
