# 租户首页 DIY 系统 - 设计方案

## 1. 系统概述

### 目标
让每个租户能够通过可视化界面自定义他们的首页，包括：
- 页面布局和组件排列
- 品牌元素（Logo、颜色、字体）
- 内容（文本、图片、链接）
- 功能模块的启用/禁用

### 用户角色
- **Super Admin**: 管理所有租户，创建新模板和组件
- **Tenant Admin**: 定制自己租户的首页
- **End User**: 访问租户定制后的首页

---

## 2. 数据库设计

### 2.1 页面配置表 (tenant_pages)

```sql
CREATE TABLE public.tenant_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  page_type TEXT NOT NULL, -- 'home', 'about', 'contact', etc.
  is_published BOOLEAN DEFAULT false,
  layout_config JSONB NOT NULL, -- 页面布局配置
  seo_config JSONB, -- SEO 配置
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, page_type)
);

CREATE INDEX idx_tenant_pages_tenant ON public.tenant_pages(tenant_id);
CREATE INDEX idx_tenant_pages_published ON public.tenant_pages(is_published);
```

### 2.2 组件库表 (page_components)

```sql
CREATE TABLE public.page_components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  component_type TEXT NOT NULL, -- 'hero', 'features', 'cta', 'testimonials', etc.
  component_name TEXT NOT NULL,
  component_category TEXT NOT NULL, -- 'marketing', 'content', 'navigation', etc.
  default_props JSONB NOT NULL, -- 默认属性
  schema JSONB NOT NULL, -- 组件配置 schema
  preview_image TEXT, -- 预览图
  is_system BOOLEAN DEFAULT true, -- 是否系统组件
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_components_type ON public.page_components(component_type);
CREATE INDEX idx_page_components_category ON public.page_components(component_category);
```

### 2.3 租户主题配置 (tenant_themes)

```sql
CREATE TABLE public.tenant_themes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  theme_name TEXT NOT NULL DEFAULT 'default',
  colors JSONB NOT NULL, -- 颜色配置
  typography JSONB NOT NULL, -- 字体配置
  spacing JSONB, -- 间距配置
  borders JSONB, -- 边框配置
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, theme_name)
);

CREATE INDEX idx_tenant_themes_tenant ON public.tenant_themes(tenant_id);
```

---

## 3. 数据结构示例

### 3.1 Layout Config (layout_config)

```typescript
interface LayoutConfig {
  version: string; // '1.0'
  sections: Section[];
  globalSettings: {
    maxWidth: string; // 'full' | 'container' | 'narrow'
    backgroundColor: string;
    padding: string;
  };
}

interface Section {
  id: string;
  componentType: string; // 'hero', 'features', 'cta', etc.
  order: number;
  visible: boolean;
  props: Record<string, any>; // 组件特定属性
  style: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}
```

**示例数据**:

```json
{
  "version": "1.0",
  "sections": [
    {
      "id": "hero-1",
      "componentType": "hero",
      "order": 1,
      "visible": true,
      "props": {
        "title": "欢迎来到我们的法律服务平台",
        "subtitle": "专业、可靠、高效的法律咨询服务",
        "ctaText": "立即咨询",
        "ctaLink": "/consultations",
        "backgroundImage": "/images/hero-bg.jpg",
        "alignment": "center"
      },
      "style": {
        "backgroundColor": "#1e40af",
        "padding": "80px 0"
      }
    },
    {
      "id": "features-1",
      "componentType": "features",
      "order": 2,
      "visible": true,
      "props": {
        "title": "我们的服务",
        "features": [
          {
            "icon": "scale",
            "title": "专业律师",
            "description": "经验丰富的专业律师团队"
          },
          {
            "icon": "clock",
            "title": "快速响应",
            "description": "24小时内响应您的咨询"
          },
          {
            "icon": "shield",
            "title": "保密安全",
            "description": "严格保护客户隐私"
          }
        ]
      },
      "style": {
        "backgroundColor": "#ffffff",
        "padding": "60px 0"
      }
    },
    {
      "id": "cta-1",
      "componentType": "cta",
      "order": 3,
      "visible": true,
      "props": {
        "title": "准备好开始了吗？",
        "description": "立即联系我们，获取专业法律咨询",
        "primaryButton": {
          "text": "免费咨询",
          "link": "/contact"
        },
        "secondaryButton": {
          "text": "了解更多",
          "link": "/about"
        }
      },
      "style": {
        "backgroundColor": "#f97316",
        "padding": "60px 0"
      }
    }
  ],
  "globalSettings": {
    "maxWidth": "container",
    "backgroundColor": "#f9fafb",
    "padding": "0"
  }
}
```

