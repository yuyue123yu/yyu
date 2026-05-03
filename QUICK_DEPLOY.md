# ⚡ 快速部署清单 (5分钟)

## 🎯 你现在需要做的事情

### 第一步：修改配置文件 (1分钟)

打开 `next.config.mjs` 文件，找到这两行：

```javascript
// basePath: '/yyu',
// assetPrefix: '/yyu/',
```

**删除前面的 `//`**，变成：

```javascript
basePath: '/yyu',
assetPrefix: '/yyu/',
```

保存文件。

---

### 第二步：测试构建 (1分钟)

在终端运行：

```bash
npm run build
```

等待构建完成，应该看到 ✓ 成功的标记。

---

### 第三步：提交代码 (2分钟)

在终端依次运行：

```bash
git add .
git commit -m "配置生产环境，准备部署"
git push origin main
```

如果你的主分支是 `master`，最后一行改为：
```bash
git push origin master
```

---

### 第四步：等待部署 (2-5分钟)

1. 打开浏览器，访问：
   ```
   https://github.com/yuyue123yu/yyu/actions
   ```

2. 你会看到一个正在运行的工作流（黄色圆圈 🟡）

3. 等待它变成绿色的勾 ✅

4. 完成后，访问你的网站：
   ```
   https://yuyue123yu.github.io/yyu/
   ```

---

## ✅ 完成！

就这么简单！你的网站已经上线了！

---

## 🔧 如果遇到问题

### 问题1: git push 失败

**错误信息**: "Permission denied" 或 "Authentication failed"

**解决方案**:
```bash
# 检查你的 Git 配置
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"

# 重新推送
git push origin main
```

### 问题2: 构建失败

**错误信息**: 看到红色的错误信息

**解决方案**:
1. 复制错误信息
2. 检查是否有语法错误
3. 运行 `npm run dev` 确保本地可以运行
4. 修复错误后重新提交

### 问题3: 网站显示 404

**解决方案**:
1. 等待 5-10 分钟（DNS 需要时间生效）
2. 清除浏览器缓存（Ctrl + Shift + Delete）
3. 尝试无痕模式访问

---

## 📱 测试你的网站

访问网站后，测试这些功能：

- [ ] 首页正常显示
- [ ] 点击右上角切换语言
- [ ] 点击"服务"卡片
- [ ] 点击"律师"卡片
- [ ] 点击"法律知识"
- [ ] 在手机上访问

---

## 🎉 下一步

网站上线后，你可以：

1. **分享链接**
   ```
   https://yuyue123yu.github.io/yyu/
   ```

2. **监控访问**
   - 使用 Google Analytics
   - 查看 GitHub Insights

3. **持续更新**
   - 修改代码
   - git push
   - 自动部署

---

## 💡 专业提示

### 更快的部署方式

如果你想要更专业的部署，推荐使用 **Vercel**：

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 导入你的仓库
4. 点击 Deploy
5. 完成！（更快，更稳定，支持更多功能）

Vercel 的优势：
- ✅ 部署更快（1-2分钟）
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 支持服务端功能
- ✅ 免费额度充足

---

## 📞 需要帮助？

如果有任何问题，检查：
1. GitHub Actions 日志（查看具体错误）
2. 浏览器控制台（F12）
3. 确认所有文件都已提交

---

**祝部署顺利！** 🚀
