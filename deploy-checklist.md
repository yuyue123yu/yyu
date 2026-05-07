# 🚀 快速部署检查表

## ⏱️ 预计时间：30-60 分钟

---

## 第一步：代码准备（5分钟）

### 1. 清理调试代码
```bash
# 搜索并移除 console.log
# 检查是否有 TODO 或 FIXME
```

- [ ] 移除 `src/components/layout/Header.tsx` 中的调试日志
- [ ] 检查其他文件的 console.log

### 2. 提交代码
```bash
git add .
git commit -m "Ready for production deployment"
```

- [ ] 代码已提交到本地 Git

---

## 第二步：创建 GitHub 仓库（5分钟）

### 1. 创建仓库
访问：https://github.com/new

- [ ] 仓库已创建
- [ ] 仓库名称：`__________________`

### 2. 推送代码
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

- [ ] 代码已推送到 GitHub

---

## 第三步：准备生产数据库（10分钟）

### 1. 创建 Supabase 项目
访问：https://supabase.com/dashboard

- [ ] 项目已创建
- [ ] 项目名称：`__________________`
- [ ] 区域：`__________________`

### 2. 记录配置信息
```
SUPABASE_URL: _________________________________
SUPABASE_ANON_KEY: ____________________________
```

### 3. 执行数据库迁移
在 Supabase SQL Editor 中依次执行：

- [ ] `001_create_tenants_table.sql`
- [ ] `002_create_tenant_settings_table.sql`
- [ ] `003_create_audit_logs_table.sql`
- [ ] `004_create_system_settings_table.sql`
- [ ] `005_create_password_reset_tokens_table.sql`
- [ ] `006_add_tenant_columns.sql`
- [ ] `007_create_rls_policies.sql`
- [ ] `008_create_helper_functions.sql`
- [ ] `009_set_tenant_id_not_null.sql`
- [ ] `010_fix_rls_infinite_recursion_v2.sql`
- [ ] `011_create_settings_table.sql` ⭐ **重要**
- [ ] `create-storage-bucket.sql`

### 4. 创建超级管理员
- [ ] 执行 `010_create_super_admin.sql`
- [ ] 记录管理员邮箱：`__________________`
- [ ] 记录管理员密码：`__________________`

---

## 第四步：部署到 Vercel（10分钟）

### 1. 注册/登录 Vercel
访问：https://vercel.com/signup

- [ ] 已使用 GitHub 账号登录

### 2. 导入项目
- [ ] 点击 "Add New..." → "Project"
- [ ] 选择 GitHub 仓库
- [ ] 点击 "Import"

### 3. 配置环境变量
添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL = [从上面复制]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [从上面复制]
```

- [ ] 环境变量已添加

### 4. 部署
- [ ] 点击 "Deploy"
- [ ] 等待部署完成
- [ ] 部署 URL：`__________________`

---

## 第五步：验证部署（10分钟）

### 1. 访问网站
访问您的 Vercel URL

- [ ] 首页正常显示
- [ ] 网站名称显示正确
- [ ] 图片正常加载
- [ ] 移动端显示正常

### 2. 测试 Admin 系统
访问：`https://你的域名.vercel.app/admin/login`

- [ ] 登录页面正常
- [ ] 可以登录
- [ ] 仪表板正常显示
- [ ] 设置页面正常

### 3. 测试设置同步
1. 在 Admin 修改网站名称
2. 保存
3. 刷新首页

- [ ] 设置同步正常工作

### 4. 测试 Super Admin
访问：`https://你的域名.vercel.app/super-admin/login`

- [ ] 登录页面正常
- [ ] 可以登录
- [ ] 功能正常

---

## 第六步：配置域名（可选，10分钟）

### 1. 在 Vercel 添加域名
- [ ] 项目设置 → Domains
- [ ] 添加域名：`__________________`

### 2. 配置 DNS
在域名提供商处添加：

```
A 记录：@ → 76.76.21.21
CNAME 记录：www → cname.vercel-dns.com
```

- [ ] DNS 已配置
- [ ] 等待生效（5-30分钟）

---

## 第七步：最终配置（10分钟）

### 1. 更新网站设置
访问：`https://你的域名/admin/settings`

更新以下信息：
- [ ] 网站名称
- [ ] 网站描述
- [ ] 联系邮箱
- [ ] 联系电话

### 2. 测试所有功能
- [ ] 用户注册
- [ ] 用户登录
- [ ] 律师列表
- [ ] 咨询预约
- [ ] 模板下载
- [ ] 文章阅读

### 3. 性能检查
访问：https://pagespeed.web.dev/

- [ ] 输入您的网站 URL
- [ ] 检查性能分数
- [ ] 记录分数：`__________________`

---

## ✅ 部署完成检查

### 功能测试
- [ ] 所有页面正常访问
- [ ] 所有功能正常工作
- [ ] 移动端适配正常
- [ ] 无控制台错误

### 性能测试
- [ ] 首页加载速度 < 3秒
- [ ] 图片正常加载
- [ ] 无明显卡顿

### 安全检查
- [ ] HTTPS 已启用
- [ ] 环境变量已配置
- [ ] 敏感信息已隐藏
- [ ] RLS 策略已启用

---

## 🎉 恭喜！部署成功！

**您的网站信息：**
```
生产环境 URL: _________________________________
Admin 登录: _________________________________/admin/login
Super Admin: _________________________________/super-admin/login
```

**下一步：**
1. 📢 分享您的网站
2. 📊 监控网站性能
3. 🔄 收集用户反馈
4. 🚀 持续优化改进

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. Vercel 部署日志
2. 浏览器控制台
3. Supabase 日志
4. `部署上线指南.md` 详细文档

---

**部署日期：** `__________________`
**部署人员：** `__________________`
**版本号：** `v1.0.0`