### 3.2 Theme Config (colors, typography)

```typescript
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}
```

**示例数据**:

```json
{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "surface": "#f9fafb",
    "text": {
      "primary": "#111827",
      "secondary": "#6b7280",
      "disabled": "#9ca3af"
    },
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444",
    "info": "#3b82f6"
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  }
}
```

### 3.3 Component Schema

```typescript
interface ComponentSchema {
  type: string;
  properties: Record<string, PropertySchema>;
  required?: string[];
}

interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'image' | 'color' | 'link';
  label: string;
  description?: string;
  default?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

**Hero 组件 Schema 示例**:

```json
{
  "type": "hero",
  "properties": {
    "title": {
      "type": "string",
      "label": "标题",
      "description": "主标题文本",
      "default": "欢迎来到我们的平台"
    },
    "subtitle": {
      "type": "string",
      "label": "副标题",
      "description": "副标题文本",
      "default": ""
    },
    "ctaText": {
      "type": "string",
      "label": "按钮文本",
      "default": "开始使用"
    },
    "ctaLink": {
      "type": "link",
      "label": "按钮链接",
      "default": "/"
    },
    "backgroundImage": {
      "type": "image",
      "label": "背景图片",
      "description": "Hero 区域的背景图片"
    },
    "alignment": {
      "type": "string",
      "label": "对齐方式",
      "options": [
        { "label": "居左", "value": "left" },
        { "label": "居中", "value": "center" },
        { "label": "居右", "value": "right" }
      ],
      "default": "center"
    }
  },
  "required": ["title", "ctaText"]
}
```

---

## 4. API 设计

### 4.1 页面管理 API

**GET /api/tenant-admin/pages**
- 获取当前租户的所有页面
- Response: `{ pages: TenantPage[] }`

**GET /api/tenant-admin/pages/:pageType**
- 获取特定页面配置
- Response: `{ page: TenantPage }`

**PUT /api/tenant-admin/pages/:pageType**
- 更新页面配置
- Request: `{ layout_config: LayoutConfig, seo_config?: SEOConfig }`
- Response: `{ page: TenantPage }`

**POST /api/tenant-admin/pages/:pageType/publish**
- 发布页面
- Response: `{ page: TenantPage }`

**POST /api/tenant-admin/pages/:pageType/preview**
- 生成预览链接
- Response: `{ preview_url: string, expires_at: string }`

### 4.2 组件库 API

**GET /api/tenant-admin/components**
- 获取可用组件列表
- Query: `category`, `search`
- Response: `{ components: PageComponent[] }`

**GET /api/tenant-admin/components/:id**
- 获取组件详情和 schema
- Response: `{ component: PageComponent }`

### 4.3 主题管理 API

**GET /api/tenant-admin/theme**
- 获取当前租户主题
- Response: `{ theme: TenantTheme }`

**PUT /api/tenant-admin/theme**
- 更新主题配置
- Request: `{ colors?: ThemeColors, typography?: ThemeTypography }`
- Response: `{ theme: TenantTheme }`

**POST /api/tenant-admin/theme/reset**
- 重置为默认主题
- Response: `{ theme: TenantTheme }`

### 4.4 公开访问 API

**GET /api/public/[subdomain]/page/:pageType**
- 获取租户的公开页面配置
- Response: `{ page: TenantPage, theme: TenantTheme }`

---

## 5. 前端架构

### 5.1 Tenant Admin 页面编辑器

```
src/app/admin/pages/
├── page.tsx                    # 页面列表
├── [pageType]/
│   ├── edit/
│   │   └── page.tsx           # 页面编辑器
│   └── preview/
│       └── page.tsx           # 页面预览
└── components/
    ├── PageEditor.tsx         # 主编辑器组件
    ├── ComponentLibrary.tsx   # 组件库侧边栏
    ├── PropertyPanel.tsx      # 属性编辑面板
    ├── Canvas.tsx             # 画布区域
    └── ThemeEditor.tsx        # 主题编辑器
