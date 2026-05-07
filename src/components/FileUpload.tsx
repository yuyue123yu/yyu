"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  fileSize: string;
  uploading: boolean;
  uploadProgress: number;
  disabled?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  fileSize,
  uploading,
  uploadProgress,
  disabled = false,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* 文件选择按钮 */}
      <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <Upload className="h-5 w-5 text-neutral-600" />
        <span className="text-sm font-medium text-neutral-700">
          {selectedFile ? selectedFile.name : '点击选择文件'}
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </label>

      {/* 已选文件信息 */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <FileText className="h-4 w-4" />
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-green-600">({fileSize})</span>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="text-red-600 hover:text-red-700"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 上传进度 */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">上传中...</span>
            <span className="text-primary-600 font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <p className="text-xs text-neutral-500">
        支持格式：PDF、Word (.doc, .docx)、Excel (.xls, .xlsx)，最大 10MB
      </p>
    </div>
  );
}
