# Malai Legal 生产环境部署脚本 (Windows PowerShell)

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Malai Legal 生产环境部署脚本" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 检查 Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装" -ForegroundColor Red
    exit 1
}

# 检查 npm
try {
    $npmVersion = npm -v
    Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm 未安装" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "请选择部署方式:" -ForegroundColor Yellow
Write-Host "1) Vercel 部署（推荐，免费）"
Write-Host "2) PM2 部署（需要服务器）"
Write-Host "3) Docker 部署（需要 Docker）"
Write-Host "4) 仅构建生产版本"
$choice = Read-Host "请输入选项 (1-4)"

switch ($choice) {
    "1" {
        Write-Host "开始 Vercel 部署..." -ForegroundColor Green
        
        # 检查 Vercel CLI
        try {
            vercel --version | Out-Null
            Write-Host "✅ Vercel CLI 已安装" -ForegroundColor Green
        } catch {
            Write-Host "正在安装 Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host ""
        Write-Host "开始部署到 Vercel..." -ForegroundColor Yellow
        vercel --prod
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  部署完成！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "开始 PM2 部署..." -ForegroundColor Green
        
        # 检查 PM2
        try {
            pm2 --version | Out-Null
            Write-Host "✅ PM2 已安装" -ForegroundColor Green
        } catch {
            Write-Host "正在安装 PM2..." -ForegroundColor Yellow
            npm install -g pm2
            npm install -g pm2-windows-startup
            pm2-startup install
        }
        
        # 安装依赖
        Write-Host "安装依赖..." -ForegroundColor Yellow
        npm ci
        
        # 构建项目
        Write-Host "构建项目..." -ForegroundColor Yellow
        npm run build
        
        # 停止旧进程
        Write-Host "停止旧进程..." -ForegroundColor Yellow
        pm2 stop malai-legal 2>$null
        
        # 启动新进程
        Write-Host "启动新进程..." -ForegroundColor Yellow
        pm2 start ecosystem.config.js
        
        # 保存 PM2 配置
        pm2 save
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  部署完成！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "常用命令:" -ForegroundColor Yellow
        Write-Host "  pm2 status          - 查看状态"
        Write-Host "  pm2 logs            - 查看日志"
        Write-Host "  pm2 restart malai-legal - 重启应用"
        Write-Host "  pm2 stop malai-legal    - 停止应用"
    }
    
    "3" {
        Write-Host "开始 Docker 部署..." -ForegroundColor Green
        
        # 检查 Docker
        try {
            docker --version | Out-Null
            Write-Host "✅ Docker 已安装" -ForegroundColor Green
        } catch {
            Write-Host "❌ Docker 未安装" -ForegroundColor Red
            Write-Host "请先安装 Docker Desktop: https://docs.docker.com/desktop/install/windows-install/"
            exit 1
        }
        
        # 检查 docker-compose
        try {
            docker-compose --version | Out-Null
            Write-Host "✅ docker-compose 已安装" -ForegroundColor Green
        } catch {
            Write-Host "❌ docker-compose 未安装" -ForegroundColor Red
            exit 1
        }
        
        # 停止旧容器
        Write-Host "停止旧容器..." -ForegroundColor Yellow
        docker-compose down
        
        # 构建镜像
        Write-Host "构建 Docker 镜像..." -ForegroundColor Yellow
        docker-compose build
        
        # 启动容器
        Write-Host "启动容器..." -ForegroundColor Yellow
        docker-compose up -d
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  部署完成！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "常用命令:" -ForegroundColor Yellow
        Write-Host "  docker-compose logs -f  - 查看日志"
        Write-Host "  docker-compose restart  - 重启容器"
        Write-Host "  docker-compose stop     - 停止容器"
        Write-Host "  docker-compose down     - 停止并删除容器"
    }
    
    "4" {
        Write-Host "开始构建生产版本..." -ForegroundColor Green
        
        # 安装依赖
        Write-Host "安装依赖..." -ForegroundColor Yellow
        npm ci
        
        # 构建项目
        Write-Host "构建项目..." -ForegroundColor Yellow
        npm run build
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  构建完成！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "启动生产服务器:" -ForegroundColor Yellow
        Write-Host "  npm start"
    }
    
    default {
        Write-Host "无效的选项" -ForegroundColor Red
        exit 1
    }
}