```

### 5.2 页面编辑器核心组件

**PageEditor.tsx**:
```typescript
'use client';

interface PageEditorProps {
  pageType: string;
  initialConfig: LayoutConfig;
  theme: TenantTheme;
}

export default function PageEditor({ pageType, initialConfig, theme }: PageEditorProps) {
  const [config, setConfig] = useState<LayoutConfig>(initialConfig);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // 添加组件
  const addSection = (componentType: string) => {
    const newSection: Section = {
      id: `${componentType}-${Date.now()}`,
      componentType,
      order: config.sections.length + 1,
      visible: true,
      props: getDefaultProps(componentType),
      style: {}
    };
    
    setConfig({
      ...config,
      sections: [...config.sections, newSection]
    });
    setIsDirty(true);
  };

  // 更新组件属性
  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setConfig({
      ...config,
      sections: config.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    });
    setIsDirty(true);
  };

  // 删除组件
  const deleteSection = (sectionId: string) => {
    setConfig({
      ...config,
      sections: config.sections.filter(s => s.id !== sectionId)
    });
    setIsDirty(true);
  };

  // 重新排序
  const reorderSections = (startIndex: number, endIndex: number) => {
    const result = Array.from(config.sections);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setConfig({
      ...config,
      sections: result.map((s, i) => ({ ...s, order: i + 1 }))
    });
    setIsDirty(true);
  };

  // 保存
  const handleSave = async () => {
    await fetch(`/api/tenant-admin/pages/${pageType}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layout_config: config })
    });
    setIsDirty(false);
  };

  // 发布
  const handlePublish = async () => {
    await handleSave();
    await fetch(`/api/tenant-admin/pages/${pageType}/publish`, {
      method: 'POST'
    });
  };

  return (
    <div className="flex h-screen">
      {/* 组件库侧边栏 */}
      <ComponentLibrary onAddComponent={addSection} />
      
      {/* 画布区域 */}
      <Canvas
        config={config}
        theme={theme}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        onReorder={reorderSections}
      />
      
      {/* 属性编辑面板 */}
      <PropertyPanel
        section={config.sections.find(s => s.id === selectedSection)}
        onUpdate={(updates) => updateSection(selectedSection!, updates)}
        onDelete={() => deleteSection(selectedSection!)}
      />
      
      {/* 顶部工具栏 */}
      <div className="fixed top-0 right-0 p-4 flex gap-2">
        <button onClick={handleSave} disabled={!isDirty}>
          保存
        </button>
        <button onClick={handlePublish}>
          发布
        </button>
      </div>
    </div>
  );
}
```

### 5.3 动态组件渲染

**DynamicComponent.tsx**:
```typescript
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Testimonials from '@/components/Testimonials';
// ... 其他组件

const componentMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  features: Features,
  cta: CTA,
  testimonials: Testimonials,
  // ... 其他组件映射
};

interface DynamicComponentProps {
  section: Section;
  theme: TenantTheme;
  isEditing?: boolean;
}

export default function DynamicComponent({ section, theme, isEditing }: DynamicComponentProps) {
  const Component = componentMap[section.componentType];
  
  if (!Component) {
    return <div>Unknown component: {section.componentType}</div>;
  }
  
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        padding: section.style.padding,
        margin: section.style.margin,
      }}
      className={isEditing ? 'border-2 border-dashed border-blue-400' : ''}
    >
      <Component {...section.props} theme={theme} />
    </div>
  );
}
```

### 5.4 公开页面渲染

**src/app/[subdomain]/page.tsx**:
```typescript
import { notFound } from 'next/navigation';
import DynamicComponent from '@/components/DynamicComponent';

export default async function TenantHomePage({ params }: { params: { subdomain: string } }) {
  // 获取租户页面配置
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/${params.subdomain}/page/home`);
  
  if (!res.ok) {
    notFound();
  }
  
  const { page, theme } = await res.json();
  
  if (!page.is_published) {
    notFound();
  }
  
  return (
    <div style={{ backgroundColor: page.layout_config.globalSettings.backgroundColor }}>
      {page.layout_config.sections
        .filter(s => s.visible)
        .sort((a, b) => a.order - b.order)
        .map(section => (
          <DynamicComponent
            key={section.id}
            section={section}
            theme={theme}
          />
        ))}
    </div>
  );
}
```

---

## 6. 预制组件库

### 6.1 核心组件

1. **Hero** - 首屏大图
2. **Features** - 功能特性展示
3. **CTA** - 行动号召
4. **Testimonials** - 客户评价
5. **TopLawyers** - 律师展示
6. **HowItWorks** - 流程说明
7. **Pricing** - 价格表
8. **FAQ** - 常见问题
9. **Contact** - 联系表单
10. **Footer** - 页脚

### 6.2 组件分类

- **Marketing**: Hero, CTA, Testimonials
- **Content**: Features, HowItWorks, FAQ
- **Commerce**: Pricing, TopLawyers
- **Navigation**: Header, Footer
- **Forms**: Contact, Newsletter

---

## 7. 实现步骤

### Phase 1: 数据库和 API (2-3 天)
1. 创建数据库表
2. 实现页面管理 API
3. 实现组件库 API
4. 实现主题管理 API

### Phase 2: 组件库 (3-4 天)
1. 重构现有组件为可配置组件
2. 定义组件 Schema
3. 创建组件预览
4. 添加默认配置

### Phase 3: 页面编辑器 (4-5 天)
1. 创建编辑器布局
2. 实现组件拖拽
3. 实现属性编辑面板
4. 实现实时预览
5. 实现保存和发布

### Phase 4: 主题编辑器 (2-3 天)
1. 创建颜色选择器
2. 创建字体配置
3. 实现主题预览
4. 实现主题应用

### Phase 5: 公开页面渲染 (2-3 天)
1. 实现动态路由
2. 实现组件渲染
3. 实现主题应用
4. 优化性能

### Phase 6: 测试和优化 (2-3 天)
1. 功能测试
2. 性能优化
3. 响应式适配
4. 浏览器兼容性

---

## 8. 技术栈

- **前端**: Next.js 13+, React, TailwindCSS
- **拖拽**: @dnd-kit/core
- **表单**: React Hook Form + Zod
- **颜色选择**: react-colorful
- **图片上传**: Supabase Storage
- **状态管理**: React Context + useState
- **数据库**: PostgreSQL (Supabase)

---

## 9. 优势

✅ **灵活性**: 租户可以完全自定义首页
✅ **易用性**: 可视化编辑，无需编码
✅ **可扩展**: 易于添加新组件
✅ **性能**: 静态渲染，快速加载
✅ **SEO**: 支持 SEO 配置
✅ **响应式**: 自动适配移动端

---

## 10. 未来扩展

- 多语言支持
- A/B 测试
- 页面模板市场
- 自定义 CSS
- 动画效果
- 表单构建器
- 数据分析集成
