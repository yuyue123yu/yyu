# 🚀 部署指南 - GitHub Pages

## 📋 部署前准备清单

### 1. 确认项目状态
- [x] 所有功能测试通过
- [x] 语言切换正常工作
- [x] 无编译错误
- [ ] 本地测试完成

---

## 🔧 第一步：配置生产环境

### 1.1 更新 next.config.mjs

打开 `next.config.mjs` 文件，**取消注释** basePath 和 assetPrefix：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // 取消下面两行的注释
  basePath: '/yyu',
  assetPrefix: '/yyu/',
};

export default nextConfig;
```

**重要**: 
- `basePath: '/yyu'` 中的 `yyu` 是你的仓库名称
- 如果你的仓库名不是 `yyu`，请修改为你的实际仓库名

### 1.2 验证配置

运行本地构建测试：
```bash
npm run build
```

如果构建成功，你会看到：
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## 📦 第二步：提交代码到 GitHub

### 2.1 检查 Git 状态

```bash
git status
```

你应该看到修改的文件列表。

### 2.2 添加所有更改

```bash
git add .
```

### 2.3 提交更改

```bash
git commit -m "准备部署：配置生产环境和完成所有功能"
```

### 2.4 推送到 GitHub

```bash
git push origin main
```

如果你的主分支是 `master`，使用：
```bash
git push origin master
```

---

## ⚙️ 第三步：配置 GitHub Pages

### 3.1 访问仓库设置

1. 打开浏览器，访问你的 GitHub 仓库
2. 地址应该是：`https://github.com/yuyue123yu/yyu`
3. 点击仓库顶部的 **Settings** (设置)

### 3.2 启用 GitHub Pages

1. 在左侧菜单中找到 **Pages**
2. 在 "Source" 部分：
   - 选择 **GitHub Actions** (不是 Deploy from a branch)
3. 保存设置

### 3.3 确认 GitHub Actions 工作流

你的仓库应该已经有 `.github/workflows/deploy.yml` 文件。

✅ **已确认**: 工作流文件存在并配置正确！

---

## 🎯 第四步：触发部署

### 4.1 推送代码会自动触发部署

当你执行 `git push` 后，GitHub Actions 会自动：
1. 检测到代码推送
2. 运行构建流程
3. 部署到 GitHub Pages

### 4.2 查看部署进度

1. 访问你的仓库页面
2. 点击顶部的 **Actions** 标签
3. 你会看到一个正在运行的工作流
4. 点击它查看详细进度

部署过程大约需要 **2-5 分钟**。

### 4.3 部署状态

你会看到两个任务：
- ✅ **build** - 构建项目
- ✅ **deploy** - 部署到 GitHub Pages

等待两个任务都显示绿色的 ✅ 标记。

---

## 🌐 第五步：访问你的网站

### 5.1 网站地址

部署成功后，你的网站地址是：

```
https://yuyue123yu.github.io/yyu/
```

### 5.2 测试网站

访问网站后，测试以下功能：
- [ ] 首页正常显示
- [ ] 语言切换正常工作
- [ ] 所有链接可以点击
- [ ] 图片正常加载
- [ ] 导航正常工作

---

## 🔍 故障排查

### 问题1: 部署失败

**症状**: GitHub Actions 显示红色 ❌

**解决方案**:
1. 点击失败的工作流查看错误日志
2. 常见原因：
   - 构建错误：检查代码是否有错误
   - 依赖问题：确保 package.json 正确
3. 修复后重新推送代码

### 问题2: 网站显示 404

**症状**: 访问网站显示 "404 Page Not Found"

**解决方案**:
1. 确认 GitHub Pages 已启用
2. 确认选择了 "GitHub Actions" 作为源
3. 等待几分钟让 DNS 生效
4. 清除浏览器缓存

### 问题3: 样式或图片不显示

**症状**: 网站显示但样式混乱或图片不显示

**解决方案**:
1. 确认 `next.config.mjs` 中的 basePath 正确
2. 确认 basePath 与仓库名一致
3. 重新构建并部署

### 问题4: 路由不工作

**症状**: 点击链接后显示 404

**解决方案**:
1. 这是正常的，因为 GitHub Pages 不支持客户端路由
2. 解决方法：使用 hash 路由或配置 404.html
3. 或者考虑使用 Vercel/Netlify 部署

---

## 🎨 第六步：自定义域名（可选）

如果你有自己的域名，可以配置自定义域名：

### 6.1 在 GitHub 设置

1. 进入仓库 Settings > Pages
2. 在 "Custom domain" 输入你的域名
3. 点击 Save

### 6.2 配置 DNS

在你的域名提供商处添加 DNS 记录：

**A 记录**:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**或 CNAME 记录**:
```
yuyue123yu.github.io
```

---

## 📊 部署后检查清单

### 功能测试
- [ ] 首页加载正常
- [ ] 语言切换工作
- [ ] 服务页面可访问
- [ ] 律师页面可访问
- [ ] 法律知识页面可访问
- [ ] 所有链接正常
- [ ] 表单可以提交
- [ ] 下载功能正常

### 性能测试
- [ ] 首次加载速度 < 5秒
- [ ] 页面切换流畅
- [ ] 移动端体验良好

### SEO 检查
- [ ] 页面标题正确
- [ ] Meta 描述存在
- [ ] 图片有 alt 属性

---

## 🔄 后续更新流程

每次更新代码后：

1. **本地测试**
   ```bash
   npm run dev
   # 测试所有功能
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "更新说明"
   git push origin main
   ```

3. **自动部署**
   - GitHub Actions 自动构建和部署
   - 等待 2-5 分钟
   - 访问网站验证更新

---

## 🚀 替代部署方案

如果 GitHub Pages 不满足需求，可以考虑：

### Vercel (推荐)
- ✅ 支持服务端渲染
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 零配置部署

部署到 Vercel：
```bash
npm install -g vercel
vercel
```

### Netlify
- ✅ 简单易用
- ✅ 持续部署
- ✅ 表单处理
- ✅ 免费 SSL

### Cloudflare Pages
- ✅ 快速全球访问
- ✅ 无限带宽
- ✅ 免费 SSL

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 GitHub Actions 日志
2. 检查浏览器控制台错误
3. 参考 Next.js 部署文档
4. 联系开发团队

---

## ✅ 完成！

恭喜！你的网站已经成功部署到 GitHub Pages！

**网站地址**: https://yuyue123yu.github.io/yyu/

记得分享给你的用户！🎉

