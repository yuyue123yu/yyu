#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Malai Legal 生产环境部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm 版本: $(npm -v)${NC}"

echo ""
echo -e "${YELLOW}请选择部署方式:${NC}"
echo "1) Vercel 部署（推荐，免费）"
echo "2) PM2 部署（需要服务器）"
echo "3) Docker 部署（需要 Docker）"
echo "4) 仅构建生产版本"
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}开始 Vercel 部署...${NC}"
        
        # 检查 Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}正在安装 Vercel CLI...${NC}"
            npm install -g vercel
        fi
        
        echo -e "${GREEN}✅ Vercel CLI 已安装${NC}"
        echo ""
        echo -e "${YELLOW}开始部署到 Vercel...${NC}"
        vercel --prod
        
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        ;;
        
    2)
        echo -e "${GREEN}开始 PM2 部署...${NC}"
        
        # 检查 PM2
        if ! command -v pm2 &> /dev/null; then
            echo -e "${YELLOW}正在安装 PM2...${NC}"
            npm install -g pm2
        fi
        
        echo -e "${GREEN}✅ PM2 已安装${NC}"
        
        # 安装依赖
        echo -e "${YELLOW}安装依赖...${NC}"
        npm ci
        
        # 构建项目
        echo -e "${YELLOW}构建项目...${NC}"
        npm run build
        
        # 停止旧进程
        echo -e "${YELLOW}停止旧进程...${NC}"
        pm2 stop malai-legal 2>/dev/null || true
        
        # 启动新进程
        echo -e "${YELLOW}启动新进程...${NC}"
        pm2 start ecosystem.config.js
        
        # 保存 PM2 配置
        pm2 save
        
        # 设置开机自启
        pm2 startup
        
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}常用命令:${NC}"
        echo "  pm2 status          - 查看状态"
        echo "  pm2 logs            - 查看日志"
        echo "  pm2 restart malai-legal - 重启应用"
        echo "  pm2 stop malai-legal    - 停止应用"
        ;;
        
    3)
        echo -e "${GREEN}开始 Docker 部署...${NC}"
        
        # 检查 Docker
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker 未安装${NC}"
            echo "请先安装 Docker: https://docs.docker.com/get-docker/"
            exit 1
        fi
        
        echo -e "${GREEN}✅ Docker 已安装${NC}"
        
        # 检查 docker-compose
        if ! command -v docker-compose &> /dev/null; then
            echo -e "${RED}❌ docker-compose 未安装${NC}"
            echo "请先安装 docker-compose"
            exit 1
        fi
        
        echo -e "${GREEN}✅ docker-compose 已安装${NC}"
        
        # 停止旧容器
        echo -e "${YELLOW}停止旧容器...${NC}"
        docker-compose down
        
        # 构建镜像
        echo -e "${YELLOW}构建 Docker 镜像...${NC}"
        docker-compose build
        
        # 启动容器
        echo -e "${YELLOW}启动容器...${NC}"
        docker-compose up -d
        
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  部署完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}常用命令:${NC}"
        echo "  docker-compose logs -f  - 查看日志"
        echo "  docker-compose restart  - 重启容器"
        echo "  docker-compose stop     - 停止容器"
        echo "  docker-compose down     - 停止并删除容器"
        ;;
        
    4)
        echo -e "${GREEN}开始构建生产版本...${NC}"
        
        # 安装依赖
        echo -e "${YELLOW}安装依赖...${NC}"
        npm ci
        
        # 构建项目
        echo -e "${YELLOW}构建项目...${NC}"
        npm run build
        
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  构建完成！${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${YELLOW}启动生产服务器:${NC}"
        echo "  npm start"
        ;;
        
    *)
        echo -e "${RED}无效的选项${NC}"
        exit 1
        ;;
esac
