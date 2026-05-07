# 🧹 部署前代码清理

## 需要清理的内容

### 1. 移除调试日志

#### 文件：`src/components/layout/Header.tsx`
移除这些行：
```typescript
// 调试日志
console.log('🔍 Header - settings:', settings);
console.log('🔍 Header - loading:', loading);
```

#### 文件：`src/contexts/SiteSettingsContext.tsx`
检查并移除：
```typescript
console.log("✅ 网站设置已加载:", newSettings);
console.error("❌ 加载网站设置失败:", error);
console.error("❌ 加载网站设置异常:", error);
```

**建议：** 保留错误日志，只移除调试日志

### 2. 移除测试文件

可以删除以下测试文件（可选）：
- `test-settings-sync.html`
- `check-settings-table.js`
- `test-database-connection.js`

### 3. 清理文档文件

可以移动到 `docs/` 文件夹：
- `部署上线指南.md`
- `deploy-checklist.md`
- `网站设置同步说明.md`
- `网站设置同步测试指南.md`
- 其他 `.md` 文档

### 4. 检查环境变量

确保 `.gitignore` 包含：
```
.env
.env.local
.env.production
.env.development
node_modules/
.next/
```

### 5. 优化图片

检查 `public/` 目录下的图片：
- 压缩大图片
- 转换为 WebP 格式
- 移除未使用的图片

---

## 快速清理命令

### 创建文档目录
```bash
mkdir -p docs
```

### 移动文档文件
```bash
mv *.md docs/ 2>/dev/null || true
mv 部署上线指南.md docs/
mv deploy-checklist.md docs/
mv pre-deploy-cleanup.md docs/
```

### 删除测试文件
```bash
rm -f test-settings-sync.html
rm -f check-settings-table.js
rm -f test-database-connection.js
```

### 清理 node_modules
```bash
rm -rf node_modules
npm install
```

---

## 手动清理步骤

### 1. 移除 Header 调试日志

打开 `src/components/layout/Header.tsx`，删除：
```typescript
  // 调试日志
  console.log('🔍 Header - settings:', settings);
  console.log('🔍 Header - loading:', loading);
```

### 2. 优化 SiteSettingsContext 日志

打开 `src/contexts/SiteSettingsContext.tsx`，修改：

**从：**
```typescript
console.log("✅ 网站设置已加载:", newSettings);
```

**改为：**
```typescript
// 生产环境不输出日志
if (process.env.NODE_ENV === 'development') {
  console.log("✅ 网站设置已加载:", newSettings);
}
```

### 3. 检查其他 console.log

搜索项目中的所有 console.log：
```bash
grep -r "console.log" src/
```

决定保留或删除每一个。

---

## 生产环境日志策略

### 保留的日志
✅ 错误日志（console.error）
✅ 警告日志（console.warn）
✅ 关键操作日志

### 移除的日志
❌ 调试日志（console.log）
❌ 开发测试日志
❌ 详细的数据输出

### 推荐做法

创建日志工具函数：

```typescript
// src/lib/logger.ts
export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
  warn: (...args: any[]) => {
    console.warn(...args);
  },
};
```

使用：
```typescript
import { logger } from '@/lib/logger';

logger.debug('调试信息'); // 只在开发环境输出
logger.error('错误信息'); // 总是输出
```

---

## 清理完成检查

- [ ] 所有调试日志已移除或条件化
- [ ] 测试文件已删除或移动
- [ ] 文档文件已整理
- [ ] .gitignore 已更新
- [ ] 图片已优化
- [ ] 代码已格式化
- [ ] 依赖已更新

---

## 提交清理后的代码

```bash
git add .
git commit -m "chore: Clean up code for production deployment"
git push
```

---

完成清理后，继续查看 `deploy-checklist.md` 进行部署！
