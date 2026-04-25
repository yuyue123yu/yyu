@echo off
chcp 65001 >nul
echo ========================================
echo   马来西亚法律咨询平台 - 启动脚本
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误：未检测到 Node.js
    echo.
    echo 请先安装 Node.js：
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载并安装 LTS 版本
    echo 3. 重启命令行后再运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ 检测到 Node.js
node --version
echo.

REM 检查是否已安装依赖
if not exist "node_modules\" (
    echo 📦 首次运行，正在安装依赖...
    echo 这可能需要几分钟，请耐心等待...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ 依赖安装失败
        echo 请检查网络连接或尝试使用国内镜像：
        echo npm config set registry https://registry.npmmirror.com
        pause
        exit /b 1
    )
    echo.
    echo ✅ 依赖安装完成！
    echo.
)

echo 🚀 正在启动开发服务器...
echo.
echo 启动后请访问：http://localhost:3000
echo 按 Ctrl+C 可以停止服务器
echo.
echo ========================================
echo.

call npm run dev
