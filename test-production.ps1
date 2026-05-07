# 测试生产模式脚本

Write-Host "========================================" -ForegroundColor Green
Write-Host "  测试生产模式" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "这个脚本会在本地测试生产模式，模拟真实部署环境" -ForegroundColor Yellow
Write-Host ""

# 1. 构建生产版本
Write-Host "步骤 1/3: 构建生产版本..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 构建成功" -ForegroundColor Green
Write-Host ""

# 2. 启动生产服务器
Write-Host "步骤 2/3: 启动生产服务器..." -ForegroundColor Cyan
Write-Host "服务器将在 http://localhost:3000 运行" -ForegroundColor Yellow
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 2

# 3. 运行生产服务器
Write-Host "步骤 3/3: 运行中..." -ForegroundColor Cyan
npm start
