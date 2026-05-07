# T 组件使用指南

## 🎯 简介

T 组件是一个超级简单的翻译组件，不需要维护翻译字典，直接在使用的地方写中英文即可。

## ✅ 优点

1. **超级简单** - 不需要维护翻译字典
2. **直观** - 中英文在一起，一目了然
3. **灵活** - 可以用在任何地方
4. **独立** - 不影响现有代码
5. **零配置** - 导入即用

## 📖 基本用法

### 1. 导入组件
```typescript
import T from '@/components/super-admin/T';
```

### 2. 使用组件
```typescript
// 简单文本
<T zh="创建租户" en="Create Tenant" />

// 带样式
<T zh="用户管理" en="User Management" className="text-xl font-bold" />

// 作为标题
<T zh="系统设置" en="System Settings" as="h1" />

// 作为按钮文本
<button className="btn">
  <T zh="保存" en="Save" />
</button>
```

## 🎨 实际示例

### 示例 1：页面标题
```typescript
// 之前
<h1 className="text-3xl font-bold">租户管理</h1>

// 之后
<h1 className="text-3xl font-bold">
  <T zh="租户管理" en="Tenant Management" />
</h1>
```

### 示例 2：按钮
```typescript
// 之前
<button className="btn-primary">创建租户</button>

// 之后
<button className="btn-primary">
  <T zh="创建租户" en="Create Tenant" />
</button>
```

### 示例 3：表格表头
```typescript
// 之前
<th>用户名</th>
<th>邮箱</th>
<th>状态</th>

// 之后
<th><T zh="用户名" en="Username" /></th>
<th><T zh="邮箱" en="Email" /></th>
<th><T zh="状态" en="Status" /></th>
```

### 示例 4：表单标签
```typescript
// 之前
<label>租户名称</label>
<input type="text" />

// 之后
<label>
  <T zh="租户名称" en="Tenant Name" />
</label>
<input type="text" />
```

### 示例 5：占位符（需要用变量）
```typescript
const { language } = useLanguage();
const placeholder = language === 'zh' ? '请输入邮箱' : 'Enter email';

<input type="text" placeholder={placeholder} />

// 或者使用辅助函数
const t = (zh: string, en: string) => language === 'zh' ? zh : en;
<input type="text" placeholder={t('请输入邮箱', 'Enter email')} />
```

## 🚀 快速迁移

### 步骤 1：找到需要翻译的文本
在页面中找到所有硬编码的中文或英文文本。

### 步骤 2：包裹 T 组件
将文本用 T 组件包裹，添加中英文。

### 步骤 3：测试
切换语言，确认翻译正确。

## 📝 完整页面示例

### 租户详情页面（部分）
```typescript
import T from '@/components/super-admin/T';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TenantDetailPage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  return (
    <div>
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold">
        <T zh="租户详情" en="Tenant Details" />
      </h1>
      
      {/* 按钮 */}
      <button className="btn-primary">
        <T zh="OEM设置" en="OEM Settings" />
      </button>
      
      <button className="btn-secondary">
        <T zh="停用" en="Deactivate" />
      </button>
      
      {/* 表单 */}
      <div>
        <label>
          <T zh="租户名称" en="Tenant Name" />
        </label>
        <input 
          type="text" 
          placeholder={t('请输入租户名称', 'Enter tenant name')}
        />
      </div>
      
      {/* 表格 */}
      <table>
        <thead>
          <tr>
            <th><T zh="用户总数" en="Total Users" /></th>
            <th><T zh="状态" en="Status" /></th>
            <th><T zh="操作" en="Actions" /></th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
```

## 🎯 与现有方案对比

### 当前方案（t 函数）
```typescript
// 需要在 LanguageContext 中添加翻译键
'tenants.title': '租户管理',
'tenants.create': '创建租户',

// 使用
{t('tenants.title')}
{t('tenants.create')}
```

### T 组件方案
```typescript
// 不需要维护翻译字典，直接使用
<T zh="租户管理" en="Tenant Management" />
<T zh="创建租户" en="Create Tenant" />
```

## 💡 最佳实践

### 1. 对于已翻译的页面
保持使用 `t()` 函数，不需要改动。

### 2. 对于未翻译的页面
使用 T 组件快速添加翻译。

### 3. 对于新页面
优先使用 T 组件，更简单直观。

### 4. 混合使用
```typescript
// 主要文本用 t() 函数（已有翻译键）
<h1>{t('dashboard.title')}</h1>

// 新增文本用 T 组件
<button>
  <T zh="导出数据" en="Export Data" />
</button>
```

## 🔧 辅助函数

创建一个辅助函数用于非 JSX 场景：

```typescript
// src/lib/translate.ts
import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslate() {
  const { language } = useLanguage();
  
  return (zh: string, en: string) => {
    return language === 'zh' ? zh : en;
  };
}

// 使用
const translate = useTranslate();
const placeholder = translate('请输入邮箱', 'Enter email');
```

## 📊 迁移计划

### 阶段 1：保持现状
- ✅ 已翻译的页面保持不变
- ✅ 继续正常使用

### 阶段 2：新页面使用 T 组件
- 🔄 租户详情页
- 🔄 用户详情页
- 🔄 其他详情页

### 阶段 3：逐步迁移（可选）
- ⏳ 将旧页面逐步迁移到 T 组件
- ⏳ 或保持混合使用

## ✨ 总结

T 组件方案的优势：
1. ✅ 不需要维护翻译字典
2. ✅ 代码更直观，中英文在一起
3. ✅ 快速添加翻译
4. ✅ 不影响现有代码
5. ✅ 可以与 t() 函数混合使用

**推荐用法**：
- 主要页面：继续使用 t() 函数
- 详情页面：使用 T 组件
- 新功能：使用 T 组件

---

**立即开始使用**：
```typescript
import T from '@/components/super-admin/T';

<T zh="你的中文文本" en="Your English Text" />
```
