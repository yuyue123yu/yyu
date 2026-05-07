# 租户自助 DIY 系统 - 设计方案

## 🎯 目标
让租户管理员可以自主配置品牌、价格、功能，无需超级管理员介入。

---

## 🎨 租户可自主配置的功能

### 1. **品牌设置** (Branding)
- ✅ 上传 Logo（支持预览）
- ✅ 设置主题颜色（主色、辅色）
- ✅ 设置公司名称
- ✅ 设置公司简介
- ✅ 设置联系方式（电话、邮箱、地址）
- ✅ 设置社交媒体链接

### 2. **域名配置** (Domain)
- ✅ 配置自定义域名
- ✅ 查看子域名（系统自动分配）
- ⚠️ 自定义域名需要 DNS 验证（提供教程）

### 3. **价格配置** (Pricing)
- ✅ 设置咨询服务价格
- ✅ 设置文档服务价格
- ✅ 设置会员套餐价格
- ✅ 设置折扣和优惠
- ✅ 启用/禁用特定服务

### 4. **功能开关** (Features)
- ✅ 启用/禁用咨询功能
- ✅ 启用/禁用律师展示
- ✅ 启用/禁用文章功能
- ✅ 启用/禁用在线支付
- ✅ 启用/禁用会员系统

### 5. **内容管理** (Content)
- ✅ 编辑首页横幅文案
- ✅ 编辑服务介绍
- ✅ 编辑关于我们
- ✅ 编辑常见问题 FAQ
- ✅ 自定义页脚内容

### 6. **SEO 设置** (SEO)
- ✅ 设置网站标题
- ✅ 设置网站描述
- ✅ 设置关键词
- ✅ 上传 Favicon

### 7. **通知设置** (Notifications)
- ✅ 配置邮件通知
- ✅ 配置短信通知
- ✅ 设置通知接收人

---

## 📊 数据库结构设计

### tenant_settings 表结构（已存在，需要扩展）

```sql
-- 扩展 tenant_settings 表，支持更多配置
-- key 的类型：
-- 1. branding - 品牌设置
-- 2. domain - 域名配置
-- 3. pricing - 价格配置
-- 4. features - 功能开关
-- 5. content - 内容配置
-- 6. seo - SEO 设置
-- 7. notifications - 通知设置

-- 示例数据结构
{
  "branding": {
    "logo_url": "https://storage.supabase.co/...",
    "primary_color": "#1E40AF",
    "secondary_color": "#F59E0B",
    "company_name": "ABC律师事务所",
    "company_description": "专业法律服务提供商",
    "contact_phone": "+60 3-1234 5678",
    "contact_email": "info@abc-law.com",
    "contact_address": "吉隆坡市中心",
    "social_links": {
      "facebook": "https://facebook.com/abc-law",
      "twitter": "https://twitter.com/abc-law",
      "linkedin": "https://linkedin.com/company/abc-law"
    }
  },
  "domain": {
    "custom_domain": "abc-law.com",
    "subdomain": "abc-law.legalmy.com",
    "domain_verified": false,
    "verification_code": "abc123xyz"
  },
  "pricing": {
    "consultation": {
      "basic": 200,
      "standard": 500,
      "premium": 1000,
      "currency": "MYR"
    },
    "documents": {
      "contract_review": 300,
      "legal_letter": 150,
      "agreement_draft": 500
    },
    "membership": {
      "monthly": 99,
      "yearly": 999,
      "enabled": true
    },
    "discounts": {
      "first_time": 10,
      "referral": 15
    }
  },
  "features": {
    "consultations": true,
    "lawyers": true,
    "articles": true,
    "online_payment": true,
    "membership": false,
    "live_chat": true,
    "appointment_booking": true
  },
  "content": {
    "hero_title": "专业法律咨询服务",
    "hero_subtitle": "为您提供最优质的法律解决方案",
    "about_us": "我们是一家专业的律师事务所...",
    "services_intro": "我们提供全方位的法律服务...",
    "faq": [
      {
        "question": "如何预约咨询？",
        "answer": "您可以通过网站在线预约..."
      }
    ],
    "footer_text": "© 2026 ABC律师事务所 版权所有"
  },
  "seo": {
    "title": "ABC律师事务所 - 专业法律服务",
    "description": "提供专业的法律咨询和服务",
    "keywords": "律师,法律咨询,法律服务",
    "favicon_url": "https://storage.supabase.co/..."
  },
  "notifications": {
    "email_enabled": true,
    "sms_enabled": false,
    "notification_emails": ["admin@abc-law.com"],
    "new_consultation": true,
    "new_order": true,
    "payment_received": true
  }
}
```

