# 🔧 系统设置功能实现指南

## 问题说明

您在系统设置页面修改了网站名称，但前端没有更新。这是因为设置只保存在前端状态中，没有连接到数据库。

## 解决方案

我已经修改了代码，现在需要在 Supabase 创建 settings 表。

---

## 步骤 1：创建 Settings 表

1. 访问 Supabase SQL Editor：
   https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new

2. 复制以下 SQL 并执行：

```sql
-- 创建系统设置表
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- 启用 RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取设置
CREATE POLICY "Settings are viewable by everyone"
  ON public.settings FOR SELECT
  USING (true);

-- 只允许管理员更新设置
CREATE POLICY "Only admins can update settings"
  ON public.settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- 只允许管理员插入设置
CREATE POLICY "Only admins can insert settings"
  ON public.settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- 插入默认设置
INSERT INTO public.settings (key, value) VALUES
  ('site', '{"siteName": "LegalMY", "siteDescription": "专业法律咨询平台", "contactEmail": "support@legalmy.com", "contactPhone": "+60 3-1234 5678", "defaultLanguage": "zh"}'::jsonb),
  ('email', '{"emailNotifications": true, "emailNewConsultation": true, "emailNewOrder": true}'::jsonb),
  ('notification', '{"pushNotifications": true, "smsNotifications": false}'::jsonb),
  ('security', '{"requireEmailVerification": false, "twoFactorAuth": false, "sessionTimeout": 30}'::jsonb),
  ('system', '{"maintenanceMode": false, "allowRegistration": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
```

3. 点击 "Run" 执行 SQL

---

## 步骤 2：测试功能

1. 刷新浏览器
2. 进入系统设置页面：http://localhost:3000/admin/settings
3. 修改网站名称
4. 点击"保存设置"
5. 刷新页面，检查设置是否保存

---

## 功能说明

### 已实现功能

✅ **从数据库加载设置**
- 页面加载时自动从数据库读取设置
- 显示加载状态

✅ **保存设置到数据库**
- 点击"保存设置"按钮保存到数据库
- 使用 upsert 操作（存在则更新，不存在则插入）
- 显示保存成功提示

✅ **设置分类存储**
- site - 网站设置
- email - 邮件设置
- notification - 通知设置
- security - 安全设置
- system - 系统设置

### 数据结构

```typescript
settings 表结构：
{
  id: UUID,
  key: string,        // 设置类别（site, email, notification, security, system）
  value: JSONB,       // 设置值（JSON格式）
  updated_at: timestamp,
  updated_by: UUID    // 更新者ID
}
```

### 权限控制

- **读取**：所有人都可以读取设置
- **更新/插入**：只有管理员可以修改设置

---

## 下一步：在前端显示网站名称

如果您想在前端页面（如Header）显示动态的网站名称，需要：

### 方法 1：创建全局Context

```typescript
// src/contexts/SettingsContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const SettingsContext = createContext({
  siteName: "LegalMY",
  siteDescription: "",
  // ... 其他设置
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    siteName: "LegalMY",
    // ...
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "site")
      .single();
    
    if (data) {
      setSettings(data.value);
    }
  };

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
```

### 方法 2：直接在组件中读取

```typescript
// 在任何组件中
const [siteName, setSiteName] = useState("LegalMY");

useEffect(() => {
  const loadSiteName = async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "site")
      .single();
    
    if (data) {
      setSiteName(data.value.siteName);
    }
  };
  
  loadSiteName();
}, []);
```

---

## 故障排除

### 问题 1：保存失败 "permission denied"

**原因**：测试用户不是管理员

**解决方案**：
```sql
-- 将测试用户设置为管理员
UPDATE profiles 
SET user_type = 'admin' 
WHERE email = 'test@example.com';
```

### 问题 2：设置没有加载

**原因**：settings 表为空

**解决方案**：
- 确认已执行插入默认设置的 SQL
- 或手动在 Supabase Dashboard 中添加数据

### 问题 3：刷新后设置丢失

**原因**：前端缓存问题

**解决方案**：
- 清除浏览器缓存
- 硬刷新（Ctrl + Shift + R）

---

## 总结

✅ **已完成：**
1. 创建 settings 表结构
2. 修改系统设置页面连接数据库
3. 实现加载和保存功能
4. 添加权限控制

⏳ **待完成：**
1. 在 Supabase 执行 SQL 创建表
2. 测试保存和加载功能
3. （可选）在前端页面显示动态网站名称

---

现在请执行步骤1创建表，然后测试功能！🚀
