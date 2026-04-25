# 安装指南

## 前置要求

在开始之前，请确保您的系统已安装以下软件：

### 1. 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本（推荐 18.x 或更高版本）。

**Windows 安装步骤：**
1. 下载 Windows 安装程序（.msi 文件）
2. 运行安装程序，按照提示完成安装
3. 安装完成后，打开命令提示符或 PowerShell，验证安装：
   ```bash
   node --version
   npm --version
   ```

### 2. 安装项目依赖

在项目根目录下运行：

```bash
npm install
```

这将安装所有必要的依赖包，包括：
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons
- 其他工具库

### 3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
copy .env.example .env
```

然后编辑 `.env` 文件，填入您的配置信息。

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

## 常见问题

### 问题 1: 无法识别 'node' 命令

**解决方案：**
- 确保 Node.js 已正确安装
- 重启命令行工具
- 检查系统环境变量中是否包含 Node.js 路径

### 问题 2: npm install 失败

**解决方案：**
- 尝试清除 npm 缓存：`npm cache clean --force`
- 删除 `node_modules` 文件夹和 `package-lock.json`
- 重新运行 `npm install`

### 问题 3: 端口 3000 已被占用

**解决方案：**
- 使用其他端口：`npm run dev -- -p 3001`
- 或者关闭占用 3000 端口的程序

## 生产环境部署

### 构建项目

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 推荐的开发工具

- **代码编辑器**: Visual Studio Code
- **浏览器**: Chrome 或 Edge（带开发者工具）
- **Git**: 用于版本控制

## 下一步

安装完成后，您可以：
1. 浏览项目结构，了解各个文件的作用
2. 修改 `components/` 目录下的组件来自定义界面
3. 在 `app/` 目录下添加新页面
4. 配置数据库和第三方服务集成

如有任何问题，请查看 README.md 或联系开发团队。
