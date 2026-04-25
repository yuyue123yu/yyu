# 🚀 快速启动指南

## ⚠️ 重要：你需要先安装 Node.js

你的系统目前还没有安装 Node.js，这是运行项目的必要条件。

## 📥 第一步：安装 Node.js

### 方法 1：官网下载（推荐）

1. **访问 Node.js 官网**
   - 打开浏览器，访问：https://nodejs.org/
   
2. **下载 LTS 版本**
   - 点击绿色的 "LTS" 按钮（推荐版本）
   - 会自动下载适合 Windows 的安装程序（.msi 文件）

3. **运行安装程序**
   - 双击下载的 .msi 文件
   - 点击 "Next" 按钮
   - 接受许可协议
   - 保持默认安装路径
   - **重要**：确保勾选 "Automatically install the necessary tools" 选项
   - 点击 "Install" 开始安装
   - 等待安装完成

4. **验证安装**
   - 关闭当前的命令行窗口
   - 重新打开一个新的 PowerShell 或命令提示符
   - 输入以下命令：
   ```bash
   node --version
   ```
   - 如果显示版本号（如 v20.x.x），说明安装成功！

### 方法 2：使用 Chocolatey（高级用户）

如果你已经安装了 Chocolatey 包管理器：
```bash
choco install nodejs-lts
```

## 🎯 第二步：安装项目依赖

安装好 Node.js 后，在项目目录下运行：

```bash
npm install
```

这个过程可能需要 2-5 分钟，请耐心等待。

## ▶️ 第三步：启动开发服务器

```bash
npm run dev
```

你会看到类似这样的输出：
```
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

## 🌐 第四步：在浏览器中查看

打开浏览器，访问：
```
http://localhost:3000
```

你应该能看到马来西亚法律咨询平台的首页！

## 🎨 你会看到什么？

- ✅ 专业的导航栏（带移动端菜单）
- ✅ 英雄区块（搜索功能）
- ✅ 平台特性展示
- ✅ 使用流程说明
- ✅ 顶尖律师推荐
- ✅ 客户评价
- ✅ 行动号召区块
- ✅ 完整的页脚

## 🛠️ 常见问题

### 问题 1：安装 Node.js 后仍然提示找不到 node 命令

**解决方案：**
1. 完全关闭所有命令行窗口
2. 重新打开一个新的 PowerShell
3. 再次尝试 `node --version`

### 问题 2：npm install 很慢

**解决方案：**
使用国内镜像源：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

### 问题 3：端口 3000 被占用

**解决方案：**
使用其他端口：
```bash
npm run dev -- -p 3001
```
然后访问 http://localhost:3001

### 问题 4：防火墙警告

**解决方案：**
- 点击"允许访问"
- 这是正常的，Node.js 需要网络权限来运行开发服务器

## 📞 需要帮助？

如果遇到任何问题：
1. 确保 Node.js 版本是 18.x 或更高
2. 确保在正确的项目目录下运行命令
3. 检查是否有防火墙或杀毒软件阻止

## 🎉 成功启动后

你可以：
- 修改代码，浏览器会自动刷新（热重载）
- 查看 `components/` 目录下的组件
- 编辑 `app/page.tsx` 修改首页内容
- 修改 `tailwind.config.ts` 自定义颜色主题

---

**下载 Node.js：** https://nodejs.org/

**当前项目路径：** C:\Users\余\malai