---

## 🎨 租户管理后台 - DIY 设置页面

### 页面结构

```
/admin/branding - 品牌设置
├── Logo 上传
├── 颜色选择器
├── 公司信息表单
└── 实时预览

/admin/domain - 域名配置
├── 自定义域名设置
├── DNS 配置教程
└── 域名验证状态

/admin/pricing - 价格配置
├── 服务价格设置
├── 会员套餐配置
└── 折扣管理

/admin/features - 功能开关
├── 功能模块开关
└── 功能说明

/admin/content - 内容管理
├── 首页内容编辑
├── 关于我们编辑
└── FAQ 管理

/admin/seo - SEO 设置
├── 元标签设置
└── Favicon 上传

/admin/notifications - 通知设置
├── 邮件通知配置
└── 短信通知配置
```

---

## 🔧 技术实现

### 1. API 路由

```typescript
// /api/tenant/settings/[key]/route.ts
// GET - 获取配置
// PUT - 更新配置

// 示例：
GET  /api/tenant/settings/branding
PUT  /api/tenant/settings/branding
POST /api/tenant/settings/logo-upload
```

### 2. 文件上传

```typescript
// 使用 Supabase Storage
// Bucket: tenant-assets
// 路径: {tenant_id}/logo.png
//      {tenant_id}/favicon.ico
//      {tenant_id}/images/*
```

### 3. 实时预览

```typescript
// 使用 React Context 提供租户配置
// 前台页面自动读取并应用配置

const TenantConfigContext = createContext();

// 在 Layout 中加载配置
const config = await getTenantConfig(tenantId);

// 应用到全局样式
<style>
  :root {
    --primary-color: {config.branding.primary_color};
    --secondary-color: {config.branding.secondary_color};
  }
</style>
```

---

## 🎯 权限控制

### 租户管理员权限

```typescript
// 只能修改自己租户的配置
const { data: profile } = await supabase
  .from('profiles')
  .select('tenant_id, role')
  .eq('id', userId)
  .single();

// 必须是 owner 或 admin 角色
if (profile.role !== 'owner' && profile.role !== 'admin') {
  return { error: '权限不足' };
}

// 只能修改自己租户的设置
const { data, error } = await supabase
  .from('tenant_settings')
  .update({ value: newConfig })
  .eq('tenant_id', profile.tenant_id)
  .eq('key', settingKey);
```

### 超级管理员权限

```typescript
// 超级管理员可以：
// 1. 查看所有租户的配置
// 2. 修改任何租户的配置
// 3. 设置租户的权限限制（哪些功能可以自己配置）
```

---

## 📋 实施步骤

### Phase 1: 品牌设置（最重要）
1. ✅ 创建品牌设置页面
2. ✅ Logo 上传功能
3. ✅ 颜色选择器
4. ✅ 实时预览
5. ✅ 保存到数据库
6. ✅ 前台自动应用

### Phase 2: 价格配置
1. ✅ 创建价格配置页面
2. ✅ 服务价格表单
3. ✅ 会员套餐配置
4. ✅ 前台价格显示

### Phase 3: 功能开关
1. ✅ 创建功能开关页面
2. ✅ 开关组件
3. ✅ 前台根据开关显示/隐藏功能

### Phase 4: 内容管理
1. ✅ 创建内容编辑页面
2. ✅ 富文本编辑器
3. ✅ FAQ 管理
4. ✅ 前台内容显示

### Phase 5: 域名配置
1. ✅ 域名设置页面
2. ✅ DNS 验证逻辑
3. ✅ 域名解析教程

