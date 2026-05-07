# 网页端多语言全面测试指南

## ✅ 已完成的修复

### 1. 修复 localStorage Key 冲突
- **问题**: 网页端和超级管理员系统共用同一个 localStorage key (`'superadmin-language'`)
- **解决**: 修改 `LanguageProvider` 支持自定义 `storageKey` 参数
  - 网页端使用: `localStorage.getItem('language')`
  - 超级管理员使用: `localStorage.getItem('superadmin-language')`

### 2. 添加完整的三语言翻译
已为以下内容添加中文、英文、马来语翻译：

#### 通用翻译 (`common.*`) - 18个
- contact, login, register, services, lawyers, about, knowledge
- consultation, templates, rating, price, hot, new, free
- viewAll, learnMore, getStarted, readMore

#### 首页翻译 (`home.*`) - 25个
- heroTitle, heroSubtitle, searchPlaceholder, searchLawyers, searchButton
- legalTemplates, professionalTemplates, browseTemplates
- onlineLawyerConsultation, consultationFrom, consultNow
- contractReview, reviewFrom, submitReview
- hotCategories, certifiedLawyers, avgResponse, clientRating
- freeDownload, replyWithin, professionalReview
- legalKnowledge, freeAccess, exploreNow

#### 服务分类翻译 (`services.*`) - 7个
- debt, family, business, property, criminal, employment, ip

#### 模板页面翻译 (`pages.*`) - 28个
- templatesTitle, templatesSubtitle, searchTemplates
- categoryFilter, allTemplates, loading, noTemplatesFound
- found, foundTemplates, downloads, free, downloading, download
- popularCategories, templates, templateInfo
- language, fileSize, format, lastUpdated
- detailedDescription, templateFeatures
- compliantWithLaw, lawyerReviewed, editablePDF
- includesInstructions, downloadNow

**总计**: 78+ 翻译 key，每个都有中文、英文、马来语三个版本

## 🧪 全面测试步骤

### 测试 1: 首页 (/)

1. **访问首页**: `http://localhost:3000/`

2. **测试中文** (默认):
   - ✅ 顶部导航: "服务", "找律师", "关于我们", "法律知识"
   - ✅ 搜索框: "搜索律师"
   - ✅ 产品卡片: "法律文书模板", "在线律师咨询", "合同审核"
   - ✅ 按钮: "浏览模板", "立即咨询", "提交审核"
   - ✅ 统计数据: "认证律师", "平均响应时间", "客户评分"

3. **切换到英文**:
   - 点击右上角 🌐 图标
   - 选择 🇬🇧 English
   - ✅ 验证所有文本变为英文

4. **切换到马来语**:
   - 点击右上角 🌐 图标
   - 选择 🇲🇾 Bahasa
   - ✅ 验证所有文本变为马来语

5. **刷新页面**:
   - ✅ 语言选择应该保持

### 测试 2: 模板页面 (/templates)

1. **访问模板页面**: `http://localhost:3000/templates`

2. **测试中文**:
   - ✅ 页面标题: "法律文书模板"
   - ✅ 副标题: "33+ 专业法律文书模板"
   - ✅ 搜索框: "搜索模板..."
   - ✅ 分类筛选: "分类筛选", "全部模板"
   - ✅ 按钮: "下载", "免费"
   - ✅ 统计: "次下载"

3. **切换到英文**:
   - ✅ 页面标题: "Legal Document Templates"
   - ✅ 副标题: "33+ Professional Legal Document Templates"
   - ✅ 搜索框: "Search templates..."
   - ✅ 分类筛选: "Category Filter", "All Templates"
   - ✅ 按钮: "Download", "Free"
   - ✅ 统计: "downloads"

4. **切换到马来语**:
   - ✅ 页面标题: "Templat Dokumen Undang-undang"
   - ✅ 副标题: "33+ Templat Dokumen Undang-undang Profesional"
   - ✅ 搜索框: "Cari templat..."
   - ✅ 分类筛选: "Penapis Kategori", "Semua Templat"
   - ✅ 按钮: "Muat Turun", "Percuma"
   - ✅ 统计: "muat turun"

5. **点击模板卡片**:
   - ✅ 弹出详情模态框
   - ✅ 验证模态框中的所有文本也已翻译
   - ✅ 测试 "立即下载" / "Download Now" / "Muat Turun Sekarang" 按钮

### 测试 3: Header 导航

1. **测试所有导航链接**:
   - ✅ 服务 / Services / Perkhidmatan
   - ✅ 找律师 / Find Lawyers / Cari Peguam
   - ✅ 关于我们 / About Us / Tentang Kami
   - ✅ 法律知识 / Legal Knowledge / Pengetahuan Undang-undang
   - ✅ 在线咨询 / Consultation / Perundingan

2. **测试顶部栏**:
   - ✅ "24/7 联系我们" / "24/7 Contact Us" / "24/7 Hubungi Kami"
   - ✅ "登录" / "Login" / "Log Masuk"
   - ✅ "注册" / "Register" / "Daftar"

### 测试 4: 语言切换器

1. **测试语言切换器显示**:
   - ✅ 中文: 🇨🇳 中文
   - ✅ 英文: 🇬🇧 English
   - ✅ 马来语: 🇲🇾 Bahasa

2. **测试语言切换功能**:
   - ✅ 点击切换器打开下拉菜单
   - ✅ 选择语言后立即生效
   - ✅ 当前语言显示勾选标记 ✓
   - ✅ 点击外部关闭下拉菜单