### Phase 6: SEO 和通知
1. ✅ SEO 设置页面
2. ✅ 通知配置页面

---

## 🎨 UI 设计建议

### 品牌设置页面示例

```
┌─────────────────────────────────────────────────────┐
│  品牌设置                                    [保存]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Logo 设置                                          │
│  ┌─────────────┐                                   │
│  │             │  [上传 Logo]                       │
│  │   预览区    │  支持 PNG, JPG, SVG               │
│  │             │  建议尺寸: 200x60px               │
│  └─────────────┘                                   │
│                                                     │
│  主题颜色                                           │
│  主色调: [#1E40AF] 🎨                              │
│  辅色调: [#F59E0B] 🎨                              │
│                                                     │
│  公司信息                                           │
│  公司名称: [ABC律师事务所]                          │
│  公司简介: [专业法律服务提供商]                     │
│  联系电话: [+60 3-1234 5678]                       │
│  联系邮箱: [info@abc-law.com]                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  实时预览                                    │  │
│  │  ┌─────────────────────────────────────┐   │  │
│  │  │  [Logo]  ABC律师事务所              │   │  │
│  │  │  专业法律服务提供商                  │   │  │
│  │  └─────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔒 安全考虑

### 1. 文件上传安全
- ✅ 限制文件类型（只允许图片）
- ✅ 限制文件大小（最大 5MB）
- ✅ 文件名随机化
- ✅ 病毒扫描（可选）

### 2. 配置验证
- ✅ 颜色格式验证（HEX）
- ✅ URL 格式验证
- ✅ 价格范围验证
- ✅ 必填字段验证

### 3. 权限验证
- ✅ 只能修改自己租户的配置
- ✅ 必须是 owner 或 admin 角色
- ✅ 记录所有配置修改（审计日志）

---

## 📊 超级管理员的控制

### 超级管理员可以设置租户的权限

```sql
-- 在 tenants 表中添加权限配置
ALTER TABLE tenants ADD COLUMN permissions JSONB DEFAULT '{
  "can_change_branding": true,
  "can_change_domain": true,
  "can_change_pricing": true,
  "can_change_features": true,
  "can_upload_logo": true,
  "max_logo_size_mb": 5,
  "max_storage_gb": 10
}'::jsonb;
```

### 租户配置时检查权限

```typescript
// 检查租户是否有权限修改某项配置
const { data: tenant } = await supabase
  .from('tenants')
  .select('permissions')
  .eq('id', tenantId)
  .single();

if (!tenant.permissions.can_change_branding) {
  return { error: '您的套餐不支持修改品牌设置，请联系客服升级' };
}
```

---

## 💰 商业模式建议

### 套餐分级

**基础版**（免费或低价）
- ❌ 不能修改 Logo
- ✅ 可以修改颜色
- ❌ 不能自定义域名
- ✅ 基础功能

**专业版**
- ✅ 可以上传 Logo
- ✅ 完全自定义颜色
- ✅ 自定义子域名
- ✅ 所有功能

**企业版**
- ✅ 所有专业版功能
- ✅ 自定义域名
- ✅ 去除平台品牌
- ✅ 优先技术支持

---

## 🎯 总结

通过这个自助 DIY 系统，租户可以：

1. ✅ **自主管理品牌** - 上传 Logo、设置颜色、修改公司信息
2. ✅ **配置价格** - 自己设置服务价格和套餐
3. ✅ **控制功能** - 开启/关闭需要的功能模块
4. ✅ **管理内容** - 编辑首页文案和介绍
5. ✅ **配置域名** - 设置自定义域名（需验证）
6. ✅ **SEO 优化** - 自己设置 SEO 信息

**你的工作量大大减少**：
- ❌ 不需要每次帮租户改 Logo
- ❌ 不需要手动修改价格
- ❌ 不需要帮忙开关功能
- ✅ 只需要审核域名验证
- ✅ 只需要处理技术问题

---

**下一步**：我可以帮你开发这个自助 DIY 系统，从品牌设置页面开始？