3. **测试 localStorage 持久化**:
   - ✅ 切换语言后刷新页面
   - ✅ 语言选择应该保持
   - ✅ 打开开发者工具 > Application > Local Storage
   - ✅ 验证 `language` key 的值 (zh/en/ms)

### 测试 5: 超级管理员系统独立性

1. **访问超级管理员登录**: `http://localhost:3000/super-admin/login`

2. **测试超级管理员语言切换**:
   - ✅ 右上角应该有独立的语言切换器
   - ✅ 只显示中文和英文选项（不显示马来语）
   - ✅ 切换语言后验证翻译

3. **验证 localStorage 独立性**:
   - ✅ 打开开发者工具 > Application > Local Storage
   - ✅ 应该看到两个 key:
     - `language`: 网页端语言 (zh/en/ms)
     - `superadmin-language`: 超级管理员语言 (zh/en)
   - ✅ 修改网页端语言不应影响超级管理员语言
   - ✅ 修改超级管理员语言不应影响网页端语言

### 测试 6: 浏览器兼容性

测试以下浏览器:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (如果可用)

每个浏览器测试:
1. 语言切换功能
2. localStorage 持久化
3. 页面刷新后语言保持

### 测试 7: 移动端响应式

1. **打开开发者工具** (F12)
2. **切换到移动设备模式** (Ctrl+Shift+M)
3. **测试不同设备**:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)

4. **验证**:
   - ✅ 语言切换器在移动端正常显示
   - ✅ 翻译文本在小屏幕上不会溢出
   - ✅ 所有按钮和链接可点击

## 🐛 已知问题和解决方案

### 问题 1: 页面显示翻译 key 而不是翻译文本
**症状**: 页面显示 `pages.templatesTitle` 而不是 "法律文书模板"
**原因**: 翻译 key 不存在于 LanguageContext 中
**解决**: 已添加所有缺失的翻译 key

### 问题 2: 切换语言后部分文本没有变化
**症状**: 切换语言后某些文本仍然是中文
**原因**: 组件中硬编码了文本，没有使用 `t()` 函数
**解决**: 需要修改组件使用 `t()` 函数

### 问题 3: 刷新页面后语言重置
**症状**: 刷新页面后语言变回默认中文
**原因**: localStorage key 冲突或未正确保存
**解决**: 已修复 localStorage key 冲突问题

### 问题 4: 超级管理员和网页端语言互相影响
**症状**: 修改网页端语言会影响超级管理员语言
**原因**: 共用同一个 localStorage key
**解决**: 已分离为两个独立的 key

## 📊 测试结果记录表

| 测试项 | 中文 | 英文 | 马来语 | 状态 |
|--------|------|------|--------|------|
| 首页 Header | ⬜ | ⬜ | ⬜ | 待测试 |
| 首页 Hero | ⬜ | ⬜ | ⬜ | 待测试 |
| 首页 Promotions | ⬜ | ⬜ | ⬜ | 待测试 |
| 模板页面标题 | ⬜ | ⬜ | ⬜ | 待测试 |
| 模板页面搜索 | ⬜ | ⬜ | ⬜ | 待测试 |
| 模板页面分类 | ⬜ | ⬜ | ⬜ | 待测试 |
| 模板卡片 | ⬜ | ⬜ | ⬜ | 待测试 |
| 模板详情模态框 | ⬜ | ⬜ | ⬜ | 待测试 |
| 语言切换器 | ⬜ | ⬜ | ⬜ | 待测试 |
| localStorage 持久化 | ⬜ | ⬜ | ⬜ | 待测试 |
| 超级管理员独立性 | ⬜ | ⬜ | ⬜ | 待测试 |
| 移动端响应式 | ⬜ | ⬜ | ⬜ | 待测试 |

**图例**: ✅ 通过 | ❌ 失败 | ⬜ 待测试

## 🔧 如果发现问题

### 步骤 1: 确认翻译 key 存在
1. 打开 `src/contexts/LanguageContext.tsx`
2. 搜索翻译 key (例如: `pages.templatesTitle`)
3. 确认在 `zh`, `en`, `ms` 三个对象中都存在

### 步骤 2: 确认组件使用翻译
1. 打开组件文件
2. 确认导入了 `useLanguage`: `import { useLanguage } from '@/contexts/LanguageContext';`
3. 确认使用了 `t()` 函数: `const { t } = useLanguage();`
4. 确认文本使用了翻译: `{t('pages.templatesTitle')}`

### 步骤 3: 清除浏览器缓存
1. 打开开发者工具 (F12)
2. 右键点击刷新按钮
3. 选择 "清空缓存并硬性重新加载"

### 步骤 4: 检查控制台错误
1. 打开开发者工具 (F12)
2. 切换到 Console 标签
3. 查看是否有错误信息

## ✅ 完成检查清单

测试完成后，请确认:
- [ ] 所有页面的中文翻译正常
- [ ] 所有页面的英文翻译正常
- [ ] 所有页面的马来语翻译正常
- [ ] 语言切换器功能正常
- [ ] localStorage 持久化正常
- [ ] 超级管理员系统独立性正常
- [ ] 移动端响应式正常
- [ ] 浏览器兼容性正常

## 📝 备注

- 如果发现任何未翻译的文本，请记录翻译 key 并添加到 LanguageContext
- 如果发现翻译不准确，请更新对应的翻译文本
- 如果发现新的页面需要翻译，请按照相同的模式添加翻译

---

**测试日期**: _____________
**测试人员**: _____________
**测试结果**: ✅ 通过 / ❌ 失败
**备注**: _____________
